import { getTopicBySlug } from "@/lib/db/queries";
import { getQuestionsByTopic } from "@/lib/db/question-queries";
import { notFound } from "next/navigation";
import { PracticeQuiz } from "@/components/practice/practice-quiz";

interface PracticePageProps {
  params: Promise<{ topicId: string }>;
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { topicId } = await params;
  const topic = await getTopicBySlug(topicId);

  if (!topic) {
    notFound();
  }

  const questions = await getQuestionsByTopic(topic.id, {
    shuffle: true,
    mode: "PRACTICE",
  });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100">
      <PracticeQuiz topic={topic} questions={questions} />
    </div>
  );
}
