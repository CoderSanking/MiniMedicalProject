"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/Auth/Login", {
        email,
        passwordHash: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      window.dispatchEvent(new Event("authChange"));

      alert("✅ Login successful!");
      router.push("/dashboard"); 
    } catch {
      alert("❌ Login failed. Check email/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔑 Login</h1>

      <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg p-2 w-full mb-3 text-black bg-white focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded-lg p-2 w-full mb-3 text-black bg-white focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 w-full rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
