"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LogOut,
  User as UserIcon,
  BookOpen,
  LayoutDashboard,
  Sigma,
  Menu,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { FormulaDrawer } from "@/components/math/formula-drawer";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  // Mode Ujian Resmi Terkunci: Navigasi global dinonaktifkan sepenuhnya
  if (pathname?.startsWith("/exam")) {
    return (
      <header className="border-b border-amber-900/60 bg-[#0a0e17]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-950 border border-amber-600/50 text-amber-400 font-mono font-bold text-sm shrink-0">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
              <span>MathLearn</span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400 flex items-center gap-1.5 font-sans font-semibold text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                SESI UJIAN RESMI TERKUNCI
              </span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="border-b border-slate-800 bg-[#0a0e17]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-6 sm:gap-8 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white group shrink-0"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 border border-indigo-500/40 text-indigo-400 font-mono font-bold text-base group-hover:border-indigo-500 transition">
                ∑
              </span>
              <span className="text-white font-bold">MathLearn</span>
            </Link>

            {/* Primary Navigation Links (Desktop & Tablet Landscape) */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <Link
                href="/topics"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition font-mono ${
                  pathname.startsWith("/topics")
                    ? "bg-slate-900 text-white border border-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Topik</span>
              </Link>

              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition font-mono ${
                  pathname === "/dashboard"
                    ? "bg-slate-900 text-white border border-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-teal-400" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>

          {/* Secondary Actions & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Formula Sheet Button */}
            <button
              onClick={() => setIsFormulaDrawerOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:border-indigo-500 hover:text-white transition text-xs font-mono font-semibold group min-h-[38px]"
              title="Buka Referensi Rumus Matematika (Esc untuk menutup)"
            >
              <Sigma className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition shrink-0" />
              <span className="hidden sm:inline">Buku Rumus</span>
              <span className="sm:hidden text-[11px]">Rumus</span>
            </button>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-2">
              {isPending ? (
                <div className="w-16 h-8 bg-slate-900 animate-pulse rounded-xl" />
              ) : session?.user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-medium text-white max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-rose-950/50 hover:border-rose-800 hover:text-rose-300 text-slate-300 transition"
                    title="Keluar dari akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-mono px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition font-medium"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="text-xs font-mono px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border border-indigo-500 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Daftar</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile & Tablet Portrait Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 transition"
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-200" />
              ) : (
                <Menu className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Dropdown Sheet */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 bg-[#0d131f]/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-2xl">
            <nav className="flex flex-col space-y-1.5 text-xs font-mono">
              <Link
                href="/topics"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition font-semibold min-h-[44px] ${
                  pathname.startsWith("/topics")
                    ? "bg-slate-900 text-white border border-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Katalog Topik Matematika</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition font-semibold min-h-[44px] ${
                  pathname === "/dashboard"
                    ? "bg-slate-900 text-white border border-slate-700"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Dashboard Siswa</span>
              </Link>
            </nav>

            {/* Mobile Auth Divider & Actions */}
            <div className="pt-3 border-t border-slate-800/80">
              {isPending ? (
                <div className="w-full h-10 bg-slate-900 animate-pulse rounded-xl" />
              ) : session?.user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <UserIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-medium text-white truncate">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 text-xs font-mono py-2.5 rounded-xl border border-rose-900/50 bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 transition font-semibold min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-medium min-h-[44px]"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border border-indigo-500 shadow-sm min-h-[44px]"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Formula Drawer - rendered outside header via Portal */}
      <FormulaDrawer
        isOpen={isFormulaDrawerOpen}
        onClose={() => setIsFormulaDrawerOpen(false)}
      />
    </>
  );
}
