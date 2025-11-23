import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/prescriptions
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");
    const medicalVisitId = url.searchParams.get("medicalVisitId");

    let where: any = {};
    
    if (clientId) {
      where.medicalVisit = {
        clientId: clientId,
      };
    }
    
    if (medicalVisitId) {
      where.medicalVisitId = medicalVisitId;
    }

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        medicalVisit: {
          include: {
            client: {
              select: {
                id: true,
                mrn: true,
                firstName: true,
                lastName: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
              },
            },
          },
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                genericName: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}

// POST /api/prescriptions
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      medicalVisitId,
      items,
      notes,
    } = body;

    if (!medicalVisitId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Medical visit and at least one prescription item are required" },
        { status: 400 }
      );
    }

    // Create prescription with items
    const prescription = await prisma.prescription.create({
      data: {
        medicalVisitId,
        notes,
        items: {
          create: items.map((item: any) => ({
            medicineId: item.medicineId,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            quantity: item.quantity,
            instructions: item.instructions,
          })),
        },
      },
      include: {
        medicalVisit: {
          include: {
            client: true,
            doctor: true,
          },
        },
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    // Update medicine stock for each item
    for (const item of items) {
      await prisma.medicine.update({
        where: { id: item.medicineId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json(
      { error: "Failed to create prescription" },
      { status: 500 }
    );
  }
}
