import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canAccessProgram, getCurrentDoctor } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/programs/[id] - Get a specific program
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!await canAccessProgram(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            client: true
          }
        }
      }
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

// PUT /api/programs/[id] - Update a program
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!await canAccessProgram(id)) {
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

    const program = await prisma.program.update({
      where: { id },
      data: {
        name,
        description,
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 }
    );
  }
}

// DELETE /api/programs/[id] - Delete a program
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!await canAccessProgram(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.program.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
