"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function Files() {
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const fetchFiles = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await api.get("/Files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err: any) {
      console.error("Failed to fetch files", err);
      if (err.response?.status === 401) {
        router.push("/login"); 
      } else {
        alert("Failed to fetch files");
      }
    }
  };

  useEffect(() => {
    fetchFiles();
    
  }, [token]);


  const handleUpload = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!file || !fileName || !fileType) {
      alert("⚠️ Please select a file and enter details.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("FileType", fileType);
      formData.append("FileName", fileName);
      formData.append("File", file);

      await api.post("/Files", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ File uploaded successfully!");
      setFile(null);
      setFileName("");
      setFileType("");
      fetchFiles(); 
    } catch (err: any) {
      console.error("Upload failed", err);
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        alert("❌ Upload failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id: number) => {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await api.delete(`/Files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFiles();
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        alert("Failed to delete file");
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">📂 Manage Medical Files</h1>

      {/* File Type */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">File Type</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="border rounded-lg p-2 w-full bg-white text-black focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select File Type</option>
          <option>Lab Report</option>
          <option>Prescription</option>
          <option>X-Ray</option>
          <option>Blood Report</option>
          <option>MRI Scan</option>
          <option>CT Scan</option>
        </select>
      </div>

      {/* File Name */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">File Name</label>
        <input
          type="text"
          placeholder="Enter File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="border rounded-lg p-2 w-full bg-white text-black placeholder-black/60 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload File</label>
        <div
          onClick={() => document.getElementById("dropzoneFile")?.click()}
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer text-center bg-gray-100 hover:border-blue-500 hover:bg-gray-200 transition"
        >
          <p>
            Drag & drop your file here, or{" "}
            <span className="text-blue-600 underline">browse</span>
          </p>
          <input
            type="file"
            id="dropzoneFile"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file && (
            <p className="mt-2 text-green-700 text-sm">Selected: {file.name}</p>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold p-2 w-full rounded-lg disabled:opacity-50 transition"
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>

      {/* Uploaded Files */}
      <h2 className="text-xl font-semibold mt-6 mb-3">📑 Uploaded Files</h2>
      <div className="space-y-3">
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between border rounded-lg p-3 bg-white"
            >
              <div>
                <p className="font-medium">{f.fileName}</p>
                <p className="text-sm text-black/70">{f.fileType}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() =>
                    window.open(`https://localhost:7228${f.fileUrl}`, "_blank")
                  }
                  className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
