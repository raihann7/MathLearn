export interface SeedTopic {
  id: string;
  title: string;
  slug: string;
  category:
    | "Kalkulus"
    | "Trigonometri"
    | "Matriks"
    | "Statistika"
    | "Aljabar"
    | "Geometri"
    | "Kalkulus Lanjut"
    | "Aljabar Linear"
    | "Persamaan Diferensial";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description: string;
  order: number;
  materials: {
    id: string;
    title: string;
    slug: string;
    order: number;
    content: string;
  }[];
}

export const SEED_TOPICS: SeedTopic[] = [
  // =========================================================================
  // JENJANG SMA (FASE E/F, KURIKULUM MERDEKA, UTBK/SNBT)
  // =========================================================================

  // 1. Aljabar: Fungsi, Komposisi & Invers (4 Modul)
  {
    id: "topic-fungsi",
    title: "Fungsi, Komposisi & Invers",
    slug: "fungsi-komposisi-dan-invers",
    category: "Aljabar",
    difficulty: "BEGINNER",
    description:
      "Memahami relasi pemetaan fungsi, daerah asal (domain) dan daerah hasil (range), karakteristik grafik fungsi aljabar, komposisi fungsi bersarang, serta teknik menentukan invers fungsi aljabar.",
    order: 1,
    materials: [
      {
        id: "mat-fungsi-1",
        title: "Konsep Pemetaan, Relasi, Domain, dan Range",
        slug: "konsep-domain-dan-range",
        order: 1,
        content: `### Definisi Pemetaan Fungsi

Fungsi $f$ dari himpunan $A$ ke himpunan $B$ ($f: A \\to B$) adalah suatu relasi khusus yang memasangkan **tepat satu** elemen $y \\in B$ untuk setiap elemen $x \\in A$.

#### 1. Domain Alami (Daerah Asal)
Domain alami $D_f$ ditentukan berdasarkan batasan operasi matematika agar menghasilkan bilangan riil yang terdefinisi:
- **Bentuk Pecahan Aljabar:** $f(x) = \\frac{P(x)}{Q(x)} \\implies Q(x) \\neq 0$
- **Bentuk Akar Kuadrat:** $f(x) = \\sqrt{P(x)} \\implies P(x) \\ge 0$
- **Bentuk Logaritma:** $f(x) = \\log_b P(x) \\implies P(x) > 0, \\, b > 0, \\, b \\neq 1$

#### Contoh Penentuan Domain:
Tentukan domain alami dari fungsi $f(x) = \\frac{\\sqrt{2x - 6}}{x - 5}$:
1. Syarat bentuk akar: $2x - 6 \\ge 0 \\implies x \\ge 3$
2. Syarat pembagi bukan nol: $x - 5 \\neq 0 \\implies x \\neq 5$
3. Domain irisan: $D_f = \\{x \\in \\mathbb{R} \\mid x \\ge 3, \\, x \\neq 5\\}$ atau dalam notasi interval $[3, 5) \\cup (5, \\infty)$.`,
      },
      {
        id: "mat-fungsi-2",
        title: "Jenis-Jenis Fungsi Khusus & Karakteristik Grafiknya",
        slug: "jenis-fungsi-dan-karakteristik",
        order: 2,
        content: `### Klasifikasi Fungsi Aljabar

Dalam matematika sekolah dan perguruan tinggi awal, fungsi dikelompokkan menurut sifat aljabar dan bentuk grafiknya:

#### 1. Fungsi Linear & Gradien:
$$f(x) = mx + c$$
Grafik berupa garis lurus dengan kemiringan $m = \\frac{\\Delta y}{\\Delta x}$. Nilai $c$ merupakan titik potong terhadap sumbu $Y$.

#### 2. Fungsi Kuadrat & Parabola:
$$f(x) = ax^2 + bx + c, \\quad a \\neq 0$$
- Sumbu simetri: $x_p = -\\frac{b}{2a}$
- Titik puncak ekstrem: $y_p = -\\frac{D}{4a}$ dengan diskriminan $D = b^2 - 4ac$.
- Jika $a > 0$ kurva terbuka ke atas (memiliki titik minimum), jika $a < 0$ terbuka ke bawah (titik maksimum).

#### 3. Fungsi Nilai Mutlak (Absolute Value):
$$f(x) = |x| = \\begin{cases} x, & \\text{jika } x \\ge 0 \\\\ -x, & \\text{jika } x < 0 \\end{cases}$$
Grafik membentuk sudut lancip $V$ di titik $(0,0)$ dengan sifat simetri terhadap sumbu $Y$.`,
      },
      {
        id: "mat-fungsi-3",
        title: "Komposisi Fungsi Aljabar & Sifat-Sifatnya",
        slug: "komposisi-fungsi-aljabar",
        order: 3,
        content: `### Komposisi Dua Fungsi

Jika fungsi $f$ dan $g$ terdefinisi, maka komposisi $(f \\circ g)(x)$ dibaca "fungsi $f$ bundaran $g$" didefinisikan sebagai:
$$(f \\circ g)(x) = f(g(x))$$

Artinya output dari $g(x)$ menjadi input langsung bagi $f$.

#### Sifat-Sifat Operasi Komposisi:
- **Tidak Komutatif:** Secara umum $(f \\circ g)(x) \\neq (g \\circ f)(x)$.
- **Asosiatif:** $((f \\circ g) \\circ h)(x) = (f \\circ (g \\circ h))(x)$.
- **Elemen Identitas:** Jika $I(x) = x$, maka $(f \\circ I)(x) = (I \\circ f)(x) = f(x)$.

#### Contoh Kalkulasi:
Diberikan $f(x) = 2x + 3$ dan $g(x) = x^2 - 1$. Tentukan $(f \\circ g)(x)$ dan $(g \\circ f)(x)$:

$$
\\begin{aligned}
(f \\circ g)(x) &= f(x^2 - 1) = 2(x^2 - 1) + 3 = 2x^2 + 1 \\\\
(g \\circ f)(x) &= g(2x + 3) = (2x + 3)^2 - 1 = 4x^2 + 12x + 8
\\end{aligned}
$$`,
      },
      {
        id: "mat-fungsi-4",
        title: "Fungsi Invers & Syarat Keberadaannya",
        slug: "fungsi-invers-aljabar",
        order: 4,
        content: `### Pembalikan Fungsi (Invers)

Suatu fungsi $f: A \\to B$ memiliki invers $f^{-1}: B \\to A$ jika dan hanya jika $f$ merupakan fungsi **bijektif** (injektif/satu-satu dan surjektif/pada).

Hubungan fundamental:
$$f(x) = y \\iff f^{-1}(y) = x, \\quad (f \\circ f^{-1})(x) = x$$

#### Rumus Praktis Invers Bentuk Pecahan Linear:
Bila $f(x) = \\frac{ax + b}{cx + d}$ dengan $x \\neq -\\frac{d}{c}$, maka:
$$f^{-1}(x) = \\frac{-dx + b}{cx - a}, \\quad x \\neq \\frac{a}{c}$$

#### Invers dari Komposisi Fungsi:
Urutan pembalikan dibalik secara berurutan:
$$(f \\circ g)^{-1}(x) = (g^{-1} \\circ f^{-1})(x)$$
$$(f \\circ g \\circ h)^{-1}(x) = (h^{-1} \\circ g^{-1} \\circ f^{-1})(x)$$`,
      },
    ],
  },

  // 2. Aljabar: Eksponen & Logaritma (4 Modul)
  {
    id: "topic-eksponen",
    title: "Eksponen & Logaritma",
    slug: "eksponen-dan-logaritma",
    category: "Aljabar",
    difficulty: "BEGINNER",
    description:
      "Menguasai hukum-hukum eksponensial, bentuk akar kuadrat, persamaan & pertidaksamaan eksponen, definisi logaritma, sifat operasi logaritma, serta pemodelan pertumbuhan dan peluruhan.",
    order: 2,
    materials: [
      {
        id: "mat-ekspo-1",
        title: "Hukum Pangkat Eksponen & Bentuk Akar",
        slug: "sifat-eksponen-dan-akar",
        order: 1,
        content: `### Sifat-Sifat Dasar Bilangan Berpangkat

Untuk bilangan real $a, b > 0$ dan bilangan rasional $m, n$:
- $a^m \\cdot a^n = a^{m+n}$
- $\\frac{a^m}{a^n} = a^{m-n}$
- $(a^m)^n = a^{m \\cdot n}$
- $(ab)^n = a^n \\cdot b^n$
- $a^{-n} = \\frac{1}{a^n}$
- $a^{m/n} = \\sqrt[n]{a^m}$

#### Merasionalkan Penyebut Bentuk Akar:
Kalikan pembilang dan penyebut dengan bentuk sekawannya (konjugat):
$$\\frac{c}{\\sqrt{a} + \\sqrt{b}} = \\frac{c(\\sqrt{a} - \\sqrt{b})}{a - b}$$
$$\\frac{c}{\\sqrt{a} - \\sqrt{b}} = \\frac{c(\\sqrt{a} + \\sqrt{b})}{a - b}$$`,
      },
      {
        id: "mat-ekspo-2",
        title: "Persamaan & Pertidaksamaan Eksponensial",
        slug: "persamaan-pertidaksamaan-eksponen",
        order: 2,
        content: `### Bentuk Baku Persamaan Eksponen

Jika $a > 0$ dan $a \\neq 1$:
1. $a^{f(x)} = a^{g(x)} \\iff f(x) = g(x)$
2. $a^{f(x)} = b^{f(x)} \\quad (a \\neq b) \\iff f(x) = 0$
3. Bentuk Kuadrat: $A(a^x)^2 + B(a^x) + C = 0$, selesaikan dengan memisalkan $u = a^x$ di mana $u > 0$.

#### Pertidaksamaan Eksponen:
Perhatikan nilai basis $a$:
- **Kasus $a > 1$ (Monoton Naik):**
  $$a^{f(x)} \\ge a^{g(x)} \\iff f(x) \\ge g(x)$$
- **Kasus $0 < a < 1$ (Monoton Turun):**
  $$a^{f(x)} \\ge a^{g(x)} \\iff f(x) \\le g(x) \\quad (\\text{tanda ketaksamaan berbalik})$$`,
      },
      {
        id: "mat-ekspo-3",
        title: "Definisi & Sifat Operasi Logaritma",
        slug: "sifat-operasi-logaritma",
        order: 3,
        content: `### Definisi Formal Logaritma

Logaritma merupakan operasi invers dari pemangkatan eksponensial:
$$^a\\log b = c \\iff a^c = b, \\quad a > 0, \\, a \\neq 1, \\, b > 0$$
Di mana $a$ adalah bilangan pokok (basis) dan $b$ adalah numerus.

#### Teorema Kunci Logaritma:
1. $^a\\log(x \\cdot y) = ^a\\log x + ^a\\log y$
2. $^a\\log\\left(\\frac{x}{y}\\right) = ^a\\log x - ^a\\log y$
3. $^a\\log(x^n) = n \\cdot ^a\\log x$
4. $^{a^m}\\log(b^n) = \\frac{n}{m} \\cdot ^a\\log b$
5. $^a\\log b = \\frac{^c\\log b}{^c\\log a} = \\frac{1}{^b\\log a}$
6. $^a\\log b \\cdot ^b\\log c = ^a\\log c$
7. $a^{^a\\log b} = b$`,
      },
      {
        id: "mat-ekspo-4",
        title: "Persamaan & Pertidaksamaan Logaritma Terapan",
        slug: "persamaan-logaritma-terapan",
        order: 4,
        content: `### Persamaan Logaritma & Syarat Numerus

Dalam menyelesaikan persamaan logaritma, **wajib menguji syarat numerus**: numerus harus bernilai positif ($> 0$).

#### Bentuk $^a\\log f(x) = ^a\\log g(x)$:
Solusi diperoleh dari $f(x) = g(x)$ dengan syarat $f(x) > 0$ dan $g(x) > 0$.

#### Pertidaksamaan Logaritma:
- Jika basis $a > 1$:
  $$^a\\log f(x) > ^a\\log g(x) \\iff f(x) > g(x) > 0$$
- Jika basis $0 < a < 1$:
  $$^a\\log f(x) > ^a\\log g(x) \\iff 0 < f(x) < g(x)$$

#### Aplikasi Pemodelan: Peluruhan Radioaktif
Jumlah zat sisa $N(t)$ setelah waktu $t$ dengan waktu paruh $T_{1/2}$:
$$N(t) = N_0 \\cdot \\left(\\frac{1}{2}\\right)^{t / T_{1/2}} \\iff t = -T_{1/2} \\cdot \\frac{\\ln(N(t) / N_0)}{\\ln 2}$$`,
      },
    ],
  },

  // 3. Aljabar: Barisan & Deret (5 Modul)
  {
    id: "topic-barisan",
    title: "Barisan & Deret Aritmetika dan Geometri",
    slug: "barisan-dan-deret-aritmetika-geometri",
    category: "Aljabar",
    difficulty: "BEGINNER",
    description:
      "Pola bilangan teratur, rumus suku ke-n, jumlah n suku pertama barisan aritmetika dan geometri, suku tengah, serta kondisi konvergensi deret geometri tak hingga dalam pemodelan finansial dan sains.",
    order: 3,
    materials: [
      {
        id: "mat-deret-1",
        title: "Barisan Aritmetika: Suku ke-n, Beda & Suku Tengah",
        slug: "barisan-deret-aritmetika",
        order: 1,
        content: `### Barisan Aritmetika

Barisan aritmetika adalah barisan bilangan dengan selisih (beda, $b$) dua suku berurutan bernilai tetap konstan:
$$b = U_n - U_{n-1}$$

#### Rumus Suku ke-$n$ ($U_n$):
$$U_n = a + (n - 1)b$$
di mana $a = U_1$ adalah suku pertama.

#### Suku Tengah ($U_t$):
Bila banyaknya suku $n$ ganjil, suku tengah terletak pada indeks $t = \\frac{n + 1}{2}$:
$$U_t = \\frac{a + U_n}{2}$$

#### Sisipan Barisan Aritmetika:
Jika antara dua bilangan disisipkan $k$ buah bilangan sehingga membentuk barisan aritmetika baru, beda baru $b'$ adalah:
$$b' = \\frac{b}{k + 1}$$`,
      },
      {
        id: "mat-deret-2",
        title: "Deret Aritmetika ($S_n$) & Model Masalah Kontekstual",
        slug: "deret-aritmetika",
        order: 2,
        content: `### Deret Aritmetika

Deret aritmetika adalah penjumlahan berurutan suku-suku barisan aritmetika:
$$S_n = U_1 + U_2 + \\dots + U_n$$

#### Rumus Jumlah $n$ Suku Pertama ($S_n$):
$$S_n = \\frac{n}{2}(a + U_n) = \\frac{n}{2}\\left(2a + (n - 1)b\\right)$$

#### Hubungan Fundamental Suku dan Deret:
$$U_n = S_n - S_{n-1}, \\quad \\text{untuk } n \\ge 2$$
$$U_1 = S_1$$

#### Contoh:
Jika rumus jumlah $n$ suku pertama deret aritmetika adalah $S_n = 3n^2 + 2n$, tentukan suku ke-10:
$$U_{10} = S_{10} - S_9 = [3(10)^2 + 2(10)] - [3(9)^2 + 2(9)] = 320 - 261 = 59$$`,
      },
      {
        id: "mat-deret-3",
        title: "Barisan Geometri: Rasio & Suku ke-n",
        slug: "barisan-deret-geometri",
        order: 3,
        content: `### Barisan Geometri

Barisan geometri memiliki perbandingan (rasio, $r$) antarsuku berurutan yang konstan:
$$r = \\frac{U_n}{U_{n-1}}$$

#### Rumus Suku ke-$n$:
$$U_n = a \\cdot r^{n-1}$$

#### Suku Tengah Barisan Geometri:
Bila $n$ ganjil dan semua suku bernilai positif:
$$U_t = \\sqrt{a \\cdot U_n}$$

#### Sisipan Barisan Geometri:
Jika antara dua suku disisipkan $k$ bilangan baru, rasio baru $r'$ adalah:
$$r' = \\sqrt[k+1]{r}$$`,
      },
      {
        id: "mat-deret-4",
        title: "Deret Geometri Hingga & Analisis Pertumbuhan",
        slug: "deret-geometri-hingga",
        order: 4,
        content: `### Jumlah $n$ Suku Pertama Deret Geometri

Jumlah deret geometri hingga $S_n = a + ar + ar^2 + \\dots + ar^{n-1}$:

$$S_n = \\begin{cases} \\frac{a(r^n - 1)}{r - 1}, & \\text{jika } r > 1 \\\\ \\frac{a(1 - r^n)}{1 - r}, & \\text{jika } r < 1 \\text{ dan } r \\neq 1 \\\\ n \\cdot a, & \\text{jika } r = 1 \\end{cases}$$

#### Aplikasi: Bunga Majemuk Perbankan
Modal akhir $M_n$ setelah $n$ periode dengan suku bunga majemuk $i$ per periode:
$$M_n = M_0 (1 + i)^n$$`,
      },
      {
        id: "mat-deret-5",
        title: "Deret Geometri Tak Hingga & Kondisi Konvergensi",
        slug: "deret-geometri-tak-hingga",
        order: 5,
        content: `### Konvergensi Deret Geometri Tak Hingga

Deret geometri $a + ar + ar^2 + \\dots$ dengan suku tak hingga ($n \\to \\infty$) memiliki sifat:
1. **Konvergen:** Jika $|r| < 1$ (yaitu $-1 < r < 1$), deret memiliki nilai limit hingga:
   $$S_\\infty = \\lim_{n \\to \\infty} S_n = \\frac{a}{1 - r}$$
2. **Divergen:** Jika $|r| \\ge 1$, deret tidak memiliki jumlah hingga ($S_\\infty = \\pm \\infty$).

#### Aplikasi Klasik: Lintasan Pantulan Bola
Sebuah bola dijatuhkan dari ketinggian $h$ dan memantul setinggi $\\frac{p}{q}$ kali tinggi sebelumnya.
Total panjang lintasan bola hingga berhenti:
$$S_{\\text{total}} = h + 2 \\left( \\frac{a_{\\text{pantul}}}{1 - r} \\right) = h \\cdot \\left( \\frac{q + p}{q - p} \\right)$$`,
      },
    ],
  },

  // 4. Trigonometri: Identitas & Persamaan (5 Modul)
  {
    id: "topic-trigonometri",
    title: "Identitas & Persamaan Trigonometri",
    slug: "identitas-dan-persamaan-trigonometri",
    category: "Trigonometri",
    difficulty: "BEGINNER",
    description:
      "Perbandingan sudut segitiga siku-siku, lingkaran satuan sudut, relasi kuadran, pembuktian identitas Pythagoras, sudut ganda dan setengah sudut, rumus perkalian-penjumlahan, serta penyelesaian persamaan trigonometri.",
    order: 4,
    materials: [
      {
        id: "mat-trig-1",
        title: "Perbandingan Trigonometri Segitiga Siku-Siku & Sudut Istimewa",
        slug: "perbandingan-trigonometri-dasar",
        order: 1,
        content: `### Perbandingan Sisi Segitiga Siku-Siku

Diberikan segitiga siku-siku dengan sudut $\\theta$:
- $\\sin\\theta = \\frac{\\text{sisi depan}}{\\text{sisi miring}} = \\frac{\\text{de}}{\\text{mi}}$
- $\\cos\\theta = \\frac{\\text{sisi samping}}{\\text{sisi miring}} = \\frac{\\text{sa}}{\\text{mi}}$
- $\\tan\\theta = \\frac{\\text{sisi depan}}{\\text{sisi samping}} = \\frac{\\text{de}}{\\text{sa}} = \\frac{\\sin\\theta}{\\cos\\theta}$
- $\\csc\\theta = \\frac{1}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{1}{\\tan\\theta}$

#### Nilai Sudut Istimewa:
| $\\theta$ | $0^\\circ$ | $30^\\circ$ | $45^\\circ$ | $60^\\circ$ | $90^\\circ$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $\\sin\\theta$ | $0$ | $\\frac{1}{2}$ | $\\frac{1}{2}\\sqrt{2}$ | $\\frac{1}{2}\\sqrt{3}$ | $1$ |
| $\\cos\\theta$ | $1$ | $\\frac{1}{2}\\sqrt{3}$ | $\\frac{1}{2}\\sqrt{2}$ | $\\frac{1}{2}$ | $0$ |
| $\\tan\\theta$ | $0$ | $\\frac{1}{3}\\sqrt{3}$ | $1$ | $\\sqrt{3}$ | $\\infty$ |`,
      },
      {
        id: "mat-trig-2",
        title: "Sudut Berelasi di 4 Kuadran & Identitas Pythagoras",
        slug: "identitas-pythagoras-dan-sudut-rangkap",
        order: 2,
        content: `### Tanda Trigonometri di Empat Kuadran
- **Kuadran I ($0^\\circ - 90^\\circ$):** Semua fungsi positif.
- **Kuadran II ($90^\\circ - 180^\\circ$):** Hanya $\\sin$ dan $\\csc$ bernilai positif.
- **Kuadran III ($180^\\circ - 270^\\circ$):** Hanya $\\tan$ dan $\\cot$ bernilai positif.
- **Kuadran IV ($270^\\circ - 360^\\circ$):** Hanya $\\cos$ dan $\\sec$ bernilai positif.

#### Identitas Fundamental Pythagoras:
$$\\sin^2 x + \\cos^2 x = 1$$
$$1 + \\tan^2 x = \\sec^2 x$$
$$1 + \\cot^2 x = \\csc^2 x$$

#### Sifat Paritas (Genap-Ganjil):
$$\\sin(-x) = -\\sin x, \\quad \\cos(-x) = \\cos x, \\quad \\tan(-x) = -\\tan x$$`,
      },
      {
        id: "mat-trig-3",
        title: "Rumus Jumlah & Selisih Dua Sudut Trigonometri",
        slug: "rumus-jumlah-selisih-sudut",
        order: 3,
        content: `### Rumus Penjumlahan dan Pengurangan Sudut

Untuk sembarang sudut $A$ dan $B$:
$$\\sin(A + B) = \\sin A\\cos B + \\cos A\\sin B$$
$$\\sin(A - B) = \\sin A\\cos B - \\cos A\\sin B$$
$$\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$$
$$\\cos(A - B) = \\cos A\\cos B + \\sin A\\sin B$$

#### Tangen Jumlah dan Selisih:
$$\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A\\tan B}$$`,
      },
      {
        id: "mat-trig-4",
        title: "Rumus Sudut Rangkap, Sudut Paruh, & Konversi Perkalian-Penjumlahan",
        slug: "rumus-sudut-rangkap-dan-paruh",
        order: 4,
        content: `### Rumus Sudut Rangkap (Double Angle)
$$\\sin 2A = 2\\sin A\\cos A$$
$$\\cos 2A = \\cos^2 A - \\sin^2 A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A$$
$$\\tan 2A = \\frac{2\\tan A}{1 - \\tan^2 A}$$

#### Rumus Penurunan Derajat (Power-Reducing):
$$\\sin^2 A = \\frac{1 - \\cos 2A}{2}, \\quad \\cos^2 A = \\frac{1 + \\cos 2A}{2}$$

#### Konversi Perkalian ke Penjumlahan:
$$2\\sin A\\cos B = \\sin(A + B) + \\sin(A - B)$$
$$2\\cos A\\cos B = \\cos(A + B) + \\cos(A - B)$$
$$-2\\sin A\\sin B = \\cos(A + B) - \\cos(A - B)$$`,
      },
      {
        id: "mat-trig-5",
        title: "Penyelesaian Persamaan Trigonometri Dasar & Bentuk Kuadrat",
        slug: "penyelesaian-persamaan-trigonometri",
        order: 5,
        content: `### Bentuk Baku Persamaan Trigonometri

Untuk sembarang bilangan bulat $k \\in \\mathbb{Z}$:
1. **Persamaan Sinus:** $\\sin x = \\sin \\alpha$
   $$x_1 = \\alpha + k \\cdot 360^\\circ \\quad \\text{atau} \\quad x_2 = (180^\\circ - \\alpha) + k \\cdot 360^\\circ$$
2. **Persamaan Kosinus:** $\\cos x = \\cos \\alpha$
   $$x = \\pm \\alpha + k \\cdot 360^\\circ$$
3. **Persamaan Tangen:** $\\tan x = \\tan \\alpha$
   $$x = \\alpha + k \\cdot 180^\\circ$$

#### Bentuk Kuadrat $a\\sin^2 x + b\\sin x + c = 0$:
Selesaikan seperti persamaan kuadrat biasa dengan memisalkan $u = \\sin x$, lalu filter nilai $u$ yang memenuhi interval $[-1, 1]$.`,
      },
    ],
  },

  // 5. Geometri: Dimensi Tiga (SMA) (5 Modul)
  {
    id: "topic-geometri",
    title: "Geometri Ruang & Dimensi Tiga",
    slug: "geometri-ruang-dan-dimensi-tiga",
    category: "Geometri",
    difficulty: "INTERMEDIATE",
    description:
      "Visualisasi spasial bangun ruang (kubus, limas, balok), perhitungan jarak titik ke garis, titik ke bidang dengan proyeksi ortogonal, jarak antar garis bersilangan, serta sudut antar komponen ruang.",
    order: 5,
    materials: [
      {
        id: "mat-geom-1",
        title: "Unsur Bangun Ruang & Kedudukan Titik, Garis, Bidang",
        slug: "unsur-dan-kedudukan-dimensi-tiga",
        order: 1,
        content: `### Aksioma & Postulat Euclid dalam Ruang

1. Melalui dua titik sembarang hanya dapat dibuat tepat satu garis lurus.
2. Melalui tiga titik yang tidak segaris hanya dapat dibuat tepat satu bidang datar.

#### Kedudukan Dua Garis dalam Ruang:
- **Berpotongan:** Berada pada satu bidang dan memiliki 1 titik persekutuan.
- **Sejajar:** Berada pada satu bidang dan tidak memiliki titik persekutuan.
- **Bersilangan:** Tidak sebidang dan tidak pernah berpotongan maupun sejajar.

#### Karakteristik Geometri Kubus $ABCD.EFGH$ (Rusuk $s$):
- Diagonal bidang: $d_b = s\\sqrt{2}$
- Diagonal ruang: $d_r = s\\sqrt{3}$
- Luas permukaan: $L = 6s^2$, Volume: $V = s^3$`,
      },
      {
        id: "mat-geom-2",
        title: "Jarak Titik ke Titik dan Titik ke Garis dalam Ruang Tiga Dimensi",
        slug: "jarak-titik-ke-garis-dimensi-tiga",
        order: 2,
        content: `### Jarak Titik ke Garis

Jarak antara titik $P$ dan garis $g$ di dalam ruang didefinisikan sebagai panjang ruas garis terpendek dari $P$ yang ditarik **tegak lurus** terhadap garis $g$.

#### Metode Luas Segitiga:
Jika titik $P$ membentuk segitiga $PAB$ bersama titik $A$ dan $B$ pada garis $g$:
$$\\text{Luas } \\triangle PAB = \\frac{1}{2} \\cdot |AB| \\cdot d = \\frac{1}{2} \\cdot |PA| \\cdot |PB| \\cdot \\sin \\angle APB$$
$$d = \\frac{2 \\times \\text{Luas } \\triangle PAB}{|AB|}$$

#### Contoh Kasus Kubus:
Pada kubus $ABCD.EFGH$ rusuk $s$, jarak titik sudut ke diagonal ruang terjauh:
$$d = \\frac{1}{3}s\\sqrt{6}$$`,
      },
      {
        id: "mat-geom-3",
        title: "Jarak Titik ke Bidang & Proyeksi Ortogonal",
        slug: "jarak-titik-ke-bidang-dan-sudut",
        order: 3,
        content: `### Proyeksi Ortogonal ke Bidang

Jarak titik $P$ ke bidang $\\alpha$ adalah panjang segmen garis dari $P$ ke titik proyeksi $P'$ pada bidang $\\alpha$ sedemikian rupa sehingga $PP' \\perp \\alpha$.

#### Metode Perbandingan Volume Limas:
Untuk menghitung jarak titik $T$ ke bidang alas $\\triangle ABC$:
$$V = \\frac{1}{3} \\cdot \\text{Luas}(\\triangle ABC) \\cdot d$$
$$d = \\frac{3 \\cdot V}{\\text{Luas}(\\triangle ABC)}$$`,
      },
      {
        id: "mat-geom-4",
        title: "Jarak Antara Dua Garis Bersilangan & Antar Bidang Sejajar",
        slug: "jarak-garis-bersilangan-dan-bidang",
        order: 4,
        content: `### Garis Bersilangan

Dua garis $g_1$ dan $g_2$ bersilangan jika tidak terletak pada satu bidang datar.

#### Jarak Garis Bersilangan:
Jarak antara garis $g_1$ dan $g_2$ sama dengan jarak antara bidang $\\alpha$ (yang memuat $g_1$ dan sejajar $g_2$) ke bidang $\\beta$ (yang memuat $g_2$ dan sejajar $g_1$).

#### Jarak Dua Bidang Sejajar:
Bila dua bidang sejajar memiliki persamaan Kartesius:
$$\\alpha: Ax + By + Cz + D_1 = 0$$
$$\\beta: Ax + By + Cz + D_2 = 0$$
Maka jarak tegak lurus kedua bidang adalah:
$$d = \\frac{|D_1 - D_2|}{\\sqrt{A^2 + B^2 + C^2}}$$`,
      },
      {
        id: "mat-geom-5",
        title: "Sudut Spasial Antara Garis-Bidang & Antara Dua Bidang",
        slug: "sudut-garis-dan-bidang-spasial",
        order: 5,
        content: `### Sudut dalam Dimensi Tiga

#### 1. Sudut antara Garis dan Bidang:
Sudut lancip $\\theta$ antara garis $g$ dan bidang $\\alpha$ adalah sudut antara garis $g$ dengan garis proyeksi $g'$ di atas bidang $\\alpha$.
Jika vektor arah garis adalah $\\vec{u}$ dan vektor normal bidang adalah $\\vec{n}$:
$$\\sin\\theta = \\frac{|\\vec{u} \\cdot \\vec{n}|}{\\|\\vec{u}\\| \\|\\vec{n}\\|}$$

#### 2. Sudut antara Dua Bidang (Sudut Tumpu / Dihedral):
Sudut antara bidang $\\alpha_1$ dan $\\alpha_2$ sama dengan sudut antara vektor normal kedua bidang $\\vec{n}_1$ dan $\\vec{n}_2$:
$$\\cos\\theta = \\frac{|\\vec{n}_1 \\cdot \\vec{n}_2|}{\\|\\vec{n}_1\\| \\|\\vec{n}_2\\|}$$`,
      },
    ],
  },

  // 6. Kalkulus SMA: Limit Fungsi (5 Modul)
  {
    id: "topic-limit",
    title: "Limit Fungsi Aljabar & Trigonometri",
    slug: "limit-fungsi-aljabar-dan-trigonometri",
    category: "Kalkulus",
    difficulty: "BEGINNER",
    description:
      "Konsep pendekatan nilai sesaat, penanganan bentuk tak tentu 0/0 menggunakan faktorisasi aljabar, perkalian bentuk sekawan, teorema limit trigonometri, limit di tak hingga, serta kekontinuan fungsi.",
    order: 6,
    materials: [
      {
        id: "mat-limit-1",
        title: "Konsep Intuitif Limit, Definisi Formal & Limit Sepihak",
        slug: "konsep-intuitif-dan-limit-sepihak",
        order: 1,
        content: `### Definisi Intuitif Limit

Notasi $\\lim_{x \\to c} f(x) = L$ bermakna bahwa nilai $f(x)$ dapat dibuat sedekat mungkin ke $L$ dengan memilih nilai $x$ yang cukup dekat ke $c$, namun $x \\neq c$.

#### Teorema Limit Sepihak:
Limit dua sisi ada jika dan hanya jika limit kiri dan limit kanan bernilai sama:
$$\\lim_{x \\to c} f(x) = L \\iff \\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = L$$`,
      },
      {
        id: "mat-limit-2",
        title: "Limit Bentuk Tak Tentu 0/0: Metode Faktorisasi & Kali Sekawan Akar",
        slug: "limit-bentuk-tak-tentu-aljabar",
        order: 2,
        content: `### Teorema Limit Aljabar

Jika $\\lim_{x \\to c} f(x) = L$ dan $\\lim_{x \\to c} g(x) = M$, maka:
$$\\lim_{x \\to c} [f(x) \\pm g(x)] = L \\pm M, \\quad \\lim_{x \\to c} [f(x) \\cdot g(x)] = L \\cdot M$$

#### Evaluasi Bentuk Tak Tentu $\\frac{0}{0}$:
1. **Faktorisasi Polinomial:**
   $$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{x - 2} = \\lim_{x \\to 2} (x + 2) = 4$$
2. **Perkalian Sekawan Akar Kuadrat:**
   $$\\lim_{x \\to 0} \\frac{\\sqrt{1+x} - 1}{x} = \\lim_{x \\to 0} \\frac{(\\sqrt{1+x}-1)(\\sqrt{1+x}+1)}{x(\\sqrt{1+x}+1)} = \\lim_{x \\to 0} \\frac{x}{x(\\sqrt{1+x}+1)} = \\frac{1}{2}$$`,
      },
      {
        id: "mat-limit-3",
        title: "Teorema Limit Trigonometri Dasar & Teorema Apit (Squeeze Theorem)",
        slug: "limit-trigonometri-dasar",
        order: 3,
        content: `### Teorema Limit Sudut Kecil

Untuk variabel $x$ dalam satuan radian:
$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{\\tan x}{x} = 1$$
$$\\lim_{x \\to 0} \\frac{\\sin(ax)}{bx} = \\frac{a}{b}, \\quad \\lim_{x \\to 0} \\frac{\\tan(ax)}{\\sin(bx)} = \\frac{a}{b}$$

#### Teorema Apit (Squeeze Theorem):
Jika $g(x) \\le f(x) \\le h(x)$ di sekitar titik $c$ dan $\\lim_{x \\to c} g(x) = \\lim_{x \\to c} h(x) = L$, maka:
$$\\lim_{x \\to c} f(x) = L$$`,
      },
      {
        id: "mat-limit-4",
        title: "Limit di Tak Hingga dan Limit Tak Hingga (Asimtot Datar & Tegak)",
        slug: "limit-di-tak-hingga-dan-asimtot",
        order: 4,
        content: `### Limit Menuju Tak Hingga ($x \\to \\infty$)

Untuk fungsi rasional $\\frac{P(x)}{Q(x)}$:
Bagi pembilang dan penyebut dengan variabel pangkat tertinggi penyebut.
$$\\lim_{x \\to \\infty} \\frac{a x^n + \\dots}{b x^m + \\dots} = \\begin{cases} \\frac{a}{b}, & \\text{jika } n = m \\\\ 0, & \\text{jika } n < m \\\\ \\pm \\infty, & \\text{jika } n > m \\end{cases}$$

#### Asimtot:
- **Asimtot Datar:** Garis $y = L$ jika $\\lim_{x \\to \\pm \\infty} f(x) = L$.
- **Asimtot Tegak:** Garis $x = c$ jika $\\lim_{x \\to c^\\pm} f(x) = \\pm \\infty$.`,
      },
      {
        id: "mat-limit-5",
        title: "Kekontinuan Fungsi & Teorema Nilai Antara (Intermediate Value Theorem)",
        slug: "kekontinuan-fungsi-dan-ivt",
        order: 5,
        content: `### Syarat Kekontinuan Titik

Fungsi $f(x)$ kontinu di $x = c$ jika dan hanya jika memenuhi **tiga syarat**:
1. $f(c)$ terdefinisi (bernilai riil).
2. $\\lim_{x \\to c} f(x)$ ada.
3. $\\lim_{x \\to c} f(x) = f(c)$.

#### Teorema Nilai Antara (IVT):
Jika $f$ kontinu pada $[a, b]$ dan $u$ berada di antara $f(a)$ dan $f(b)$, maka terdapat setidaknya satu nilai $c \\in (a, b)$ sedemikian sehingga:
$$f(c) = u$$`,
      },
    ],
  },

  // 7. Kalkulus SMA: Turunan & Aplikasinya (6 Modul)
  {
    id: "topic-turunan",
    title: "Turunan & Aplikasinya",
    slug: "turunan-dan-aplikasi",
    category: "Kalkulus",
    difficulty: "BEGINNER",
    description:
      "Konsep diferensial, aturan aljabar, aturan rantai, turunan trigonometri & transenden, gradien garis singgung, laju yang berkaitan, titik belok, uji ekstremum, dan optimasi.",
    order: 7,
    materials: [
      {
        id: "mat-turunan-1",
        title: "Konsep Limit & Definisi Turunan Pertama (First Principle)",
        slug: "konsep-limit-dan-definisi-turunan",
        order: 1,
        content: `### Definisi Limit Diferensial

Turunan pertama $f'(x)$ mengukur laju perubahan sesaat fungsi terhadap variabel $x$:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

#### Pembuktian Turunan $f(x) = x^2$:
$$
\\begin{aligned}
f'(x) &= \\lim_{h \\to 0} \\frac{(x + h)^2 - x^2}{h} \\\\
&= \\lim_{h \\to 0} \\frac{x^2 + 2xh + h^2 - x^2}{h} \\\\
&= \\lim_{h \\to 0} (2x + h) = 2x
\\end{aligned}
$$`,
      },
      {
        id: "mat-turunan-2",
        title: "Aturan Dasar Aljabar, Perkalian, Pembagian & Aturan Rantai",
        slug: "aturan-dasar-dan-aturan-rantai",
        order: 2,
        content: `### Aturan-Aturan Diferensiasi Aljabar

1. **Aturan Pangkat:** $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$
2. **Aturan Perkalian:** $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$
3. **Aturan Pembagian:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$
4. **Aturan Rantai (Chain Rule):**
   $$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x) \\quad \\text{atau} \\quad \\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$`,
      },
      {
        id: "mat-turunan-3",
        title: "Turunan Fungsi Trigonometri, Eksponensial, & Logaritma Natural",
        slug: "turunan-trigonometri-eksponen-logaritma",
        order: 3,
        content: `### Turunan Fungsi Transenden

#### 1. Fungsi Trigonometri:
- $\\frac{d}{dx}[\\sin x] = \\cos x$
- $\\frac{d}{dx}[\\cos x] = -\\sin x$
- $\\frac{d}{dx}[\\tan x] = \\sec^2 x$

#### 2. Fungsi Eksponensial & Logaritma Natural:
- $\\frac{d}{dx}[e^x] = e^x, \\quad \\frac{d}{dx}[a^x] = a^x \\ln a$
- $\\frac{d}{dx}[\\ln x] = \\frac{1}{x}, \\quad \\frac{d}{dx}[\\log_a x] = \\frac{1}{x \\ln a}$`,
      },
      {
        id: "mat-turunan-4",
        title: "Persamaan Garis Singgung & Garis Normal Kurva",
        slug: "garis-singgung-dan-normal",
        order: 4,
        content: `### Garis Singgung Kurva

Gradien garis singgung kurva $y = f(x)$ pada titik singgung $(x_1, y_1)$ adalah nilai turunan pertama di titik tersebut:
$$m_s = f'(x_1)$$
Persamaan garis singgung:
$$y - y_1 = m_s (x - x_1)$$

#### Garis Normal:
Garis normal adalah garis yang tegak lurus terhadap garis singgung di titik yang sama:
$$m_n = -\\frac{1}{m_s}$$
Persamaan garis normal:
$$y - y_1 = -\\frac{1}{m_s}(x - x_1)$$`,
      },
      {
        id: "mat-turunan-5",
        title: "Laju Perubahan Sesaat & Laju yang Berkaitan (Related Rates)",
        slug: "laju-perubahan-dan-related-rates",
        order: 5,
        content: `### Laju yang Berkaitan (Related Rates)

Bila dua variabel $x$ dan $y$ bergantung pada waktu $t$ dan dihubungkan oleh persamaan $F(x, y) = 0$, diferensiasi implisit terhadap waktu $t$ menghasilkan relasi laju perubahan sesaat:
$$\\frac{d}{dt}[F(x, y)] = 0$$

#### Contoh Kasus: Tangki Air Kerucut
Volume kerucut $V = \\frac{1}{3}\\pi r^2 h$. Dengan perbandingan geometri $r = k \\cdot h$:
$$V = \\frac{1}{3}\\pi k^2 h^3 \\implies \\frac{dV}{dt} = \\pi k^2 h^2 \\frac{dh}{dt}$$`,
      },
      {
        id: "mat-turunan-6",
        title: "Uji Turunan Pertama & Kedua: Titik Ekstrem, Kecekungan, & Optimasi",
        slug: "aplikasi-garis-singgung-dan-titik-ekstrem",
        order: 6,
        content: `### Titik Kritis & Uji Ekstremum

Titik kritis $x_0$ terjadi ketika $f'(x_0) = 0$ (titik stasioner) atau $f'(x_0)$ tidak terdefinisi.

#### 1. Uji Turunan Pertama:
- Jika tanda $f'(x)$ berganti dari $+$ ke $-$, maka $x_0$ adalah **Maksimum Lokal**.
- Jika tanda $f'(x)$ berganti dari $-$ ke $+$, maka $x_0$ adalah **Minimum Lokal**.

#### 2. Uji Turunan Kedua:
- Jika $f''(x_0) < 0$, kurva cekung ke bawah $\\implies$ **Maksimum Lokal**.
- Jika $f''(x_0) > 0$, kurva cekung ke atas $\\implies$ **Minimum Lokal**.
- Titik Belok (*Inflection Point*) terjadi saat $f''(x_0) = 0$ dan kecekungan berubah arah.`,
      },
    ],
  },

  // 8. Kalkulus SMA: Integral Tak Tentu & Tentu (6 Modul)
  {
    id: "topic-integral",
    title: "Integral Tak Tentu & Tentu",
    slug: "integral-tak-tentu-dan-tentu",
    category: "Kalkulus",
    difficulty: "INTERMEDIATE",
    description:
      "Antiturunan aljabar, jumlah Riemann, Teorema Dasar Kalkulus I & II, integrasi substitusi aljabar, perhitungan luas bidang di antara kurva, dan aplikasi kinematika fisika.",
    order: 8,
    materials: [
      {
        id: "mat-integral-1",
        title: "Antiturunan & Konsep Dasar Integral Tak Tentu",
        slug: "antiturunan-dan-integral-tak-tentu",
        order: 1,
        content: `### Konsep Antiturunan

Integral tak tentu merupakan operasi invers (kebalikan) langsung dari diferensiasi:
$$\\int f(x) \\, dx = F(x) + C \\iff F'(x) = f(x)$$

#### Aturan Pangkat Standar:
$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad n \\neq -1$$
$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$
$$\\int e^x \\, dx = e^x + C$$`,
      },
      {
        id: "mat-integral-2",
        title: "Jumlah Riemann & Definisi Integral Tentu",
        slug: "jumlah-riemann-dan-integral-tentu",
        order: 2,
        content: `### Aproksimasi Luas Riemann

Luas daerah di bawah kurva $f(x)$ pada interval $[a, b]$ dibagi menjadi $n$ subinterval dengan lebar $\\Delta x = \\frac{b - a}{n}$:
$$R_n = \\sum_{i=1}^n f(x_i^*) \\Delta x$$

Integral tentu didefinisikan sebagai limit dari jumlah Riemann saat partisi menuju tak terhingga:
$$\\int_a^b f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*) \\Delta x$$`,
      },
      {
        id: "mat-integral-3",
        title: "Teorema Fundamental Kalkulus I & II",
        slug: "antiturunan-dan-teorema-fundamental",
        order: 3,
        content: `### Teorema Fundamental Kalkulus (FTC)

#### FTC Bagian 1 (Diferensiasi Akumulasi):
Jika $f$ kontinu pada $[a, b]$ dan $g(x) = \\int_a^x f(t) \\, dt$, maka:
$$g'(x) = \\frac{d}{dx}\\left[\\int_a^x f(t) \\, dt\\right] = f(x)$$

#### FTC Bagian 2 (Evaluasi Nilai Tentu):
Jika $F$ adalah antiturunan dari $f$ pada $[a, b]$:
$$\\int_a^b f(x) \\, dx = [F(x)]_a^b = F(b) - F(a)$$`,
      },
      {
        id: "mat-integral-4",
        title: "Teknik Integrasi: Metode Substitusi Aljabar",
        slug: "metode-substitusi-aljabar",
        order: 4,
        content: `### Aturan Pembalikan Rantai (Substitusi)

Bila suatu integran memuat fungsi $g(x)$ dan turunannya $g'(x)$:
$$\\int f(g(x)) g'(x) \\, dx = \\int f(u) \\, du, \\quad u = g(x)$$

#### Contoh Kalkulasi:
Hitung $\\int 2x(x^2 + 1)^4 \\, dx$:
- Misalkan $u = x^2 + 1 \\implies du = 2x \\, dx$
- $\\int u^4 \\, du = \\frac{1}{5}u^5 + C = \\frac{1}{5}(x^2 + 1)^5 + C$`,
      },
      {
        id: "mat-integral-5",
        title: "Aplikasi Integral: Luas Daerah di Bawah & Antara Dua Kurva",
        slug: "luas-daerah-integral",
        order: 5,
        content: `### Luas Daerah Antara Dua Kurva

Jika kurva atas adalah $y = f(x)$ dan kurva bawah adalah $y = g(x)$ sedemikian sehingga $f(x) \\ge g(x)$ pada interval $[a, b]$:
$$L = \\int_a^b [f(x) - g(x)] \\, dx$$

#### Integrasi terhadap Sumbu Y:
Jika kurva dinyatakan sebagai $x = f(y)$ dan $x = g(y)$ dengan $f(y) \\ge g(y)$ pada interval $[c, d]$:
$$L = \\int_c^d [f(y) - g(y)] \\, dy$$`,
      },
      {
        id: "mat-integral-6",
        title: "Aplikasi Fisika: Gerak Lurus Beraturan & Nilai Rata-rata Integral",
        slug: "aplikasi-kinematika-dan-rata-rata-integral",
        order: 6,
        content: `### Kinematika Gerak Lurus

Diberikan fungsi percepatan $a(t)$ dan kecepatan $v(t)$:
- Kecepatan: $v(t) = \\int a(t) \\, dt$
- Posisi / Perpindahan: $s(t) = \\int v(t) \\, dt$

#### Nilai Rata-Rata Fungsi Kontinu:
Nilai rata-rata fungsi $f(x)$ pada interval $[a, b]$ didefinisikan sebagai:
$$f_{\\text{avg}} = \\frac{1}{b - a} \\int_a^b f(x) \\, dx$$`,
      },
    ],
  },

  // 9. Statistika & Peluang (SMA) (5 Modul)
  {
    id: "topic-statistika",
    title: "Statistika & Teori Peluang",
    slug: "statistika-dan-teori-peluang",
    category: "Statistika",
    difficulty: "BEGINNER",
    description:
      "Statistika deskriptif (mean, median, modus, varians, deviasi standar), kaidah pencacahan faktorial, permutasi, kombinasi, peluang empiris, peluang kejadian majemuk, serta teorema Bayes.",
    order: 9,
    materials: [
      {
        id: "mat-stat-1",
        title: "Ukuran Pemusatan Data: Mean, Median, dan Modus",
        slug: "ukuran-pemusatan-data",
        order: 1,
        content: `### Ukuran Pemusatan Data

1. **Mean (Rata-Rata Hitung):**
   $$\\bar{x} = \\frac{\\sum_{i=1}^n x_i}{n} = \\frac{\\sum f_i x_i}{\\sum f_i}$$
2. **Median (Nilai Tengah Data Berkelompok):**
   $$Me = L + \\left( \\frac{\\frac{1}{2}N - \\sum f_k}{f_{me}} \\right) p$$
3. **Modus (Nilai Paling Sering Muncul):**
   $$Mo = L + \\left( \\frac{d_1}{d_1 + d_2} \\right) p$$`,
      },
      {
        id: "mat-stat-2",
        title: "Ukuran Penyebaran Data: Varians, Standar Deviasi, & Kuartil",
        slug: "ukuran-pemusatan-dan-dispersi",
        order: 2,
        content: `### Dispersi & Variabilitas

1. **Varians Sampel ($s^2$):**
   $$s^2 = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})^2}{n - 1}$$
2. **Simpangan Baku (Standard Deviation):**
   $$s = \\sqrt{s^2}$$
3. **Jangkauan Interkuartil (IQR):**
   $$IQR = Q_3 - Q_1, \\quad Q_d = \\frac{1}{2}(Q_3 - Q_1)$$`,
      },
      {
        id: "mat-stat-3",
        title: "Kaidah Pencacahan: Aturan Perkalian, Permutasi & Kombinasi",
        slug: "kaidah-pencacahan-permutasi-kombinasi",
        order: 3,
        content: `### Kaidah Pencacahan

- **Aturan Perkalian:** Jika kejadian 1 dapat terjadi dalam $n_1$ cara dan kejadian 2 dalam $n_2$ cara, kedua kejadian berurutan dapat terjadi dalam $n_1 \\times n_2$ cara.
- **Permutasi (Urutan Diperhatikan):**
  $$P(n, r) = \\frac{n!}{(n - r)!}$$
- **Kombinasi (Urutan Tidak Diperhatikan):**
  $$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}$$`,
      },
      {
        id: "mat-stat-4",
        title: "Teori Peluang Dasar, Ruang Sampel & Peluang Kejadian Majemuk",
        slug: "peluang-kejadian-dan-bersyarat",
        order: 4,
        content: `### Teori Peluang Klasik

Peluang kejadian $A$ pada ruang sampel $S$ yang berbobot sama:
$$P(A) = \\frac{n(A)}{n(S)}, \\quad 0 \\le P(A) \\le 1$$

#### Komplemen & Gabungan Kejadian:
- $P(A') = 1 - P(A)$
- $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- Untuk dua kejadian saling lepas ($A \\cap B = \\emptyset$):
  $$P(A \\cup B) = P(A) + P(B)$$`,
      },
      {
        id: "mat-stat-5",
        title: "Peluang Bersyarat, Kejadian Saling Bebas & Teorema Bayes",
        slug: "peluang-bersyarat-dan-teorema-bayes",
        order: 5,
        content: `### Peluang Bersyarat & Teorema Bayes

Peluang kejadian $A$ terjadi jika diketahui kejadian $B$ telah terjadi terlebih dahulu:
$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$

#### Kejadian Saling Bebas (Independent Events):
Dua kejadian saling bebas jika terjadinya $B$ tidak mempengaruhi peluang $A$:
$$P(A \\cap B) = P(A) \\cdot P(B) \\iff P(A \\mid B) = P(A)$$

#### Teorema Bayes:
$$P(A_i \\mid B) = \\frac{P(B \\mid A_i) P(A_i)}{\\sum_{j} P(B \\mid A_j) P(A_j)}$$`,
      },
    ],
  },

  // =========================================================================
  // JENJANG PERGURUAN TINGGI (TPB, SAINS, & TEKNIK)
  // =========================================================================

  // 10. Kalkulus Lanjut: Teknik Integrasi & Integral Tak Wajar (5 Modul)
  {
    id: "topic-integrasi-lanjut",
    title: "Teknik Integrasi Lanjut & Integral Tak Wajar",
    slug: "teknik-integrasi-lanjut-dan-tak-wajar",
    category: "Kalkulus Lanjut",
    difficulty: "ADVANCED",
    description:
      "Metode integrasi parsial, substitusi trigonometri khusus, dekomposisi pecahan parsial untuk fungsi rasional, substitusi Weierstrass, serta konvergensi integral tak wajar dengan batas tak hingga.",
    order: 10,
    materials: [
      {
        id: "mat-intlanjut-1",
        title: "Metode Integrasi Parsial & Formula Reduksi",
        slug: "integral-parsial-dan-reduksi",
        order: 1,
        content: `### Teorema Integral Parsial

Diturunkan dari aturan perkalian diferensial $d(uv) = u\\,dv + v\\,du$:
$$\\int u \\, dv = u \\cdot v - \\int v \\, du$$

#### Aturan Prioritas Pemilihan $u$ (Metode LIATE):
1. **L** - Logarithmic: $\\ln x, \\log_a x$
2. **I** - Inverse Trig: $\\arcsin x, \\arctan x$
3. **A** - Algebraic: $x^n, x^2 + 1$
4. **T** - Trigonometric: $\\sin x, \\cos x$
5. **E** - Exponential: $e^x, a^x$

#### Metode Tabular (DI Method):
Metode efisien untuk fungsi aljabar yang berpasangan dengan fungsi trigonometri atau eksponensial dengan mendiferensiasikan kolom $D$ hingga $0$ dan mengintegrasikan kolom $I$.`,
      },
      {
        id: "mat-intlanjut-2",
        title: "Substitusi Trigonometri Khusus",
        slug: "substitusi-trigonometri-khusus",
        order: 2,
        content: `### Mengeliminasi Tanda Akar Kuadrat

Gunakan identitas Pythagoras untuk mengubah bentuk akar menjadi fungsi trigonometri tunggal:
1. $\\sqrt{a^2 - x^2} \\implies x = a\\sin\\theta, \\quad dx = a\\cos\\theta\\,d\\theta, \\quad \\sqrt{a^2 - x^2} = a\\cos\\theta$
2. $\\sqrt{a^2 + x^2} \\implies x = a\\tan\\theta, \\quad dx = a\\sec^2\\theta\\,d\\theta, \\quad \\sqrt{a^2 + x^2} = a\\sec\\theta$
3. $\\sqrt{x^2 - a^2} \\implies x = a\\sec\\theta, \\quad dx = a\\sec\\theta\\tan\\theta\\,d\\theta, \\quad \\sqrt{x^2 - a^2} = a\\tan\\theta$`,
      },
      {
        id: "mat-intlanjut-3",
        title: "Integrasi Fungsi Rasional melalui Dekomposisi Pecahan Parsial",
        slug: "substitusi-trigonometri-dan-pecahan-parsial",
        order: 3,
        content: `### Dekomposisi Pecahan Parsial

Untuk mengintegrasikan fungsi rasional sejati $\\frac{P(x)}{Q(x)}$ (derajat $P < Q$):
1. **Faktor Linear Berbeda:**
   $$\\frac{P(x)}{(x - r_1)(x - r_2)} = \\frac{A}{x - r_1} + \\frac{B}{x - r_2}$$
2. **Faktor Linear Berulang:**
   $$\\frac{P(x)}{(x - r)^k} = \\frac{A_1}{x - r} + \\frac{A_2}{(x - r)^2} + \\dots + \\frac{A_k}{(x - r)^k}$$
3. **Faktor Kuadratik Tak Tereduksi:**
   $$\\frac{P(x)}{x^2 + ax + b} = \\frac{Ax + B}{x^2 + ax + b}$$`,
      },
      {
        id: "mat-intlanjut-4",
        title: "Substitusi Aljabar Khusus & Substitusi Weierstrass",
        slug: "substitusi-aljabar-khusus-dan-weierstrass",
        order: 4,
        content: `### Substitusi Setengah Sudut Weierstrass

Substitusi $t = \\tan\\left(\\frac{x}{2}\\right)$ mengubah sembarang integran rasional trigonometri menjadi integran rasional aljabar biasa:
$$\\sin x = \\frac{2t}{1 + t^2}, \\quad \\cos x = \\frac{1 - t^2}{1 + t^2}, \\quad dx = \\frac{2}{1 + t^2} \\, dt$$

#### Contoh:
Hitung $\\int \\frac{dx}{1 + \\sin x}$:
$$\\int \\frac{\\frac{2}{1+t^2} \\, dt}{1 + \\frac{2t}{1+t^2}} = \\int \\frac{2 \\, dt}{t^2 + 2t + 1} = \\int \\frac{2 \\, dt}{(t+1)^2} = -\\frac{2}{t+1} + C$$
Substitusikan kembali $t = \\tan(x/2)$.`,
      },
      {
        id: "mat-intlanjut-5",
        title: "Integral Tak Wajar (Improper Integrals) & Uji Konvergensi",
        slug: "integral-tak-wajar-konvergensi",
        order: 5,
        content: `### Klasifikasi Integral Tak Wajar

#### Tipe 1: Batas Integrasi Tak Hingga
$$\\int_a^\\infty f(x) \\, dx = \\lim_{t \\to \\infty} \\int_a^t f(x) \\, dx$$
Dikatakan **konvergen** jika limit ada dan berhingga; divergen jika limit tidak ada atau $\\pm \\infty$.

#### Teorema P-Integral:
$$\\int_1^\\infty \\frac{1}{x^p} \\, dx = \\begin{cases} \\frac{1}{p - 1} & \\text{jika } p > 1 \\text{ (Konvergen)} \\\\ \\text{Divergen} & \\text{jika } p \\le 1 \\end{cases}$$

#### Tipe 2: Integran Tak Terbatas (Diskontinuitas di Titik Batas)
Jika $f$ tak terdefinisi di $x = b$:
$$\\int_a^b f(x) \\, dx = \\lim_{t \\to b^-} \\int_a^t f(x) \\, dx$$`,
      },
    ],
  },

  // 11. Kalkulus Lanjut: Aplikasi Volume & Panjang Busur (4 Modul)
  {
    id: "topic-volume-busur",
    title: "Volume Benda Putar & Panjang Busur",
    slug: "volume-benda-putar-dan-panjang-busur",
    category: "Kalkulus Lanjut",
    difficulty: "INTERMEDIATE",
    description:
      "Penerapan integral definit untuk menentukan volume benda putar melalui metode cakram, cincin, dan kulit tabung, serta perhitungan panjang busur kurva parametrik.",
    order: 11,
    materials: [
      {
        id: "mat-vol-1",
        title: "Metode Cakram (Disk Method) Mengelilingi Sumbu Koordinat",
        slug: "metode-cakram-dan-cincin",
        order: 1,
        content: `### Metode Cakram (Disk Method)

Bila daerah di bawah kurva $y = f(x)$ pada $[a, b]$ diputar $360^\\circ$ mengelilingi sumbu $X$:
Elemen potongan berbentuk silinder tipis dengan jari-jari $R(x) = f(x)$ dan tebal $dx$:
$$V = \\pi \\int_a^b [f(x)]^2 \\, dx$$

#### Putaran Terhadap Sumbu Y:
Daerah dibatasi $x = g(y)$ dari $y = c$ sampai $y = d$ diputar mengelilingi sumbu $Y$:
$$V = \\pi \\int_c^d [g(y)]^2 \\, dy$$`,
      },
      {
        id: "mat-vol-2",
        title: "Metode Cincin (Washer Method) untuk Daerah Antara Dua Kurva",
        slug: "metode-cincin-washer",
        order: 2,
        content: `### Metode Cincin (Washer Method)

Ketika daerah yang diputar dibatasi oleh kurva luar $y = R(x)$ dan kurva dalam $y = r(x)$ mengelilingi sumbu $X$:
Elemen volume berbentuk cincin dengan lubang di tengah:
$$V = \\pi \\int_a^b \\left( [R(x)]^2 - [r(x)]^2 \\right) dx$$

#### Garis Putar Bukan Sumbu Koordinat ($y = k$):
$$V = \\pi \\int_a^b \\left( [R(x) - k]^2 - [r(x) - k]^2 \\right) dx$$`,
      },
      {
        id: "mat-vol-3",
        title: "Metode Kulit Tabung (Cylindrical Shell Method)",
        slug: "kulit-tabung-dan-panjang-busur",
        order: 3,
        content: `### Metode Kulit Tabung

Sangat efektif ketika metode cakram/cincin menghasilkan integran yang sulit diintegrasikan terhadap sumbu putar.
Jika daerah di bawah $y = f(x)$ diputar mengelilingi sumbu $Y$:
Elemen selimut silinder memiliki jari-jari $x$, tinggi $f(x)$, dan tebal $dx$:
$$V = 2\\pi \\int_a^b x \\cdot f(x) \\, dx$$`,
      },
      {
        id: "mat-vol-4",
        title: "Panjang Busur Kurva Bidang & Luas Permukaan Benda Putar",
        slug: "panjang-busur-dan-luas-permukaan-putar",
        order: 4,
        content: `### Panjang Busur Kurva (Arc Length)

Diturunkan dari teorema Pythagoras infinitesimal $ds = \\sqrt{(dx)^2 + (dy)^2}$:
$$L = \\int_a^b \\sqrt{1 + [f'(x)]^2} \\, dx$$

#### Luas Permukaan Benda Putar (Surface of Revolution):
Permukaan hasil putaran kurva $y = f(x)$ mengelilingi sumbu $X$:
$$S = 2\\pi \\int_a^b f(x) \\sqrt{1 + [f'(x)]^2} \\, dx$$`,
      },
    ],
  },

  // 12. Kalkulus Lanjut: Barisan & Deret Tak Hingga (6 Modul)
  {
    id: "topic-deret-tak-hingga",
    title: "Barisan & Deret Tak Hingga",
    slug: "barisan-dan-deret-tak-hingga",
    category: "Kalkulus Lanjut",
    difficulty: "ADVANCED",
    description:
      "Uji konvergensi deret tak hingga (integral, banding, rasio, akar), deret bolak-balik, konvergensi mutlak vs bersyarat, deret pangkat, serta ekspansi Deret Taylor dan Maclaurin.",
    order: 12,
    materials: [
      {
        id: "mat-derettakhingga-1",
        title: "Barisan Bilangan Real & Konvergensi Barisan",
        slug: "barisan-real-dan-konvergensi",
        order: 1,
        content: `### Barisan Tak Hingga

Barisan $\\{a_n\\}$ adalah fungsi yang domainnya himpunan bilangan bulat positif.
Barisan dikatakan **konvergen ke limit $L$** jika:
$$\\lim_{n \\to \\infty} a_n = L$$

#### Teorema Barisan Monoton:
Setiap barisan yang **monoton** (selalu naik atau selalu turun) dan **terbatas** pasti konvergen.`,
      },
      {
        id: "mat-derettakhingga-2",
        title: "Deret Tak Hingga, Deret Geometri & Uji Divergensi Suku ke-n",
        slug: "deret-tak-hingga-dan-uji-divergensi",
        order: 2,
        content: `### Deret Tak Hingga & Deret Parsial

Jumlah deret tak hingga $\\sum_{n=1}^\\infty a_n$ didefinisikan sebagai limit barisan jumlah parsial $S_k$:
$$\\sum_{n=1}^\\infty a_n = \\lim_{k \\to \\infty} \\sum_{n=1}^k a_n$$

#### Uji Divergensi Suku ke-$n$ (Divergence Test):
Jika $\\lim_{n \\to \\infty} a_n \\neq 0$ atau limit tidak ada, maka deret $\\sum a_n$ **pasti divergen**.
*(Catatan: Jika $\\lim a_n = 0$, deret belum tentu konvergen, contohnya Deret Harmonik $\\sum \\frac{1}{n}$).*`,
      },
      {
        id: "mat-derettakhingga-3",
        title: "Uji Integral Cauchy, Deret-p, & Uji Banding",
        slug: "uji-integral-dan-uji-banding",
        order: 3,
        content: `### Uji Konvergensi Deret Positif

#### 1. Uji Integral:
Jika $f(x)$ kontinu, positif, dan menurun untuk $x \\ge 1$, deret $\\sum_{n=1}^\\infty a_n$ dan integral $\\int_1^\\infty f(x) \\, dx$ memiliki perilaku yang sama (keduanya sama-sama konvergen atau divergen).

#### 2. Deret-$p$:
$$\\sum_{n=1}^\\infty \\frac{1}{n^p} = \\begin{cases} \\text{Konvergen}, & \\text{jika } p > 1 \\\\ \\text{Divergen}, & \\text{jika } p \\le 1 \\end{cases}$$

#### 3. Uji Banding Limit (Limit Comparison Test):
Jika $\\lim_{n \\to \\infty} \\frac{a_n}{b_n} = c > 0$, maka $\\sum a_n$ dan $\\sum b_n$ sama-sama konvergen atau sama-sama divergen.`,
      },
      {
        id: "mat-derettakhingga-4",
        title: "Uji Rasio (D'Alembert) & Uji Akar (Cauchy)",
        slug: "uji-rasio-dan-uji-akar",
        order: 4,
        content: `### Uji Rasio (Ratio Test)

Hitung nilai limit rasio dua suku berurutan:
$$L = \\lim_{n \\to \\infty} \\left| \\frac{a_{n+1}}{a_n} \\right|$$
1. Jika $L < 1$, deret **konvergen mutlak**.
2. Jika $L > 1$ atau $L = \\infty$, deret **divergen**.
3. Jika $L = 1$, uji tidak dapat memberikan kesimpulan.

#### Uji Akar (Root Test):
Hitung limit akar pangkat $n$:
$$L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$$
Aturan kesimpulan sama dengan Uji Rasio. Sangat efektif untuk bentuk $a_n = (b_n)^n$.`,
      },
      {
        id: "mat-derettakhingga-5",
        title: "Deret Berganti Tanda, Konvergensi Mutlak & Konvergensi Bersyarat",
        slug: "deret-berganti-tanda-dan-mutlak",
        order: 5,
        content: `### Deret Berganti Tanda (Alternating Series)

Bentuk deret: $\\sum (-1)^{n-1} b_n$ dengan $b_n > 0$.

#### Uji Leibniz:
Deret berganti tanda konvergen jika:
1. $b_{n+1} \\le b_n$ untuk semua $n$ (monoton turun)
2. $\\lim_{n \\to \\infty} b_n = 0$

#### Konvergensi Mutlak vs Bersyarat:
- **Konvergen Mutlak:** Bila $\\sum |a_n|$ konvergen.
- **Konvergen Bersyarat:** Bila $\\sum a_n$ konvergen tetapi $\\sum |a_n|$ divergen (contoh: Deret Harmonik Bolak-Balik).`,
      },
      {
        id: "mat-derettakhingga-6",
        title: "Deret Pangkat, Deret Taylor & Deret Maclaurin",
        slug: "deret-taylor-dan-maclaurin",
        order: 6,
        content: `### Ekspansi Deret Taylor & Maclaurin

Deret Taylor fungsi $f(x)$ di sekitar titik $x = a$:
$$f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!} (x - a)^n = f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x - a)^2 + \\dots$$

Jika diekspansi di sekitar pusat $a = 0$, disebut **Deret Maclaurin**:
- $e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots$
- $\\sin x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!} = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$
- $\\cos x = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n}}{(2n)!} = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\dots$
- $\\frac{1}{1 - x} = \\sum_{n=0}^\\infty x^n = 1 + x + x^2 + x^3 + \\dots, \\quad (|x| < 1)$`,
      },
    ],
  },

  // 13. Kalkulus Multivariabel (Kuliah) (6 Modul)
  {
    id: "topic-multivariabel",
    title: "Kalkulus Peubah Banyak (Multivariable)",
    slug: "kalkulus-peubah-banyak-multivariable",
    category: "Kalkulus Lanjut",
    difficulty: "ADVANCED",
    description:
      "Fungsi peubah banyak, limit multivariabel, turunan parsial, bidang singgung, aturan rantai, vektor gradien, turunan berarah, penentuan nilai ekstrem, pengali Lagrange, serta integral lipat dua.",
    order: 13,
    materials: [
      {
        id: "mat-multi-1",
        title: "Fungsi Peubah Banyak, Domain, dan Kurva Ketinggian",
        slug: "fungsi-multivariabel-dan-kurva-ketinggian",
        order: 1,
        content: `### Fungsi Dua Variabel

Fungsi $z = f(x, y)$ memetakan setiap pasangan terurut $(x, y) \\in D \\subset \\mathbb{R}^2$ ke nilai bilangan riil $z \\in \\mathbb{R}$.

#### Kurva Ketinggian (Level Curves / Contours):
Kurva ketinggian adalah irisan permukaan $z = f(x, y)$ dengan bidang horizontal $z = c$:
$$f(x, y) = c$$
Kerapatan kurva ketinggian pada peta kontur mencerminkan curamnya permukaan fungsi di titik tersebut.`,
      },
      {
        id: "mat-multi-2",
        title: "Turunan Parsial, Bidang Singgung, & Hampiran Linear",
        slug: "turunan-parsial-dan-bidang-singgung",
        order: 2,
        content: `### Turunan Parsial

Turunan parsial terhadap $x$ memperlakukan variabel $y$ sebagai konstanta:
$$\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h, y) - f(x, y)}{h}$$
$$\\frac{\\partial f}{\\partial y} = \\lim_{k \\to 0} \\frac{f(x, y + k) - f(x, y)}{k}$$

#### Persamaan Bidang Singgung:
Bidang singgung pada permukaan $z = f(x, y)$ di titik $(x_0, y_0, z_0)$:
$$z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)$$

#### Diferensial Total:
$$dz = \\frac{\\partial f}{\\partial x} \\, dx + \\frac{\\partial f}{\\partial y} \\, dy$$`,
      },
      {
        id: "mat-multi-3",
        title: "Aturan Rantai Multivariabel & Turunan Implisit",
        slug: "aturan-rantai-multivariabel",
        order: 3,
        content: `### Aturan Rantai Peubah Banyak

Jika $z = f(x, y)$ dengan $x = g(t)$ dan $y = h(t)$ keduanya terdiferensiasikan:
$$\\frac{dz}{dt} = \\frac{\\partial f}{\\partial x} \\frac{dx}{dt} + \\frac{\\partial f}{\\partial y} \\frac{dy}{dt}$$

#### Turunan Implisit Multivariabel:
Jika persamaan $F(x, y, z) = 0$ mendefinisikan $z$ secara implisit sebagai fungsi dari $x$ dan $y$:
$$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}, \\quad \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}, \\quad (F_z \\neq 0)$$`,
      },
      {
        id: "mat-multi-4",
        title: "Vektor Gradien, Turunan Berarah & Laju Maksimum",
        slug: "turunan-parsial-dan-vektor-gradien",
        order: 4,
        content: `### Vektor Gradien

Operator nabla $\\nabla f$ membentuk vektor turunan parsial:
$$\\nabla f(x, y) = \\left( \\frac{\\partial f}{\\partial x}, \\, \\frac{\\partial f}{\\partial y} \\right)$$

#### Turunan Berarah (Directional Derivative):
Laju perubahan $f$ ke arah vektor satuan $\\mathbf{u} = (u_1, u_2)$ dengan $\\|\\mathbf{u}\\| = 1$:
$$D_{\\mathbf{u}} f(x, y) = \\nabla f(x, y) \\cdot \\mathbf{u} = \\|\\nabla f\\| \\cos\\theta$$

#### Sifat Kunci:
1. Laju pertambahan maksimum bernilai $\\|\\nabla f\\|$ dan terjadi ke arah vektor gradien $\\nabla f$.
2. Vektor gradien $\\nabla f(x_0, y_0)$ selalu tegak lurus terhadap kurva ketinggian $f(x, y) = c$ di titik tersebut.`,
      },
      {
        id: "mat-multi-5",
        title: "Nilai Ekstrem, Titik Pelana, & Uji Turunan Parsial Kedua",
        slug: "titik-ekstrem-dan-titik-pelana",
        order: 5,
        content: `### Titik Kritis Fungsi Multivariabel

Titik $(x_0, y_0)$ adalah titik kritis jika $\\nabla f(x_0, y_0) = \\mathbf{0}$, yaitu:
$$f_x(x_0, y_0) = 0 \\quad \\text{dan} \\quad f_y(x_0, y_0) = 0$$

#### Uji Determinan Hessian ($D$):
$$D = f_{xx}(x_0, y_0) f_{yy}(x_0, y_0) - [f_{xy}(x_0, y_0)]^2$$
1. Jika $D > 0$ dan $f_{xx} > 0 \\implies$ **Minimum Lokal**.
2. Jika $D > 0$ dan $f_{xx} < 0 \\implies$ **Maksimum Lokal**.
3. Jika $D < 0 \\implies$ **Titik Pelana (Saddle Point)**.
4. Jika $D = 0 \\implies$ Pengujian gagal/inkonklusif.`,
      },
      {
        id: "mat-multi-6",
        title: "Metode Pengali Lagrange & Integral Lipat Dua pada Bidang",
        slug: "integral-lipat-dua",
        order: 6,
        content: `### Optimasi Berkendala: Pengali Lagrange

Untuk mencari nilai ekstrem dari $f(x, y)$ terhadap kendala $g(x, y) = k$:
$$\\nabla f = \\lambda \\nabla g \\quad \\text{dan} \\quad g(x, y) = k$$
Di mana $\\lambda$ disebut sebagai pengali Lagrange (*Lagrange multiplier*).

#### Integral Lipat Dua & Teorema Fubini:
Volume di bawah permukaan $z = f(x, y)$ di atas persegi panjang $R = [a, b] \\times [c, d]$:
$$\\iint_R f(x, y) \\, dA = \\int_a^b \\left( \\int_c^d f(x, y) \\, dy \\right) dx = \\int_c^d \\left( \\int_a^b f(x, y) \\, dx \\right) dy$$`,
      },
    ],
  },

  // 14. Aljabar Linear: Matriks & SPL (6 Modul)
  {
    id: "topic-matriks",
    title: "Matriks & Sistem Persamaan Linear",
    slug: "matriks-dan-sistem-persamaan-linear",
    category: "Aljabar Linear",
    difficulty: "INTERMEDIATE",
    description:
      "Operasi matriks, sifat transpos, determinan ordo tinggi (ekspansi kofaktor), operasi baris elementer (OBE), invers matriks adjoin & Gauss-Jordan, serta Teorema Cramer untuk SPL.",
    order: 14,
    materials: [
      {
        id: "mat-matriks-1",
        title: "Operasi Dasar, Transpos, dan Perkalian Matriks",
        slug: "operasi-dasar-dan-perkalian-matriks",
        order: 1,
        content: `### Perkalian Dua Matriks

Dua matriks $A_{m \\times k}$ dan $B_{k \\times n}$ dapat dikalikan menghasilkan matriks $C_{m \\times n}$ dengan elemen baris $i$ kolom $j$:
$$c_{ij} = \\sum_{r=1}^k a_{ir} b_{rj}$$

#### Sifat-Sifat Aljabar Matriks:
- **Tidak Komutatif:** Secara umum $AB \\neq BA$.
- **Asosiatif:** $(AB)C = A(BC)$
- **Distributif:** $A(B + C) = AB + AC$
- **Transpos Perkalian:** $(AB)^T = B^T A^T$`,
      },
      {
        id: "mat-matriks-2",
        title: "Determinan Matriks: Metode Sarrus & Ekspansi Kofaktor Laplace",
        slug: "determinan-matriks-2x2-dan-3x3",
        order: 2,
        content: `### Determinan Matriks

#### Ordo $2 \\times 2$:
$$\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

#### Ekspansi Kofaktor Laplace (Sembarang Ordo $n \\times n$):
Ekspansi sepanjang baris ke-$i$:
$$\\det(A) = \\sum_{j=1}^n a_{ij} C_{ij} = \\sum_{j=1}^n a_{ij} (-1)^{i+j} M_{ij}$$
Di mana $M_{ij}$ adalah minor determinan submatriks yang diperoleh dengan mencoret baris ke-$i$ dan kolom ke-$j$.

#### Sifat Fundamental Determinan:
- $\\det(AB) = \\det(A) \\cdot \\det(B)$
- $\\det(A^T) = \\det(A)$
- $\\det(A^{-1}) = \\frac{1}{\\det(A)}$`,
      },
      {
        id: "mat-matriks-3",
        title: "Operasi Baris Elementer (OBE) & Matriks Eselon Baris Tereduksi",
        slug: "operasi-baris-elementer-obe",
        order: 3,
        content: `### Tiga Jenis Operasi Baris Elementer (OBE)

1. Menukar posisi dua baris: $R_i \\leftrightarrow R_j$
2. Mengalikan satu baris dengan skalar tak nol: $R_i \\to k \\cdot R_i, \\quad (k \\neq 0)$
3. Menambahkan kelipatan suatu baris ke baris lain: $R_i \\to R_i + k \\cdot R_j$

#### Bentuk Eselon Baris Tereduksi (RREF):
1. Setiap elemen tak nol pertama dalam suatu baris adalah $1$ (satu utama / *leading 1*).
2. Satu utama pada baris bawah terletak lebih ke kanan dari baris di atasnya.
3. Semua elemen lain di kolom yang memuat satu utama bernilai $0$.`,
      },
      {
        id: "mat-matriks-4",
        title: "Invers Matriks: Metode Adjoin & Eliminasi Gauss-Jordan",
        slug: "invers-matriks-dan-spl",
        order: 4,
        content: `### Invers Matriks Non-Singular

Matriks persegi $A$ memiliki balikan $A^{-1}$ jika dan hanya jika $\\det(A) \\neq 0$:
$$A A^{-1} = A^{-1} A = I$$

#### 1. Metode Matriks Adjoin:
$$A^{-1} = \\frac{1}{\\det(A)} \\operatorname{Adj}(A) = \\frac{1}{\\det(A)} [C_{ij}]^T$$

#### 2. Metode Eliminasi Gauss-Jordan:
Bentuk matriks partisi augmented $[A \\mid I]$ lalu terapkan OBE sampai menghasilkan $[I \\mid A^{-1}]$.`,
      },
      {
        id: "mat-matriks-5",
        title: "Penyelesaian SPL: Aturan Cramer & Matriks Balikan",
        slug: "aturan-cramer-dan-matriks-balikan",
        order: 5,
        content: `### Sistem Persamaan Linear Bentuk Matriks

Bentuk matriks dari SPL:
$$A\\mathbf{x} = \\mathbf{b}$$

#### 1. Solusi Melalui Matriks Balikan:
Jika $A$ non-singular (memiliki invers):
$$\\mathbf{x} = A^{-1} \\mathbf{b}$$

#### 2. Aturan Cramer:
Untuk SPL dengan jumlah persamaan sama dengan jumlah variabel dan $\\det(A) \\neq 0$:
$$x_j = \\frac{\\det(A_j)}{\\det(A)}$$
Di mana $A_j$ adalah matriks $A$ yang kolom ke-$j$ nya diganti dengan vektor konstanta $\\mathbf{b}$.`,
      },
      {
        id: "mat-matriks-6",
        title: "Analisis Konsistensi SPL & Solusi Parametrik Tak Hingga",
        slug: "analisis-konsistensi-spl-parametrik",
        order: 6,
        content: `### Tiga Kemungkinan Himpunan Solusi SPL

1. **Solusi Tunggal (Unique Solution):** $\\text{rank}(A) = \\text{rank}([A|b]) = n$ (jumlah variabel).
2. **Tak Hingga Banyak Solusi (Infinite Solutions):** $\\text{rank}(A) = \\text{rank}([A|b]) < n$. Variabel bebas dinyatakan dalam parameter bebas (misal $t, s \\in \\mathbb{R}$).
3. **Tidak Memiliki Solusi (Inconsistent):** $\\text{rank}(A) < \\text{rank}([A|b])$. Terdapat baris kontradiktif seperti $\\begin{pmatrix} 0 & 0 & 0 & \\mid & k \\end{pmatrix}$ dengan $k \\neq 0$.`,
      },
    ],
  },

  // 15. Aljabar Linear: Ruang Vektor & Transformasi Linear (5 Modul)
  {
    id: "topic-ruang-vektor",
    title: "Ruang Vektor & Transformasi Linear",
    slug: "ruang-vektor-dan-transformasi-linear",
    category: "Aljabar Linear",
    difficulty: "ADVANCED",
    description:
      "Aksioma ruang vektor, kombinasi linear, rentang (span), kebebasan linear, basis dan dimensi, matriks transformasi linear, nilai eigen (eigenvalues), vektor eigen, dan diagonalisasi.",
    order: 15,
    materials: [
      {
        id: "mat-vektor-1",
        title: "Ruang Vektor $\\mathbb{R}^n$, Aksioma, & Subruang",
        slug: "ruang-vektor-dan-subruang",
        order: 1,
        content: `### Aksioma Ruang Vektor

Himpunan $V$ bersama operasi penjumlahan dan perkalian skalar membentuk ruang vektor jika memenuhi 10 aksioma penutupan, asosiatif, komutatif, elemen netral $\\mathbf{0}$, elemen invers, dan distributif.

#### Syarat Uji Subruang (Subspace Test):
Himpunan bagian tak-kosong $W \\subset V$ merupakan subruang dari $V$ jika dan hanya jika:
1. $\\mathbf{0} \\in W$
2. Tertutup terhadap penjumlahan: Jika $\\mathbf{u}, \\mathbf{v} \\in W$, maka $\\mathbf{u} + \\mathbf{v} \\in W$.
3. Tertutup terhadap perkalian skalar: Jika $\\mathbf{u} \\in W$ dan $c \\in \\mathbb{R}$, maka $c\\mathbf{u} \\in W$.`,
      },
      {
        id: "mat-vektor-2",
        title: "Kombinasi Linear, Span (Rentang), dan Kebebasan Linear",
        slug: "kombinasi-linear-dan-kebebasan-linear",
        order: 2,
        content: `### Kebebasan Linear (Linear Independence)

Himpunan vektor $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_k\\}$ dikatakan **bebas linear** jika persamaan homogen:
$$c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 + \\dots + c_k \\mathbf{v}_k = \\mathbf{0}$$
hanya dipenuhi oleh skalar trivial tunggal:
$$c_1 = c_2 = \\dots = c_k = 0$$

Jika terdapat skalar non-nol yang memenuhi persamaan di atas, himpunan vektor tersebut adalah **bergantung linear** (*linearly dependent*).

#### Rentang (Span):
$$\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\} = \\left\\{ \\sum_{i=1}^k c_i \\mathbf{v}_i \\;\\middle|\\; c_i \\in \\mathbb{R} \\right\\}$$`,
      },
      {
        id: "mat-vektor-3",
        title: "Basis dan Dimensi Ruang Vektor serta Teorema Rank-Nullity",
        slug: "basis-dimensi-dan-rank-nullity",
        order: 3,
        content: `### Basis & Dimensi

Himpunan $B = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_n\\}$ merupakan **basis** bagi ruang vektor $V$ jika:
1. $B$ bebas linear.
2. $B$ merentang $V$ ($\\operatorname{Span}(B) = V$).

Dimensi $\\dim(V)$ adalah banyaknya vektor yang membentuk suatu basis bagi $V$.

#### Teorema Rank-Nullity:
Untuk sembarang matriks $A_{m \\times n}$:
$$\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$$
Di mana $\\operatorname{rank}(A)$ adalah dimensi ruang kolom $A$, dan $\\operatorname{nullity}(A)$ adalah dimensi ruang nol (*null space*) solusi $A\\mathbf{x} = \\mathbf{0}$.`,
      },
      {
        id: "mat-vektor-4",
        title: "Transformasi Linear, Kernel, Range, dan Representasi Matriks",
        slug: "transformasi-linear-dan-matriks",
        order: 4,
        content: `### Transformasi Linear

Pemetaan $T: V \\to W$ disebut transformasi linear jika memenuhi:
1. $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$
2. $T(c\\mathbf{u}) = c T(\\mathbf{u})$

#### Matriks Standar Transformasi:
Setiap transformasi linear $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ dapat dinyatakan sebagai perkalian matriks:
$$T(\\mathbf{x}) = A \\mathbf{x}, \\quad A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2) \\mid \\dots \\mid T(\\mathbf{e}_n)]$$`,
      },
      {
        id: "mat-vektor-5",
        title: "Nilai Eigen & Vektor Eigen (Persamaan Karakteristik) serta Diagonalisasi",
        slug: "nilai-eigen-dan-vektor-eigen",
        order: 5,
        content: `### Persamaan Karakteristik Eigen

Jika $A$ matriks kuadrat $n \\times n$, vektor non-nol $\\mathbf{v}$ adalah vektor eigen dengan nilai eigen $\\lambda$ jika:
$$A \\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0}$$

#### Persamaan Karakteristik:
Karena $\\mathbf{v} \\neq \\mathbf{0}$, matriks $(A - \\lambda I)$ harus singular:
$$\\det(A - \\lambda I) = 0$$

#### Diagonalisasi Matriks:
Matriks $A$ dapat didiagonalisasi ($A = P D P^{-1}$) jika dan hanya jika $A$ memiliki $n$ vektor eigen yang bebas linear:
$$D = \\begin{pmatrix} \\lambda_1 & 0 & \\dots \\\\ 0 & \\lambda_2 & \\dots \\\\ \\vdots & \\vdots & \\ddots \\end{pmatrix}, \\quad P = [\\mathbf{v}_1 \\mid \\mathbf{v}_2 \\mid \\dots \\mid \\mathbf{v}_n]$$
Perhitungan pangkat tinggi: $A^k = P D^k P^{-1}$.`,
      },
    ],
  },

  // 16. Persamaan Diferensial Biasa (Kuliah) (6 Modul)
  {
    id: "topic-pdb",
    title: "Persamaan Diferensial Biasa (PDB)",
    slug: "persamaan-diferensial-biasa",
    category: "Persamaan Diferensial",
    difficulty: "ADVANCED",
    description:
      "PDB Orde 1 variabel terpisah, faktor pengintegrasi PDB linear orde 1, PDB eksak, PDB Orde 2 homogen koefisien konstan dengan persamaan karakteristik, metode koefisien tak tentu, dan aplikasi osilasi harmonik.",
    order: 16,
    materials: [
      {
        id: "mat-pdb-1",
        title: "Pengantar PDB: Ordo, Derajat, Kelinieran & Solusi Awal (IVP)",
        slug: "pengantar-dan-klasifikasi-pdb",
        order: 1,
        content: `### Klasifikasi Persamaan Diferensial

- **Ordo:** Tingkat turunan tertinggi yang muncul dalam persamaan.
- **Derajat:** Pangkat aljabar dari turunan tertinggi setelah persamaan dibebaskan dari bentuk pecahan atau akar.
- **Linearitas:** PDB linear jika variabel tak bebas $y$ dan semua turunannya berderajat satu dan tidak saling dikalikan.

#### Masalah Nilai Awal (Initial Value Problem / IVP):
Penyelesaian PDB yang disertai kondisi batas pada titik awal, misalnya $y(x_0) = y_0$, untuk menentukan nilai konstanta sembarang $C$.`,
      },
      {
        id: "mat-pdb-2",
        title: "PDB Orde 1: Metode Pemisahan Variabel (Separable ODE)",
        slug: "pdb-orde-1-separable-dan-linear",
        order: 2,
        content: `### Metode Pemisahan Variabel

Persamaan diferensial berbentuk:
$$\\frac{dy}{dx} = g(x) \\cdot h(y)$$
dapat dipisahkan variabelnya menjadi:
$$\\frac{1}{h(y)} \\, dy = g(x) \\, dx$$

Integrasikan kedua ruas secara independen:
$$\\int \\frac{1}{h(y)} \\, dy = \\int g(x) \\, dx + C$$

#### Contoh:
Selesaikan $\\frac{dy}{dx} = 2xy$:
$$\\frac{dy}{y} = 2x \\, dx \\implies \\ln|y| = x^2 + C_1 \\implies y = C e^{x^2}$$`,
      },
      {
        id: "mat-pdb-3",
        title: "PDB Orde 1 Linear: Metode Faktor Pengintegrasian",
        slug: "pdb-orde-1-faktor-integrasi",
        order: 3,
        content: `### PDB Linear Orde Satu

Bentuk standar:
$$\\frac{dy}{dx} + P(x)y = Q(x)$$

#### Faktor Pengintegrasi (Integrating Factor):
Tentukan fungsi pengali $I(x)$:
$$I(x) = e^{\\int P(x) \\, dx}$$

Kalikan persamaan baku dengan $I(x)$:
$$\\frac{d}{dx}[I(x)y] = I(x)Q(x)$$
Integrasikan kedua ruas untuk mendapatkan solusi umum eksplisit:
$$y(x) = \\frac{1}{I(x)} \\left( \\int I(x)Q(x) \\, dx + C \\right)$$`,
      },
      {
        id: "mat-pdb-4",
        title: "PDB Eksak & Menentukan Fungsi Potensial",
        slug: "pdb-eksak-dan-fungsi-potensial",
        order: 4,
        content: `### Uji Ke-eksakan Persamaan Diferensial

Bentuk diferensial:
$$M(x, y) \\, dx + N(x, y) \\, dy = 0$$

Persamaan dikatakan **eksak** jika dan hanya jika memenuhi kondisi simetri turunan silang:
$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$

#### Solusi Fungsi Potensial $\\psi(x, y) = C$:
1. Integrasikan $M$ terhadap $x$: $\\psi(x, y) = \\int M(x, y) \\, dx + g(y)$
2. Turunkan terhadap $y$ lalu samakan dengan $N$: $\\frac{\\partial \\psi}{\\partial y} = N(x, y) \\implies g'(y)$
3. Integrasikan $g'(y)$ untuk memperoleh fungsi potensial lengkap $\\psi(x, y) = C$.`,
      },
      {
        id: "mat-pdb-5",
        title: "PDB Linear Orde 2 Homogen Koefisien Konstan (Persamaan Karakteristik)",
        slug: "pdb-orde-2-homogen-koefisien-konstan",
        order: 5,
        content: `### Persamaan Karakteristik Orde 2

Bentuk umum PDB homogen:
$$a \\frac{d^2 y}{dx^2} + b \\frac{dy}{dx} + c y = 0, \\quad (a \\neq 0)$$

Substitusi solusi coba $y = e^{rx}$ menghasilkan persamaan kuadrat karakteristik:
$$a r^2 + b r + c = 0$$

#### Tiga Kasus Solusi Berdasarkan Diskriminan $D = b^2 - 4ac$:
1. **Dua Akar Riil Berbeda ($r_1 \\neq r_2$):**
   $$y(x) = C_1 e^{r_1 x} + C_2 e^{r_2 x}$$
2. **Akar Kembar ($r_1 = r_2 = r$):**
   $$y(x) = (C_1 + C_2 x) e^{r x}$$
3. **Akar Kompleks Konjugat ($r = \\alpha \\pm i\\beta$):**
   $$y(x) = e^{\\alpha x} \\left( C_1 \\cos(\\beta x) + C_2 \\sin(\\beta x) \\right)$$`,
      },
      {
        id: "mat-pdb-6",
        title: "PDB Linear Orde 2 Tak Homogen: Koefisien Tak Tentu & Aplikasi Gerak Harmonik",
        slug: "pdb-orde-2-tak-homogen-dan-aplikasi",
        order: 6,
        content: `### PDB Linear Tak Homogen

Bentuk umum:
$$a y'' + b y' + c y = g(x)$$
Solusi total merupakan penjumlahan solusi homogen $y_h$ dan solusi partikular $y_p$:
$$y(x) = y_h(x) + y_p(x)$$

#### Metode Koefisien Tak Tentu:
Tebakan bentuk $y_p(x)$ berdasarkan bentuk fungsi pemaksa $g(x)$:
- Jika $g(x) = P_n(x)$ polinomial $\\implies y_p = A_n x^n + \\dots + A_0$
- Jika $g(x) = e^{kx} \\implies y_p = A e^{kx}$
- Jika $g(x) = \\cos(\\omega x) \\text{ atau } \\sin(\\omega x) \\implies y_p = A \\cos(\\omega x) + B \\sin(\\omega x)$

#### Aplikasi: Osilator Harmonik Teredam
Persamaan gerak pegas bermassa $m$ dengan redaman $c$ dan konstanta pegas $k$:
$$m \\frac{d^2 x}{dt^2} + c \\frac{dx}{dt} + k x = F(t)$$`,
      },
    ],
  },
];
