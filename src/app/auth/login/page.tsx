"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowRight, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/");
        router.refresh(); // Refresh to update navbar state
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl relative z-10 border border-zinc-100">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <KeyRound className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-zinc-900 tracking-tight">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 font-medium">
            Sign in to your Emax account
          </p>
        </div>

        {registered && (
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-medium border border-green-100 flex items-start gap-3">
             <p>Registration successful! Please login below.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-3">
             <ShieldAlert className="shrink-0 mt-0.5" size={16} />
             <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">Email address</label>
              <input
                required
                type="email"
                placeholder="name@email.com"
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-orange-500/20 text-lg font-black text-white bg-brand-primary hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={20} />}
          </button>
          
          <p className="text-center text-sm text-zinc-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-bold text-brand-primary hover:underline">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
