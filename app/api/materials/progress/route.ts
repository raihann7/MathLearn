import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { getTopicBySlug } from "@/lib/db/queries";
import { eq, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        completedMaterialIds: [],
        progressPercent: 0,
      });
    }

    if (!topicId) {
      // Return all completed material IDs for this user
      const userCompletions = await db
        .select({ materialId: schema.materialCompletions.materialId })
        .from(schema.materialCompletions)
        .where(eq(schema.materialCompletions.userId, session.user.id));

      const ids = userCompletions.map((c) => c.materialId);
      return NextResponse.json({
        authenticated: true,
        completedMaterialIds: ids,
      });
    }

    // Resolve topic by slug or id
    const resolvedTopic = await getTopicBySlug(topicId);
    const canonicalTopicId = resolvedTopic ? resolvedTopic.id : topicId;

    const completions = await db
      .select({ materialId: schema.materialCompletions.materialId })
      .from(schema.materialCompletions)
      .where(
        and(
          eq(schema.materialCompletions.userId, session.user.id),
          eq(schema.materialCompletions.topicId, canonicalTopicId)
        )
      );

    const completedMaterialIds = completions.map((c) => c.materialId);
    const totalMaterials = resolvedTopic?.materials?.length || 0;
    const progressPercent =
      totalMaterials > 0
        ? Math.round((completedMaterialIds.length / totalMaterials) * 100)
        : 0;

    return NextResponse.json({
      authenticated: true,
      topicId: canonicalTopicId,
      completedMaterialIds,
      totalMaterials,
      progressPercent,
    });
  } catch (error) {
    console.error("Error fetching material progress:", error);
    return NextResponse.json({
      authenticated: false,
      completedMaterialIds: [],
      progressPercent: 0,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await request.json();
    const { materialId, topicId, completed = true } = body;

    if (!materialId || !topicId) {
      return NextResponse.json(
        { error: "materialId dan topicId wajib disertakan" },
        { status: 400 }
      );
    }

    // If user is guest/unauthenticated, return success so client stores locally
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        completed,
        message: "Status disimpan secara lokal (mode tamu).",
      });
    }

    // Resolve topic and material IDs
    const resolvedTopic = await getTopicBySlug(topicId);
    const canonicalTopicId = resolvedTopic ? resolvedTopic.id : topicId;

    const [foundMaterial] = await db
      .select({ id: schema.materials.id })
      .from(schema.materials)
      .where(or(eq(schema.materials.id, materialId), eq(schema.materials.slug, materialId)))
      .limit(1);
    const canonicalMaterialId = foundMaterial ? foundMaterial.id : materialId;

    const [existing] = await db
      .select()
      .from(schema.materialCompletions)
      .where(
        and(
          eq(schema.materialCompletions.userId, session.user.id),
          eq(schema.materialCompletions.materialId, canonicalMaterialId)
        )
      )
      .limit(1);

    if (completed) {
      if (!existing) {
        const newId = `mc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await db.insert(schema.materialCompletions).values({
          id: newId,
          userId: session.user.id,
          topicId: canonicalTopicId,
          materialId: canonicalMaterialId,
        });
      }
    } else {
      if (existing) {
        await db
          .delete(schema.materialCompletions)
          .where(eq(schema.materialCompletions.id, existing.id));
      }
    }

    // Fetch updated completions for this topic
    const completions = await db
      .select({ materialId: schema.materialCompletions.materialId })
      .from(schema.materialCompletions)
      .where(
        and(
          eq(schema.materialCompletions.userId, session.user.id),
          eq(schema.materialCompletions.topicId, canonicalTopicId)
        )
      );

    const completedMaterialIds = completions.map((c) => c.materialId);
    const totalMaterials = resolvedTopic?.materials?.length || 0;
    const progressPercent =
      totalMaterials > 0
        ? Math.round((completedMaterialIds.length / totalMaterials) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      authenticated: true,
      completed,
      completedMaterialIds,
      progressPercent,
      message: completed
        ? "Modul berhasil ditandai selesai! +10 XP"
        : "Status modul diperbarui menjadi belum selesai.",
    });
  } catch (error) {
    console.error("Error updating material progress:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui progres modul pada database" },
      { status: 500 }
    );
  }
}
