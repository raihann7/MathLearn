import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";

export const metadata: Metadata = {
  title: "MathLearn Academy — Belajar Matematika Interaktif",
  description:
    "Platform belajar matematika SMA & Kuliah dengan Coretan Rumus, Socratic AI Hint, dan Kuis Dinamis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
