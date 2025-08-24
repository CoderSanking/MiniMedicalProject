import "./globals.css";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Project",
  description: "Demo project with Next.js + .NET backend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {/* Navbar always visible */}
        <Navbar />
        {/* Main content area */}
        <main className="p-6 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}


