import { NextRequest, NextResponse } from "next/server";
import { getQuestionById } from "@/lib/db/question-queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, tier = 3 } = body;

    if (!questionId || typeof questionId !== "string" || questionId.length > 100) {
      return NextResponse.json(
        { error: "questionId wajib berupa ID string yang valid" },
        { status: 400 }
      );
    }

    const tierNum = Number(tier);
    if (![1, 2, 3].includes(tierNum)) {
      return NextResponse.json(
        { error: "tier harus bernilai 1, 2, atau 3" },
        { status: 400 }
      );
    }

    const question = await getQuestionById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: "Soal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Tier 1: Concept
    if (tierNum === 1) {
      return NextResponse.json({
        tier: 1,
        title: "Petunjuk 1: Konsep Kunci",
        content: question.hintConcept,
      });
    }

    // Tier 2: Formula
    if (tierNum === 2) {
      return NextResponse.json({
        tier: 2,
        title: "Petunjuk 2: Formula Matematika Relevan",
        content: question.hintFormula,
      });
    }

    // Tier 3: Socratic Guidance (Live OpenRouter AI with curated fallback)
    const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (openRouterApiKey) {
      try {
        const configuredModel = process.env.OPENROUTER_MODEL?.trim();
        // Default to fast, reliable model if empty or auto
        const model = configuredModel || "deepseek/deepseek-chat";
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const aiResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": appUrl,
              "X-Title": "MathLearn Academy",
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "Anda adalah Tutor Matematika Socratik di MathLearn Academy. ATURAN KRUSIAL: JANGAN PERNAH membocorkan jawaban akhir, angka final, atau opsi pilihan ganda yang benar! Tugas Anda adalah memandu proses bernalar siswa dengan pertanyaan pemantik bertahap, memberikan petunjuk langkah demi langkah, dan membimbing siswa agar dapat menemukan jawaban sendiri pada kanvas coretan (scratchpad). Gunakan notasi LaTeX ($...$ atau $$...$$) untuk setiap ekspresi matematika. Tulis dalam Bahasa Indonesia yang ramah, akademis, dan terstruktur (maksimal 3 paragraf pendek).",
                },
                {
                  role: "user",
                  content: `Soal Matematika:\n${question.content}\n\nKonsep Dasar:\n${question.hintConcept}\n\nFormula Kunci:\n${question.hintFormula}\n\nPola Penalaran Awal:\n${question.socraticPrompt}\n\nBerikan bimbingan Socratik langkah demi langkah agar siswa dapat menalar solusinya sendiri pada kanvas coretan (scratchpad).`,
                },
              ],
              max_tokens: 800,
              temperature: 0.3,
            }),
            signal: AbortSignal.timeout(25000),
          }
        );

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const generatedHint = aiData.choices?.[0]?.message?.content?.trim();

          if (generatedHint) {
            return NextResponse.json({
              tier: 3,
              title: "Petunjuk 3: Panduan Socratic AI (Live OpenRouter)",
              content: `${generatedHint}\n\n*Tips: Uraikan pembuktian langkah di atas pada kanvas Scratchpad.*`,
              isLiveAi: true,
              model,
            });
          }
        } else {
          const errBody = await aiResponse.text();
          console.warn(`[OpenRouter API Error ${aiResponse.status}]:`, errBody);
        }
      } catch (aiErr) {
        console.warn("[OpenRouter Fetch Warning]:", aiErr);
        // Graceful fallback to verified curated prompt on API timeout or error
      }
    }

    // Curated high-yield fallback
    const socraticGuidance = `🧠 **Bimbingan Berpikir Socratic:**\n\n${question.socraticPrompt}\n\n*Tips: Cobalah uraikan langkah di atas pada kanvas Scratchpad sebelum memilih jawaban final.*`;

    return NextResponse.json({
      tier: 3,
      title: "Petunjuk 3: Panduan Socratic AI",
      content: socraticGuidance,
      isLiveAi: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses petunjuk" },
      { status: 500 }
    );
  }
}
