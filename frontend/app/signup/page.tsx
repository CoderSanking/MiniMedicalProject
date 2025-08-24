"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.fullName || !form.email || !form.password) {
      alert("⚠️ Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/Auth/Signup", {
        fullName: form.fullName,
        email: form.email,
        passwordHash: form.password, 
        gender: form.gender,
        phone: form.phone,
      });

    
alert("✅ Signup successful!");
window.dispatchEvent(new Event("authChange"));  
router.push("/login");

    } catch {
      alert("❌ Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Signup</h1>

      {["fullName", "email", "password", "gender", "phone"].map((field) => (
        <div key={field} className="mb-3">
          <label className="block text-sm font-medium text-gray-200 mb-1 capitalize">
            {field}
          </label>
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            value={(form as any)[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="border rounded-lg p-2 w-full text-black bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 w-full rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  );
}
