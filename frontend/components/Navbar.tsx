"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const updateToken = () => setToken(localStorage.getItem("token"));

    updateToken(); 

   
    window.addEventListener("storage", updateToken);
    window.addEventListener("authChange", updateToken);

    return () => {
      window.removeEventListener("storage", updateToken);
      window.removeEventListener("authChange", updateToken);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);


    window.dispatchEvent(new Event("authChange"));

    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-lg flex justify-between items-center">
      <h1 className="text-xl font-bold">🏥 Medical File Manager</h1>
      <div className="space-x-4">
        {!token ? (
          <>
            <Link href="/signup" className="hover:text-green-400 transition">
              Signup
            </Link>
            <Link href="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:text-purple-400 transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
