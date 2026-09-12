import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ bookmarked: false, count: 0 });
    }

    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");

    if (!materialId) {
      // Return all bookmarks for user
      const userBookmarks = await db
        .select()
        .from(schema.bookmarks)
        .where(eq(schema.bookmarks.userId, session.user.id));

      return NextResponse.json({ bookmarks: userBookmarks });
    }

    // Check specific bookmark with slug or id resolution
    const [foundMaterial] = await db
      .select({ id: schema.materials.id })
      .from(schema.materials)
      .where(or(eq(schema.materials.id, materialId), eq(schema.materials.slug, materialId)))
      .limit(1);
    const targetMaterialId = foundMaterial ? foundMaterial.id : materialId;

    const [existing] = await db
      .select()
      .from(schema.bookmarks)
      .where(
        and(
          eq(schema.bookmarks.userId, session.user.id),
          eq(schema.bookmarks.materialId, targetMaterialId)
        )
      )
      .limit(1);

    return NextResponse.json({ bookmarked: !!existing });
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    return NextResponse.json({ bookmarked: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Silakan masuk untuk menyimpan bookmark materi." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { materialId } = body;

    if (!materialId) {
      return NextResponse.json(
        { error: "materialId wajib disertakan" },
        { status: 400 }
      );
    }

    // Resolve materialId to canonical database id if slug was passed
    const [foundMaterial] = await db
      .select({ id: schema.materials.id })
      .from(schema.materials)
      .where(or(eq(schema.materials.id, materialId), eq(schema.materials.slug, materialId)))
      .limit(1);
    const targetMaterialId = foundMaterial ? foundMaterial.id : materialId;

    // Check if already bookmarked
    const [existing] = await db
      .select()
      .from(schema.bookmarks)
      .where(
        and(
          eq(schema.bookmarks.userId, session.user.id),
          eq(schema.bookmarks.materialId, targetMaterialId)
        )
      )
      .limit(1);

    if (existing) {
      // Remove bookmark
      await db
        .delete(schema.bookmarks)
        .where(eq(schema.bookmarks.id, existing.id));

      return NextResponse.json({
        bookmarked: false,
        message: "Bookmark berhasil dihapus",
      });
    } else {
      // Add bookmark
      const newId = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(schema.bookmarks).values({
        id: newId,
        userId: session.user.id,
        materialId: targetMaterialId,
      });

      return NextResponse.json({
        bookmarked: true,
        message: "Materi berhasil ditambahkan ke bookmark",
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Gagal memproses bookmark pada database" },
      { status: 500 }
    );
  }
}
