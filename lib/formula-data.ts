export interface FormulaItem {
  id: string;
  title: string;
  category: "Aljabar" | "Trigonometri" | "Kalkulus" | "Matriks" | "Statistika";
  latex: string;
  description: string;
  variables?: string;
}

export const FORMULA_CATEGORIES = [
  "Semua",
  "Aljabar",
  "Trigonometri",
  "Kalkulus",
  "Matriks",
  "Statistika",
] as const;

export type FormulaCategory = (typeof FORMULA_CATEGORIES)[number];

export const FORMULA_DATABASE: FormulaItem[] = [
  // --- Aljabar & Eksponen ---
  {
    id: "alg-1",
    title: "Rumus Kuadrat (ABC)",
    category: "Aljabar",
    latex: "x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    description: "Mencari akar-akar penyelesaian dari persamaan kuadrat $ax^2 + bx + c = 0$.",
    variables: "a, b, c = koefisien real, a \\neq 0",
  },
  {
    id: "alg-2",
    title: "Sifat Eksponen (Perkalian & Pembagian)",
    category: "Aljabar",
    latex: "a^m \\cdot a^n = a^{m+n}, \\quad \\frac{a^m}{a^n} = a^{m-n}",
    description: "Operasi pangkat pada basis bilangan yang sama.",
  },
  {
    id: "alg-3",
    title: "Sifat Dasar Logaritma",
    category: "Aljabar",
    latex: "^a\\log(b \\cdot c) = ^a\\log b + ^a\\log c, \\quad ^a\\log\\left(\\frac{b}{c}\\right) = ^a\\log b - ^a\\log c",
    description: "Konversi perkalian dan pembagian ke penjumlahan dan pengurangan logaritma.",
  },
  {
    id: "alg-4",
    title: "Perubahan Basis Logaritma",
    category: "Aljabar",
    latex: "^a\\log b = \\frac{^p\\log b}{^p\\log a} = \\frac{1}{^b\\log a}",
    description: "Mengubah basis logaritma ke basis baru p.",
  },
  {
    id: "alg-5",
    title: "Selisih & Jumlah Pangkat Tiga",
    category: "Aljabar",
    latex: "a^3 - b^3 = (a - b)(a^2 + ab + b^2), \\quad a^3 + b^3 = (a + b)(a^2 - ab + b^2)",
    description: "Faktorisasi aljabar derajat tiga.",
  },

  // --- Trigonometri ---
  {
    id: "trig-1",
    title: "Identitas Pythagoras Dasar",
    category: "Trigonometri",
    latex: "\\sin^2 x + \\cos^2 x = 1, \\quad 1 + \\tan^2 x = \\sec^2 x",
    description: "Hubungan kuadrat sinus, kosinus, tangen, dan sekan.",
  },
  {
    id: "trig-2",
    title: "Rumus Sudut Rangkap Sinus & Kosinus",
    category: "Trigonometri",
    latex: "\\sin 2x = 2\\sin x \\cos x, \\quad \\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1",
    description: "Ekspansi fungsi trigonometri untuk sudut ganda.",
  },
  {
    id: "trig-3",
    title: "Rumus Penjumlahan & Pengurangan Sudut",
    category: "Trigonometri",
    latex: "\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B, \\quad \\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B",
    description: "Menghitung nilai sinus dan kosinus dari gabungan dua sudut.",
  },
  {
    id: "trig-4",
    title: "Aturan Sinus & Kosinus (Segitiga Sembarang)",
    category: "Trigonometri",
    latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}, \\quad c^2 = a^2 + b^2 - 2ab \\cos C",
    description: "Menghitung panjang sisi atau besar sudut pada segitiga apa pun.",
  },

  // --- Kalkulus (Turunan & Integral) ---
  {
    id: "calc-1",
    title: "Definisi Turunan (Limit Diferensial)",
    category: "Kalkulus",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}",
    description: "Laju perubahan sesaat nilai fungsi f terhadap x.",
  },
  {
    id: "calc-2",
    title: "Aturan Pangkat Turunan",
    category: "Kalkulus",
    latex: "\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad \\frac{d}{dx}[c \\cdot f(x)] = c f'(x)",
    description: "Diferensiasi suku polinomial atau pangkat real.",
  },
  {
    id: "calc-3",
    title: "Aturan Perkalian & Pembagian Turunan",
    category: "Kalkulus",
    latex: "(u \\cdot v)' = u'v + uv', \\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}",
    description: "Turunan hasil kali dan hasil bagi dua fungsi.",
  },
  {
    id: "calc-4",
    title: "Aturan Rantai (Chain Rule)",
    category: "Kalkulus",
    latex: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} \\quad \\text{atau} \\quad (f(g(x)))' = f'(g(x)) \\cdot g'(x)",
    description: "Diferensiasi fungsi komposisi.",
  },
  {
    id: "calc-5",
    title: "Integral Tak Tentu Pangkat",
    category: "Kalkulus",
    latex: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad (n \\neq -1)",
    description: "Antiturunan dasar untuk fungsi pangkat.",
  },
  {
    id: "calc-6",
    title: "Teorema Fundamental Kalkulus",
    category: "Kalkulus",
    latex: "\\int_a^b f(x) \\, dx = F(b) - F(a), \\quad \\text{dengan } F'(x) = f(x)",
    description: "Menghitung akumulasi luas bidang di bawah kurva fungsi kontinu.",
  },
  {
    id: "calc-7",
    title: "Integral Parsial",
    category: "Kalkulus",
    latex: "\\int u \\, dv = u \\cdot v - \\int v \\, du",
    description: "Metode integrasi perkalian fungsi dua variabel u dan v.",
  },

  // --- Matriks & Vektor ---
  {
    id: "mat-1",
    title: "Determinan Matriks 2x2",
    category: "Matriks",
    latex: "\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
    description: "Nilai skalar determinan matriks ordo dua.",
  },
  {
    id: "mat-2",
    title: "Invers Matriks 2x2",
    category: "Matriks",
    latex: "A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}, \\quad (ad - bc \\neq 0)",
    description: "Matriks balikan yang memenuhi $A \\cdot A^{-1} = I$.",
  },
  {
    id: "mat-3",
    title: "Perkalian Matriks 2x2",
    category: "Matriks",
    latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{pmatrix}",
    description: "Kombinasi linier baris matriks pertama dengan kolom matriks kedua.",
  },

  // --- Statistika & Peluang ---
  {
    id: "stat-1",
    title: "Permutasi dan Kombinasi",
    category: "Statistika",
    latex: "P(n, r) = \\frac{n!}{(n - r)!}, \\quad C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}",
    description: "Pencacahan objek dengan memperhatikan urutan (permutasi) atau tanpa urutan (kombinasi).",
  },
  {
    id: "stat-2",
    title: "Peluang Kejadian & Komplemen",
    category: "Statistika",
    latex: "P(A) = \\frac{n(A)}{n(S)}, \\quad P(A') = 1 - P(A)",
    description: "Probabilitas kejadian A terhadap ruang sampel S.",
  },
  {
    id: "stat-3",
    title: "Rata-rata (Mean) & Varians Sampel",
    category: "Statistika",
    latex: "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i, \\quad s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2",
    description: "Ukuran pemusatan dan dispersi data kuantitatif.",
  },
];
