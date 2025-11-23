import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/medical-visits/[id] - Get a specific medical visit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visit = await prisma.medicalVisit.findFirst({
      where: {
        id: params.id,
        doctorId: doctor.id,
      },
      include: {
        client: true,
        appointment: true,
        prescriptions: {
          include: {
            items: {
              include: {
                medicine: true,
              },
            },
          },
        },
        labOrders: {
          include: {
            results: true,
          },
        },
      },
    });

    if (!visit) {
      return NextResponse.json(
        { error: "Medical visit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error fetching medical visit:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical visit" },
      { status: 500 }
    );
  }
}

// PATCH /api/medical-visits/[id] - Update a medical visit
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chiefComplaint, examination, diagnosis, treatmentPlan, notes } = body;

    const existingVisit = await prisma.medicalVisit.findFirst({
      where: {
        id: params.id,
        doctorId: doctor.id,
      },
    });

    if (!existingVisit) {
      return NextResponse.json(
        { error: "Medical visit not found" },
        { status: 404 }
      );
    }

    const visit = await prisma.medicalVisit.update({
      where: { id: params.id },
      data: {
        chiefComplaint,
        examination,
        diagnosis,
        treatmentPlan,
        notes,
      },
      include: {
        client: true,
        appointment: true,
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error updating medical visit:", error);
    return NextResponse.json(
      { error: "Failed to update medical visit" },
      { status: 500 }
    );
  }
}
