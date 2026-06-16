import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ ADD THIS
import App from "./App.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="462613965028-8bdtb00g0ivjjohvdsjajnq0ph2anopn.apps.googleusercontent.com"> {/* ✅ ADD THIS */}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);