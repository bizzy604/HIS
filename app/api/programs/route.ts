import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/programs - Get all programs for the current doctor
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const programs = await prisma.program.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        enrollments: {
          include: {
            client: true,
          },
        },
      },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

// POST /api/programs - Create a new program
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, status, startDate, endDate } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        name,
        description,
        status: status || "active",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        doctorId: doctor.id,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
