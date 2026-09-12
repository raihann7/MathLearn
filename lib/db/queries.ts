import { db } from "./index";
import * as schema from "./schema";
import { eq, and, desc, asc, or } from "drizzle-orm";
import { SEED_TOPICS, SeedTopic } from "./seed-data";

export interface TopicWithMaterials {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description: string;
  order: number;
  materialsCount?: number;
  materials?: {
    id: string;
    title: string;
    slug: string;
    order: number;
    content: string;
  }[];
}

export interface TopicFilterOptions {
  category?: string;
  difficulty?: string;
  search?: string;
  sort?: string;
}

const DIFFICULTY_ORDER: Record<string, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

function sortTopicList(topics: TopicWithMaterials[], sort?: string): TopicWithMaterials[] {
  const cloned = [...topics];
  if (sort === "level-asc") {
    return cloned.sort((a, b) => {
      const diff = (DIFFICULTY_ORDER[a.difficulty] || 1) - (DIFFICULTY_ORDER[b.difficulty] || 1);
      return diff !== 0 ? diff : a.order - b.order;
    });
  }
  if (sort === "level-desc") {
    return cloned.sort((a, b) => {
      const diff = (DIFFICULTY_ORDER[b.difficulty] || 1) - (DIFFICULTY_ORDER[a.difficulty] || 1);
      return diff !== 0 ? diff : a.order - b.order;
    });
  }
  if (sort === "name-asc") {
    return cloned.sort((a, b) => a.title.localeCompare(b.title));
  }
  return cloned.sort((a, b) => a.order - b.order);
}

/**
 * Mengambil seluruh topik dengan filter kategori, tingkat kesulitan, dan pencarian.
 * Dilengkapi fallback otomatis ke seed data jika koneksi database belum tersedia.
 */
