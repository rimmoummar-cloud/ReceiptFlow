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
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
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
                token: response.credential, // 👈 أهم سطر
              }),
            }
          );

          const data = await res.json();

          if (data.token) {
            loginWithGoogle(data.token);
            router.push("/invoices");
          }
        } catch (err) {
          console.error("Google login failed", err);
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
     