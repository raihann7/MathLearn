import Link from "next/link";
import {
  ArrowRight,
  PenTool,
  BrainCircuit,
  Fingerprint,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Spline,
  Variable,
  DraftingCompass,
  Grid3X3,
} from "lucide-react";
import { MathRenderer } from "@/components/math/math-renderer";

export default function HomePage() {
  const sampleProblem = `Tentukan solusi dari turunan fungsi implisit berikut:
$$\\frac{d}{dx} \\left[ x^3 + y^3 - 3xy = 0 \\right]$$
**Langkah Analisis:** Turunkan kedua ruas terhadap $x$ dengan aturan rantai $\\frac{d}{dx}(y^3) = 3y^2 \\frac{dy}{dx}$.`;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0e17] text-slate-100">
      {/* 1. Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            {/* Main Display Heading - Crisp Solid Text */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] text-balance">
              Pelajari Matematika Melalui Penalaran Logis, Bukan Hafalan
            </h1>

            {/* Subtitle - High contrast slate */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Platform matematika modern untuk SMA dan Universitas. Dilengkapi
              kanvas coretan digital interaktif, mesin tutor Sokratik berjenjang,
              serta stasiun ujian dengan pengawasan integritas anti-cheat.
            </p>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
              <Link
                href="/topics"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 border border-indigo-500 shadow-sm transition text-sm"
              >
                <span>Buka Katalog Kurikulum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold flex items-center justify-center gap-2 transition text-sm"
              >
                <span>Dashboard Belajar</span>
              </Link>
            </div>
          </div>

          {/* 2. Interactive Workbench Preview: Problem + Scratchpad Breakdown */}
          <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                <span className="text-slate-300 font-semibold">
                  STATION PREVIEW: KALKULUS DASAR
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[11px]">
                  PRACTICE_MODE
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> LaTeX Ready
                </span>
              </div>
            </div>

            {/* Two-Column STEM Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {/* Problem & Socratic Guidance Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                    Soal Latihan #01
                  </span>
                  <div className="mt-2 text-slate-200 text-sm sm:text-base leading-relaxed">
                    <MathRenderer content={sampleProblem} />
                  </div>
                </div>

                {/* Socratic Hint Progression Demo */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Socratic Hint Engine:
                  </span>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <p className="font-semibold text-indigo-300">
                          Tier 1: Petunjuk Konsep
                        </p>
                        <p className="text-slate-400 mt-0.5 font-sans">
                          Variabel y merupakan fungsi implisit dari x, sehingga
                          turunan suku y memerlukan aturan rantai.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-teal-900/50 text-teal-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <p className="font-semibold text-teal-300">
                          Tier 2: Formula Kunci
                        </p>
                        <p className="text-slate-400 mt-0.5 font-sans">
                          Gunakan aturan perkalian untuk suku $3xy$: $(uv)&apos; = u&apos;v + uv&apos;$.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Scratchpad Visual Representation */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-950/40 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-indigo-400" />
                      Interactive Scratchpad
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Stroke Memory Active
                    </span>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                    <p className="text-slate-500">// Coretan kalkulasi siswa:</p>
                    <p className="text-white">3x² + 3y²(dy/dx) - 3(y + x dy/dx) = 0</p>
                    <p className="text-indigo-400">3y²(dy/dx) - 3x(dy/dx) = 3y - 3x²</p>
                    <p className="text-emerald-400">dy/dx = (y - x²) / (y² - x)</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-1.5">
                  <p className="text-xs font-bold text-indigo-300">
                    Bebas Coretan Kertas
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Setiap nomor soal memiliki memori kanvas independen dengan
                    dukungan pena, penghapus, dan riwayat pembatalan (undo).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Architecture Breakdown (Asymmetrical, No Card Repetition) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="space-y-4 max-w-2xl mb-14">
          <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase font-semibold">
            ARSITEKTUR & FITUR INTI
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Tiga Instrumen Utama untuk Penguasaan STEM
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Setiap modul dirancang untuk memfasilitasi penalaran aktif dan
            menguji pemahaman tanpa celah manipulasi.
          </p>
        </div>

        <div className="space-y-6">
          {/* Row 1: Dual Mode Testing */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                <span>EVALUASI DUAL-MODE</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Practice Mode vs Exam Mode Berstandar Integritas
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Mode Latihan menyediakan petunjuk instan dan pembahasan KaTeX
                lengkap. Mode Ujian memberlakukan hitung mundur resmi dan pelacak
                alih-tabulasi (anti-cheat blur guard) dengan pengurangan skor
                otomatis jika melanggar.
              </p>
            </div>
            <Link
              href="/topics/turunan-dan-aplikasi"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shrink-0 border border-slate-700 transition flex items-center gap-2"
            >
              <span>Uji Coba Ujian</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Row 2: 2-Column Split for Socratic + Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box A: Socratic Reasoning */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                <BrainCircuit className="w-3.5 h-3.5 text-teal-400" />
                <span>SOCRATIC ENGINE</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                3-Tier Progressive Hinting
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bantuan bertahap yang membimbing proses berpikir: mulai dari
                pemberian petunjuk konseptual, formula dasar yang relevan, hingga
                panduan langkah analitis berikutnya tanpa membuka jawaban akhir.
              </p>
            </div>

            {/* Box B: Curriculum Mastery */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>TRACKING ANALITIK</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Penguasaan Kurikulum & Riwayat Evaluasi
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pantau metrik belajar personal: level penguasaan per topik
                (0-100%), rata-rata skor kuis, streak hari aktif berturut-turut,
                serta arsip materi favorit (bookmarks) tersimpan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curriculum Directory Table Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase font-semibold">
                DAFTAR SILABUS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Topik Matematika Unggulan
              </h2>
            </div>
            <Link
              href="/topics"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Lihat Semua Kurikulum</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 divide-y divide-slate-800 overflow-hidden">
            {[
              {
                title: "Turunan & Aplikasinya (Kalkulus)",
                category: "Kalkulus",
                formula: "\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
                slug: "turunan-dan-aplikasi",
                level: "Menengah",
                icon: Spline,
              },
              {
                title: "Integral Tak Tentu & Tentu",
                category: "Kalkulus",
                formula: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
                slug: "integral-tak-tentu-dan-tentu",
                level: "Menengah",
                icon: Spline,
              },
              {
                title: "Matriks & Sistem Persamaan Linear",
                category: "Aljabar",
                formula: "A \\mathbf{x} = \\mathbf{b} \\implies \\mathbf{x} = A^{-1} \\mathbf{b}",
                slug: "matriks-dan-sistem-persamaan-linear",
                level: "Menengah",
                icon: Grid3X3,
              },
              {
                title: "Trigonometri Lanjut & Identitas",
                category: "Trigonometri",
                formula: "\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B",
                slug: "identitas-dan-persamaan-trigonometri",
                level: "Dasar - Menengah",
                icon: DraftingCompass,
              },
              {
                title: "Statistika & Distribusi Peluang",
                category: "Statistika",
                formula: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
                slug: "statistika-dan-teori-peluang",
                level: "Lanjutan",
                icon: BarChart3,
              },
            ].map((t) => {
              const CategoryIcon = t.icon;
              return (
                <div
                  key={t.slug}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-indigo-950/80 border border-indigo-800/50 text-indigo-300">
                        <CategoryIcon className="w-3 h-3 text-indigo-400" />
                        <span>{t.category}</span>
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {t.level}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      {t.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="hidden md:block max-w-xs text-xs font-mono text-slate-300">
                      <MathRenderer
                        content={`$$${t.formula}$$`}
                        className="[&_.katex-display]:my-0 [&_.katex-display]:py-1 [&_.katex-display]:px-2.5 [&_.katex-display]:bg-slate-950"
                      />
                    </div>
                    <Link
                      href={`/topics/${t.slug}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition shrink-0"
                    >
                      Buka Topik
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MathLearn Academy. Clean STEM Platform.</p>
          <div className="flex items-center gap-6">
            <Link href="/topics" className="hover:text-slate-300 transition">
              Kurikulum
            </Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition">
              Dashboard
            </Link>
            <span className="text-slate-600">LaTeX / KaTeX Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
