"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePath, setProfileImagePath] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); 
        return;
      }
      try {
        const res = await api.get("/User/Profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFullName(res.data.fullName);
        setEmail(res.data.email);
        setGender(res.data.gender);
        setPhone(res.data.phone);
        setProfileImagePath(res.data.profileImagePath || "");
      } catch (err) {
        console.error("❌ Failed to fetch profile", err);
        router.push("/login"); 
      }
    };
    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("FullName", fullName);
      formData.append("Gender", gender);
      formData.append("Phone", phone);
      if (profileImage) formData.append("ProfileImage", profileImage);

      const res = await api.put("/User/Profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.profileImagePath) {
        setProfileImagePath(res.data.profileImagePath);
        setProfileImage(null);
      }

      alert("✅ Profile updated successfully!");
    } catch {
      alert("❌ Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col items-center text-black">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            profileImage
              ? URL.createObjectURL(profileImage)
              : profileImagePath
              ? `https://localhost:7228${profileImagePath}`
              : "/avatar.png" 
          }
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 border-gray-300 mb-3 object-cover"
        />
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Change Image
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
      </div>

      {/* Full Name */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border rounded-lg p-2 w-full text-black"
        />
      </div>

      {/* Email (read-only) */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="border rounded-lg p-2 w-full bg-gray-100 text-black"
        />
      </div>

      {/* Gender */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium mb-2">Gender</label>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="radio"
                value={g}
                checked={gender === g}
                onChange={(e) => setGender(e.target.value)}
                className="accent-blue-600"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* Phone */}
      <div className="w-full mb-6">
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded-lg p-2 w-full text-black"
          placeholder="+91 9876543210"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 w-full rounded-lg transition"
      >
        Save Changes
      </button>
    </div>
  );
}
