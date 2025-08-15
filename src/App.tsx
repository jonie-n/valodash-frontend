import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  <>
    <Toaster position="top-center" />
    {user ? <Dashboard /> : <LoginPage />}
  </>

  return user ? <Dashboard /> : <LoginPage />;
}
