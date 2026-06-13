'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authContext";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  const router = useRouter();
const { setAuth } = useAuth();

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    };

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: "365135028752-i2d570thjfhi0ffb9eeedt8hagb7rtbt.apps.googleusercontent.com",

        callback: async (response: any) => {
          try {
            const res = await fetch(
              "https://receiptflow-1.onrender.com/api/auth/google",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: response.credential,
                }),
              }
            );

            const data = await res.json();


if (data.token) {
  setAuth(
    data.token,
    data.user
  );

  router.replace("/invoices");
}
          else {
              console.error("No token returned from backend");
            }
          } catch (err) {
            console.error("Google login failed", err);
          }
        },
      });

      const button = document.getElementById("googleBtn");
      if (button) {
        window.google.accounts.id.renderButton(button, {
          theme: "outline",
          size: "large",
          width: 300,
        });
      }
    };

    loadGoogleScript();
  }, [router]);

  return <div id="googleBtn" />;
}