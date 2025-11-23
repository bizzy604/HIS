import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/vitals - Get vitals for a client
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
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

    const vitals = await prisma.vital.findMany({
      where: {
        clientId,
      },
      orderBy: {
        recordedAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json(vitals);
  } catch (error) {
    console.error("Error fetching vitals:", error);
    return NextResponse.json(
      { error: "Failed to fetch vitals" },
      { status: 500 }
    );
  }
}

// POST /api/vitals - Record new vitals
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      bloodPressure,
      heartRate,
      temperature,
      weight,
      height,
      respiratoryRate,
      oxygenSaturation,
      notes,
      recordedBy,
    } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
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

    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    }

    const vital = await prisma.vital.create({
      data: {
        clientId,
        bloodPressure,
        heartRate,
        temperature,
        weight,
        height,
        respiratoryRate,
        oxygenSaturation,
        bmi,
        notes,
        recordedBy: recordedBy || doctor.name,
      },
    });

    return NextResponse.json(vital, { status: 201 });
  } catch (error) {
    console.error("Error recording vitals:", error);
    return NextResponse.json(
      { error: "Failed to record vitals" },
      { status: 500 }
    );
  }
}
