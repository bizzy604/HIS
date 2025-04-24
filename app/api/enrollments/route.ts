import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canAccessClient, canAccessProgram, getCurrentDoctor } from "@/lib/auth";

// GET /api/enrollments - Get all enrollments (optionally filtered by client or program)
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");
    const programId = url.searchParams.get("programId");
    
    // Build the query
    const query: any = {
      where: {},
      include: {
        client: true,
        program: true,
      },
    };
    
    // Check for client filter
    if (clientId) {
      // Verify access permission
      if (!await canAccessClient(clientId)) {
        return NextResponse.json({ error: "Unauthorized access to client" }, { status: 401 });
      }
      
      query.where.clientId = clientId;
    } else {
      // If no client filter, only show enrollments for clients belonging to the doctor
      query.where.client = {
        doctorId: doctor.id
      };
    }
    
    // Check for program filter
    if (programId) {
      // Verify access permission
      if (!await canAccessProgram(programId)) {
        return NextResponse.json({ error: "Unauthorized access to program" }, { status: 401 });
      }
      
      query.where.programId = programId;
    } else {
      // If no program filter, only show enrollments for programs belonging to the doctor
      query.where.program = {
        doctorId: doctor.id
      };
    }

    const enrollments = await prisma.enrollment.findMany(query);

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Create a new enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, programId, status, startDate, endDate } = body;

    // Validate required fields
    if (!clientId || !programId) {
      return NextResponse.json(
        { error: "Client ID and Program ID are required" },
        { status: 400 }
      );
    }

    // Check if the user has access to both the client and program
    const canAccessClientResult = await canAccessClient(clientId);
    const canAccessProgramResult = await canAccessProgram(programId);

    if (!canAccessClientResult || !canAccessProgramResult) {
      return NextResponse.json(
        { error: "Unauthorized access to client or program" },
        { status: 401 }
      );
    }

    // Check if the enrollment already exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        clientId_programId: {
          clientId,
          programId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Client is already enrolled in this program" },
        { status: 400 }
      );
    }

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        clientId,
        programId,
        status: status || "active",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        client: true,
        program: true,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}
