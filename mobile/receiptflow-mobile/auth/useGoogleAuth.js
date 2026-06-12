// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import { useEffect } from "react";

// WebBrowser.maybeCompleteAuthSession();

// const ANDROID_CLIENT_ID =
//   "96166831779-o1j653j6ebvar92hj8m34toil8n6rupq.apps.googleusercontent.com";

// const WEB_CLIENT_ID =
//   "96166831779-kioj8s851pqm9ovb8smogc5cvglvss8c.apps.googleusercontent.com";
//   const REDIRECT_URI = "receiptflowmobile://oauthredirect";
// export function useGoogleAuth() {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: ANDROID_CLIENT_ID,
//     webClientId: WEB_CLIENT_ID,
  
//     redirectUri: REDIRECT_URI,         
//   });

//   useEffect(() => {
//     if (response?.type === "success") {
//       const token = response.authentication?.accessToken;

//       if (token) {
//         sendToBackend(token);
//       }
//     }
//   }, [response]);

//   const sendToBackend = async (token) => {
//     try {
//     const res = await fetch(
//   "https://receiptflow-1.onrender.com/api/auth/google",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ token }),
//         }
//       );

//       const data = await res.json();
//       console.log("JWT =", data.token);
//     } catch (err) {
//       console.log("Google login backend error:", err);
//     }
//   };

//   return {
//     promptAsync,
//     request,
//   };
// }