import { getMaterialBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import { ClassroomReaderView } from "@/components/classroom/classroom-reader-view";

interface MaterialViewerPageProps {
  params: Promise<{
    topicId: string;
    materialId: string;
  }>;
}

export default async function MaterialViewerPage({ params }: MaterialViewerPageProps) {
  const { topicId, materialId } = await params;
  const data = await getMaterialBySlug(topicId, materialId);

  if (!data) {
    notFound();
  }

  const { topic, material, prevMaterial, nextMaterial } = data;
  const allMaterials = topic.materials || [];

  return (
    <ClassroomReaderView
      topic={topic}
      material={material}
      prevMaterial={prevMaterial}
      nextMaterial={nextMaterial}
      allMaterials={allMaterials}
    />
  );
}
