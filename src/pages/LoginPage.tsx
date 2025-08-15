import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import React from "react";
import "../styles/LoginPage.css";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;

      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(auth, email, pw);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, pw);
      }

      const uid = userCredential.user.uid;
      console.log("Firebase UID:", uid);

      await fetch(`${API}/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      toast.success("Logged in and mock data generated!");
    } catch (err: any) {
      setError(err.message);
      toast.error("Authentication failed");
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
          />
          <input
            placeholder="Password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button type="submit">
            {isSignup ? "Create Account" : "Login"}
          </button>
          {error && <p className="error-text">{error}</p>}
          <p onClick={() => setIsSignup(!isSignup)} className="toggle-auth">
            {isSignup
              ? "Already have an account? Log in"
              : "No account? Sign up"}
          </p>
        </form>
      </div>
    </div>
  );
}
