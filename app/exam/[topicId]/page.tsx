import { getTopicBySlug } from "@/lib/db/queries";
import { getQuestionsByTopic } from "@/lib/db/question-queries";
import { notFound } from "next/navigation";
import { ExamSession } from "@/components/exam/exam-session";

interface ExamPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { topicId } = await params;
  const topic = await getTopicBySlug(topicId);

  if (!topic) {
    notFound();
  }

  const questions = await getQuestionsByTopic(topic.id, {
    shuffle: true,
    mode: "EXAM",
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-300 font-medium text-sm">
            Belum ada butir soal ujian yang tersedia untuk topik ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100">
      <ExamSession topic={topic} questions={questions} />
    </div>
  );
}
