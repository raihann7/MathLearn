import { NextRequest, NextResponse } from "next/server";
import { SEED_TOPICS } from "@/lib/db/seed-data";
import { TOPIC_SLUG_ALIASES } from "@/lib/db/queries";
import { PRACTICE_QUESTIONS, QuestionItem } from "@/lib/question-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, difficulty = "INTERMEDIATE" } = body;

    if (!topicId || typeof topicId !== "string" || topicId.length > 100) {
      return NextResponse.json(
        { error: "topicId wajib berupa string topik yang valid" },
        { status: 400 }
      );
    }

    const resolvedSlug = TOPIC_SLUG_ALIASES[topicId] || topicId;
    const matchedTopic = SEED_TOPICS.find(
      (t) =>
        t.id === resolvedSlug ||
        t.slug === resolvedSlug ||
        t.id === topicId ||
        t.slug === topicId
    );

    if (!matchedTopic) {
      return NextResponse.json(
        { error: "Topik matematika tidak ditemukan" },
        { status: 404 }
      );
    }

    const validDifficulty = ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(
      difficulty
    )
      ? difficulty
      : matchedTopic.difficulty;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();

    // 1. LLM Generation via OpenRouter (if API key available)
    if (openRouterApiKey) {
      try {
        const configuredModel = process.env.OPENROUTER_MODEL?.trim();
        const model = configuredModel || "deepseek/deepseek-chat";
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const systemPrompt = `Anda adalah spesialis perancang soal matematika analitis tingkat SMA/Universitas di MathLearn Academy.
Tugas Anda: Buat SATU butir soal latihan matematika baru yang belum pernah ada untuk topik "${matchedTopic.title}" (Kategori: ${matchedTopic.category}, Tingkat: ${validDifficulty}).

ATURAN FORMAT WAJIB:
1. Kembalikan HANYA format JSON murni tanpa markdown, tanpa backticks (\`\`\`json), dan tanpa teks pembuka/penutup apapun.
2. Semua rumus dan notasi matematika WAJIB menggunakan notasi KaTeX ($...$ untuk inline, $$...$$ untuk display).
3. Struktur JSON:
{
  "type": "MCQ",
  "difficulty": "${validDifficulty}",
  "content": "Teks soal dengan KaTeX...",
  "options": [
    { "id": "A", "text": "Opsi A..." },
    { "id": "B", "text": "Opsi B..." },
    { "id": "C", "text": "Opsi C..." },
    { "id": "D", "text": "Opsi D..." }
  ],
  "correctAnswer": "A",
  "hintConcept": "Konsep inti dalam 1-2 kalimat...",
  "hintFormula": "Formula KaTeX relevan...",
  "socraticPrompt": "Pertanyaan pemantik untuk memandu penalaran siswa...",
  "explanation": "Langkah penyelesaian lengkap bertahap dengan KaTeX..."
}`;

        const aiResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": appUrl,
              "X-Title": "MathLearn Dynamic Generator",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                {
                  role: "user",
                  content: `Hasilkan 1 soal latihan matematika variasi baru berbobot tinggi untuk topik ${matchedTopic.title}.`,
                },
              ],
              max_tokens: 1200,
              temperature: 0.7,
            }),
            signal: AbortSignal.timeout(25000),
          }
        );

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          let rawContent = aiData.choices?.[0]?.message?.content?.trim() || "";

          // Bersihkan jika model menyertakan wrapper markdown ```json
          rawContent = rawContent
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

          const parsed = JSON.parse(rawContent);

          if (
            parsed &&
            typeof parsed.content === "string" &&
            parsed.content.length > 5 &&
            parsed.correctAnswer
          ) {
            // ponytail: Raw JSON extraction without function-calling schema enforcement. Upgrade to structured tool_calls when complex multi-subpart questions are introduced.
            const generatedQuestion: QuestionItem = {
              id: `q-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              topicId: matchedTopic.id,
              mode: "PRACTICE",
              type: parsed.type === "NUMERICAL" ? "NUMERICAL" : "MCQ",
              difficulty: validDifficulty,
              content: parsed.content,
              options: Array.isArray(parsed.options)
                ? parsed.options.map((opt: { id?: string; text?: string }, idx: number) => ({
                    id: opt.id || String.fromCharCode(65 + idx),
                    text: opt.text || "",
                  }))
                : undefined,
              correctAnswer: String(parsed.correctAnswer).trim(),
              tolerance: parsed.type === "NUMERICAL" ? 0.01 : undefined,
              hintConcept:
                parsed.hintConcept ||
                `Pahami konsep dasar pada topik ${matchedTopic.title}.`,
              hintFormula: parsed.hintFormula || "",
              socraticPrompt:
                parsed.socraticPrompt ||
                "Bagaimana hubungan variabel yang diketahui dengan formula utama?",
              explanation:
                parsed.explanation ||
                "Periksa kembali langkah aljabar dan substitusi nilai yang diketahui.",
            };

            return NextResponse.json({
              question: generatedQuestion,
              isLiveAi: true,
              model,
            });
          }
        }
      } catch (aiErr) {
        console.warn("[Dynamic Question OpenRouter Warning]:", aiErr);
      }
    }

    // 2. Curated Reserve Fallback (Seamless experience when offline or LLM unavailable)
    const topicPool = PRACTICE_QUESTIONS.filter(
      (q) => q.topicId === matchedTopic.id
    );
    const fallbackTemplate =
      topicPool[Math.floor(Math.random() * topicPool.length)] ||
      PRACTICE_QUESTIONS[0];

    const fallbackQuestion: QuestionItem = {
      ...fallbackTemplate,
      id: `q-fallback-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode: "PRACTICE",
      content: `${fallbackTemplate.content} *(Variasi Penguatan)*`,
    };

    return NextResponse.json({
      question: fallbackQuestion,
      isLiveAi: false,
    });
  } catch (error) {
    console.error("[generate-question error]:", error);
    return NextResponse.json(
      { error: "Gagal membuat variasi soal baru" },
      { status: 500 }
    );
  }
}
