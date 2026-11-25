import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateLeadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  businessName: z.string().min(1).optional(),
  status: z.enum(["New", "Contacted", "Converted"]).optional(),
});

// GET /api/leads/[id] — get a single lead
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
    if (!lead)
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

// PUT /api/leads/[id] — update a lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = UpdateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.update({
      where: { id: Number(id) },
      data: parsed.data,
    });
    return NextResponse.json(lead);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// DELETE /api/leads/[id] — delete a lead
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.lead.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}

