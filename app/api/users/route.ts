import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, image, role } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    if (!image || typeof image !== "string" || !image.startsWith("/")) {
      return NextResponse.json(
        { error: 'image must start with "/" (from /public)' },
        { status: 400 }
      );
    }

    const created = await prisma.user.create({
      data: { name, image, role: role === "ADMIN" ? "ADMIN" : "PLAYER" },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "server error" },
      { status: 500 }
    );
  }
}
