import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canAccessClient, canAccessProgram, getCurrentDoctor } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

// Helper to check if the current doctor can access an enrollment
async function canAccessEnrollment(enrollmentId: string) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return false;
  
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      client: true,
      program: true
    }
  });
  
  if (!enrollment) return false;
  
  // Check if the doctor owns either the client or the program
  return enrollment.client.doctorId === doctor.id || 
         enrollment.program.doctorId === doctor.id;
}

// GET /api/enrollments/[id] - Get a specific enrollment
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!await canAccessEnrollment(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        client: true,
        program: true
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollment" },
      { status: 500 }
    );
  }
}

// PUT /api/enrollments/[id] - Update an enrollment
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!await canAccessEnrollment(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, startDate, endDate } = body;

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null
      },
      include: {
        client: true,
        program: true
      }
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}

// DELETE /api/enrollments/[id] - Delete an enrollment
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!await canAccessEnrollment(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.enrollment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return NextResponse.json(
      { error: "Failed to delete enrollment" },
      { status: 500 }
    );
  }
}