export async function getTopics(filter?: TopicFilterOptions): Promise<TopicWithMaterials[]> {
  try {
    const isMock = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy");
    if (isMock) {
      return getFallbackTopics(filter);
    }

    const rows = await db
      .select()
      .from(schema.topics)
      .orderBy(asc(schema.topics.order));

    if (!rows || rows.length === 0) {
      return getFallbackTopics(filter);
    }

    let filtered = rows;

    if (filter?.category && filter.category !== "Semua") {
      filtered = filtered.filter((t) => t.category.toLowerCase() === filter.category?.toLowerCase());
    }

    if (filter?.difficulty && filter.difficulty !== "Semua") {
      filtered = filtered.filter(
        (t) => t.difficulty.toLowerCase() === filter.difficulty?.toLowerCase()
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Attach materials count
    const mapped = filtered.map((topic) => {
      const fallbackTopic = SEED_TOPICS.find((st) => st.id === topic.id || st.slug === topic.slug);
      return {
        ...topic,
        materialsCount: fallbackTopic?.materials.length || 0,
      };
    });

    return sortTopicList(mapped, filter?.sort);
  } catch (error) {
    console.warn("Database error in getTopics, using fallback data:", error);
    return getFallbackTopics(filter);
  }
}

function getFallbackTopics(filter?: TopicFilterOptions): TopicWithMaterials[] {
  const filtered = SEED_TOPICS.filter((t) => {
    const matchCat =
      !filter?.category ||
      filter.category === "Semua" ||
      t.category.toLowerCase() === filter.category.toLowerCase();
    const matchDiff =
      !filter?.difficulty ||
      filter.difficulty === "Semua" ||
      t.difficulty.toLowerCase() === filter.difficulty.toLowerCase();
    const q = filter?.search?.toLowerCase().trim();
    const matchSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchCat && matchDiff && matchSearch;
  }).map((t) => ({
    ...t,
    materialsCount: t.materials.length,
  }));

  return sortTopicList(filtered, filter?.sort);
}

export const TOPIC_SLUG_ALIASES: Record<string, string> = {
  // Fungsi
  fungsi: "fungsi-komposisi-dan-invers",
  "fungsi-komposisi": "fungsi-komposisi-dan-invers",
  "fungsi-dan-komposisi": "fungsi-komposisi-dan-invers",
  // Eksponen
  eksponen: "eksponen-dan-logaritma",
  logaritma: "eksponen-dan-logaritma",
  "eksponen-logaritma": "eksponen-dan-logaritma",
  // Barisan
  barisan: "barisan-dan-deret-aritmetika-geometri",
  deret: "barisan-dan-deret-aritmetika-geometri",
  "barisan-dan-deret": "barisan-dan-deret-aritmetika-geometri",
  // Trigonometri
  trigonometri: "identitas-dan-persamaan-trigonometri",
  "trigonometri-analitik": "identitas-dan-persamaan-trigonometri",
  "trigonometri-dasar-dan-identitas": "identitas-dan-persamaan-trigonometri",
  // Geometri
  geometri: "geometri-ruang-dan-dimensi-tiga",
  "dimensi-tiga": "geometri-ruang-dan-dimensi-tiga",
  "geometri-ruang": "geometri-ruang-dan-dimensi-tiga",
  // Limit
  limit: "limit-fungsi-aljabar-dan-trigonometri",
  "limit-fungsi": "limit-fungsi-aljabar-dan-trigonometri",
  // Turunan
  turunan: "turunan-dan-aplikasi",
  "kalkulus-turunan": "turunan-dan-aplikasi",
  // Integral
  integral: "integral-tak-tentu-dan-tentu",
  "integral-dasar-dan-aplikasi": "integral-tak-tentu-dan-tentu",
  "integral-kalkulus": "integral-tak-tentu-dan-tentu",
  "integral-tak-tentu": "integral-tak-tentu-dan-tentu",
  // Statistika
  statistika: "statistika-dan-teori-peluang",
  "statistika-dan-probabilitas": "statistika-dan-teori-peluang",
  "statistika-dan-peluang": "statistika-dan-teori-peluang",
  peluang: "statistika-dan-teori-peluang",
  // Teknik Integrasi Lanjut
  "integrasi-lanjut": "teknik-integrasi-lanjut-dan-tak-wajar",
  "integral-lanjut": "teknik-integrasi-lanjut-dan-tak-wajar",
  "teknik-integrasi": "teknik-integrasi-lanjut-dan-tak-wajar",
  // Volume Benda Putar
  volume: "volume-benda-putar-dan-panjang-busur",
  "volume-benda-putar": "volume-benda-putar-dan-panjang-busur",
  "panjang-busur": "volume-benda-putar-dan-panjang-busur",
  // Deret Tak Hingga
  "deret-tak-hingga": "barisan-dan-deret-tak-hingga",
  "deret-taylor": "barisan-dan-deret-tak-hingga",
  // Multivariabel
  multivariabel: "kalkulus-peubah-banyak-multivariable",
  "kalkulus-multivariabel": "kalkulus-peubah-banyak-multivariable",
  "kalkulus-peubah-banyak": "kalkulus-peubah-banyak-multivariable",
  multivariate: "kalkulus-peubah-banyak-multivariable",
  // Matriks & SPL
  matriks: "matriks-dan-sistem-persamaan-linear",
  "matriks-dan-vektor-linear": "matriks-dan-sistem-persamaan-linear",
  "matriks-dan-sistem-linear": "matriks-dan-sistem-persamaan-linear",
  spl: "matriks-dan-sistem-persamaan-linear",
  // Ruang Vektor
  "ruang-vektor": "ruang-vektor-dan-transformasi-linear",
  vektor: "ruang-vektor-dan-transformasi-linear",
  "transformasi-linear": "ruang-vektor-dan-transformasi-linear",
  // PDB
  pdb: "persamaan-diferensial-biasa",
  ode: "persamaan-diferensial-biasa",
  "persamaan-diferensial": "persamaan-diferensial-biasa",
};

export const MATERIAL_SLUG_ALIASES: Record<string, string> = {
  "konsep-dasar-turunan": "konsep-limit-dan-definisi-turunan",
  "antiturunan-dan-teorema-dasar": "antiturunan-dan-teorema-fundamental",
};

/**
 * Mengambil data topik lengkap beserta daftar modul materi berdasarkan slug atau ID.
 */
export async function getTopicBySlug(slug: string): Promise<TopicWithMaterials | null> {
  const resolvedSlug = TOPIC_SLUG_ALIASES[slug] || slug;

  try {
    const isMock = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dummy");
    if (isMock) {
      const found = SEED_TOPICS.find(
        (t) =>
          t.slug === resolvedSlug ||
          t.id === resolvedSlug ||
          t.slug === slug ||
          t.id === slug
      );
      return found || null;
    }

    const [topic] = await db
      .select()
      .from(schema.topics)
      .where(
        or(
          eq(schema.topics.slug, resolvedSlug),
          eq(schema.topics.id, resolvedSlug),
          eq(schema.topics.slug, slug),
          eq(schema.topics.id, slug)
        )
      )
      .limit(1);

    if (!topic) {
      const fallback = SEED_TOPICS.find(
        (t) =>
          t.slug === resolvedSlug ||
          t.id === resolvedSlug ||
          t.slug === slug ||
          t.id === slug
      );
      return fallback || null;
    }

    const topicMaterials = await db
      .select()
      .from(schema.materials)
      .where(eq(schema.materials.topicId, topic.id))
      .orderBy(asc(schema.materials.order));

    return {
      ...topic,
      materials:
        topicMaterials.length > 0
          ? topicMaterials
          : SEED_TOPICS.find((t) => t.id === topic.id)?.materials || [],
      materialsCount:
        topicMaterials.length > 0
          ? topicMaterials.length
          : SEED_TOPICS.find((t) => t.id === topic.id)?.materials.length || 0,
    };
  } catch (error) {
    console.warn("Database error in getTopicBySlug, using fallback data:", error);
    const fallback = SEED_TOPICS.find(
      (t) =>
        t.slug === resolvedSlug ||
        t.id === resolvedSlug ||
        t.slug === slug ||
        t.id === slug
    );
    return fallback || null;
  }
}

/**
 * Mengambil satu modul materi spesifik.
 */
export async function getMaterialBySlug(
  topicSlug: string,
  materialSlug: string
) {
  const resolvedTopicSlug = TOPIC_SLUG_ALIASES[topicSlug] || topicSlug;
  const resolvedMatSlug = MATERIAL_SLUG_ALIASES[materialSlug] || materialSlug;

  const topic = await getTopicBySlug(resolvedTopicSlug);
  if (!topic || !topic.materials) return null;

  const currentMaterial = topic.materials.find(
    (m) =>
      m.slug === resolvedMatSlug ||
      m.id === resolvedMatSlug ||
      m.slug === materialSlug ||
      m.id === materialSlug
  );
  if (!currentMaterial) return null;

  const currentIndex = topic.materials.findIndex((m) => m.id === currentMaterial.id);
  const prevMaterial = currentIndex > 0 ? topic.materials[currentIndex - 1] : null;
  const nextMaterial =
    currentIndex < topic.materials.length - 1 ? topic.materials[currentIndex + 1] : null;

  return {
    topic,
    material: currentMaterial,
    prevMaterial,
    nextMaterial,
  };
}
