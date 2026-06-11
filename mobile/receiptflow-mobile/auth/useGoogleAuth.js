import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "96166831779-kioj8s851pqm9ovb8smogc5cvglvss8c.apps.googleusercontent.com";

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: CLIENT_ID,

    // مهم جدًا في Expo Go
    useProxy: true,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;

      if (token) {
        sendToBackend(token);
      }
    }
  }, [response]);

  const sendToBackend = async (token: string) => {
    try {
      const res = await fetch(
        "http://192.168.0.100:5241/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await res.json();

      console.log("🔥 JWT =", data.token);
    } catch (err) {
      console.log("Google login backend error:", err);
    }
  };

  return { promptAsync, request };
}