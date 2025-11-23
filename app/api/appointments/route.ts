import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/appointments - Get all appointments for the current doctor
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const status = url.searchParams.get("status");

    const where: any = {
      doctorId: doctor.id,
    };

    if (date) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      where.scheduledAt = {
        gte: targetDate,
        lt: nextDate,
      };
    }

    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: {
        scheduledAt: "asc",
      },
      include: {
        client: true,
        medicalVisit: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, appointmentType, scheduledAt, notes } = body;

    // Validate required fields
    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { error: "Scheduled date/time is required" },
        { status: 400 }
      );
    }

    // Verify client belongs to doctor
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        doctorId: doctor.id,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        doctorId: doctor.id,
        appointmentType: appointmentType || "OPD",
        status: "SCHEDULED",
        scheduledAt: new Date(scheduledAt),
        notes,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
