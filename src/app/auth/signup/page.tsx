"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    whatsapp: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Redirect to login page on success
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
            <UserPlus className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-zinc-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 font-medium">
            Join Emax to access all our digital tools.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 flex items-start gap-3">
             <ShieldCheck className="shrink-0 mt-0.5" size={16} />
             <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">Contact No</label>
                  <input
                    required
                    type="tel"
                    placeholder="Mobile No"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
               </div>
               <div>
                  <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">WhatsApp No</label>
                  <input
                    required
                    type="tel"
                    placeholder="WhatsApp No"
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
               </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">Email address</label>
              <input
                required
                type="email"
                placeholder="name@email.com"
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-zinc-400 ml-1 mb-1">Password</label>
              <input
                required
                type="password"
                placeholder="Create a strong password"
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:border-brand-primary outline-none transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-orange-500/20 text-lg font-black text-white bg-brand-primary hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? "Signing up..." : "Sign Up"}
            {!loading && <ArrowRight size={20} />}
          </button>
          
          <p className="text-center text-sm text-zinc-500 font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-brand-primary hover:underline">
              Log in instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
