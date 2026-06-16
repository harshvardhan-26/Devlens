import { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Mail, ShieldCheck } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { user, signInEmail, signInGoogle } = useAuth(); // ✅ FIXED
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  if (user) return <Navigate to="/dashboard" replace />;

  // ✅ EMAIL LOGIN
  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      await signInEmail(form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  // ✅ GOOGLE LOGIN
  async function handleGoogleSuccess(res) {
    try {
      await signInGoogle(res.credential);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Google login failed");
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-mint">
            <BrainCircuit size={17} />
            AI-powered developer reviews
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight text-white">
            Devlens
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-9 text-slate-400">
            Analyze GitHub repositories like a hiring manager,
            uncover weaknesses, improve architecture, and build
            stronger portfolio projects.
          </p>

          <div className="mt-12 space-y-5">
            <div className="flex items-center gap-3">
              <BrainCircuit size={18} className="text-mint" />
              <span className="text-slate-300">
                AI-powered code reviews
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-mint" />
              <span className="text-slate-300">
                Recruiter-style project feedback
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-mint" />
              <span className="text-slate-300">
                Track growth across multiple projects
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass w-full max-w-sm rounded-2xl p-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Welcome Back
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Continue with your Google account
              to access Devlens.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          <p className="mt-8 text-center text-xs leading-6 text-slate-500">
            By continuing, you agree to Devlens
            Terms & Conditions and Privacy Policy.
          </p>
        </motion.div>
      </section>
    </main>
  );
}