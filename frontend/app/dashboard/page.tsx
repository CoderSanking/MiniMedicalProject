"use client";
import Profile from "../profile/page";
import Files from "../files/page";
import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const fetchFiles = async () => {
    try {
      const res = await api.get("/Files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  useEffect(() => {
    if (token) fetchFiles();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <Profile />
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6">
          <Files />
        </div>
      </div>
      </div>
  );
}
