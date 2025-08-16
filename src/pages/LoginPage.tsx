import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const API = import.meta.env.VITE_API_URL as string | undefined;

  if (!API) {
    console.warn("VITE_API_URL is missing. Add it to .env.local / Vercel envs.");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API) {
      toast.error("API base URL missing. Check VITE_API_URL.");
      return;
    }
    setSubmitting(true);

    try {
      const userCredential = isSignup
        ? await createUserWithEmailAndPassword(auth, email, pw)
        : await signInWithEmailAndPassword(auth, email, pw);

      const uid = userCredential.user.uid;
      console.log("Firebase UID:", uid);

      const resp = await fetch(`${API}/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Seed failed: ${resp.status} ${text}`);
      }

      toast.success(isSignup ? "Account created!" : "Logged in!");
    } catch (err: any) {
      console.error(err);
      toast.error("Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">{isSignup ? "Sign Up" : "Log In"}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            placeholder="Password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>

          <p
            onClick={() => setIsSignup(!isSignup)}
            className="toggle-auth"
            role="button"
          >
            {isSignup
              ? "Already have an account? Log in"
              : "No account? Sign up"}
          </p>
        </form>
      </div>
    </div>
  );
}
