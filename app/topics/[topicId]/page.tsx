import { getTopicBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import { TopicSyllabusView } from "@/components/classroom/topic-syllabus-view";

interface TopicDetailPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { topicId } = await params;
  const topic = await getTopicBySlug(topicId);

  if (!topic) {
    notFound();
  }

  const materials = topic.materials || [];

  return (
    <TopicSyllabusView
      topic={{
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        category: topic.category,
        difficulty: topic.difficulty,
        description: topic.description,
      }}
      materials={materials}
    />
  );
}
