import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  businessName: z.string().min(1, "Business name is required"),
  status: z.enum(["New", "Contacted", "Converted"]).default("New"),
});

// GET /api/leads — list all leads with optional search & filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const leads = await prisma.lead.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { email: { contains: search } },
                ],
              }
            : {},
          status ? { status } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST /api/leads — create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({ data: parsed.data });
    return NextResponse.json(lead, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A lead with this email already exists" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

