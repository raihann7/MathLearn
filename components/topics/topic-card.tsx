import Link from "next/link";
import { TopicWithMaterials } from "@/lib/db/queries";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Variable,
  DraftingCompass,
  Spline,
  Grid3X3,
  BarChart3,
  Infinity as InfinityIcon,
  Activity,
  Layers,
} from "lucide-react";
import { MathRenderer } from "@/components/math/math-renderer";

interface TopicCardProps {
  topic: TopicWithMaterials;
}

const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Aljabar: Variable,
  Trigonometri: DraftingCompass,
  Geometri: Boxes,
  Kalkulus: Spline,
  Statistika: BarChart3,
  "Kalkulus Lanjut": InfinityIcon,
  "Aljabar Linear": Grid3X3,
  "Persamaan Diferensial": Activity,
  Matriks: Grid3X3,
};

const difficultyBadge = {
  BEGINNER: {
    label: "Dasar",
    class: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
  },
  INTERMEDIATE: {
    label: "Menengah",
    class: "bg-amber-950/80 text-amber-300 border-amber-800/60",
  },
  ADVANCED: {
    label: "Lanjutan",
    class: "bg-rose-950/80 text-rose-300 border-rose-800/60",
  },
};

const topicFormulas: Record<string, string> = {
  // SMA
  "fungsi-komposisi-dan-invers": "(f \\circ g)(x) = f(g(x))",
  "eksponen-dan-logaritma": "a^{m+n} = a^m \\cdot a^n, \\quad ^a\\log b = c",
  "barisan-dan-deret-aritmetika-geometri": "U_n = a + (n-1)b, \\quad S_\\infty = \\frac{a}{1-r}",
  "identitas-dan-persamaan-trigonometri": "\\sin^2\\theta + \\cos^2\\theta = 1",
  "geometri-ruang-dan-dimensi-tiga": "d = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}",
  "limit-fungsi-aljabar-dan-trigonometri": "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
  "turunan-dan-aplikasi": "\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
  "integral-tak-tentu-dan-tentu": "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C",
  "statistika-dan-teori-peluang": "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",

  // Kuliah
  "teknik-integrasi-lanjut-dan-tak-wajar": "\\int u \\, dv = uv - \\int v \\, du",
  "volume-benda-putar-dan-panjang-busur": "V = \\pi \\int_a^b [f(x)]^2 \\, dx",
  "barisan-dan-deret-tak-hingga": "f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n",
  "kalkulus-peubah-banyak-multivariable": "\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)",
  "matriks-dan-sistem-persamaan-linear": "A\\mathbf{x} = \\mathbf{b} \\iff \\mathbf{x} = A^{-1}\\mathbf{b}",
  "ruang-vektor-dan-transformasi-linear": "A\\mathbf{v} = \\lambda\\mathbf{v} \\iff \\det(A - \\lambda I) = 0",
  "persamaan-diferensial-biasa": "\\frac{dy}{dx} + P(x)y = Q(x)",

  // Legacy aliases
  "integral-dasar-dan-aplikasi": "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C",
  "matriks-dan-vektor-linear": "A \\mathbf{x} = \\mathbf{b} \\iff \\mathbf{x} = A^{-1}\\mathbf{b}",
  "trigonometri-analitik": "\\sin^2\\theta + \\cos^2\\theta = 1",
  "statistika-dan-probabilitas": "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
};

export function TopicCard({ topic }: TopicCardProps) {
  const diff = difficultyBadge[topic.difficulty] || difficultyBadge.BEGINNER;
  const formula = topicFormulas[topic.slug] || "\\sum_{i=1}^n x_i";
  const CategoryIcon = CATEGORY_ICON_MAP[topic.category] || Boxes;

  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition duration-150 group">
      <div>
        {/* Category & Difficulty Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded bg-indigo-950/90 text-indigo-300 font-semibold border border-indigo-800/60">
            <CategoryIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{topic.category}</span>
          </span>
          <span
            className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-medium border ${diff.class}`}
          >
            {diff.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition tracking-tight">
          {topic.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {topic.description}
        </p>

        {/* Formula Anchor Preview */}
        <div className="my-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto text-center">
          <MathRenderer
            content={`$$${formula}$$`}
            className="[&_.katex-display]:my-0 [&_.katex-display]:py-1 [&_.katex-display]:px-2 [&_.katex-display]:bg-transparent [&_.katex-display]:border-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{topic.materialsCount ?? 3} Modul Terstruktur</span>
        </div>

        <Link
          href={`/topics/${topic.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          <span>Buka Silabus</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
