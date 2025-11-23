import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/medical-visits - Get medical visits
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");
    const appointmentId = url.searchParams.get("appointmentId");

    const where: any = {
      doctorId: doctor.id,
    };

    if (clientId) {
      where.clientId = clientId;
    }

    if (appointmentId) {
      where.appointmentId = appointmentId;
    }

    const visits = await prisma.medicalVisit.findMany({
      where,
      orderBy: {
        createdAt: "desc",
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

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching medical visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical visits" },
      { status: 500 }
    );
  }
}

// POST /api/medical-visits - Create a new medical visit
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      appointmentId,
      clientId,
      chiefComplaint,
      examination,
      diagnosis,
      treatmentPlan,
      notes,
    } = body;

    if (!appointmentId || !clientId) {
      return NextResponse.json(
        { error: "Appointment ID and Client ID are required" },
        { status: 400 }
      );
    }

    // Verify appointment belongs to doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const visit = await prisma.medicalVisit.create({
      data: {
        appointmentId,
        clientId,
        doctorId: doctor.id,
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

    // Update appointment status to completed
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { 
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error("Error creating medical visit:", error);
    return NextResponse.json(
      { error: "Failed to create medical visit" },
      { status: 500 }
    );
  }
}
