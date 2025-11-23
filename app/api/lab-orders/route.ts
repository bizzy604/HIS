import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/lab-orders
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const clientId = url.searchParams.get("clientId");

    let where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (clientId) {
      where.medicalVisit = {
        clientId: clientId,
      };
    }

    const labOrders = await prisma.labOrder.findMany({
      where,
      include: {
        medicalVisit: {
          include: {
            client: {
              select: {
                id: true,
                mrn: true,
                name: true,
                dateOfBirth: true,
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
        results: true,
      },
      orderBy: {
        orderedAt: "desc",
      },
    });

    return NextResponse.json(labOrders);
  } catch (error) {
    console.error("Error fetching lab orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab orders" },
      { status: 500 }
    );
  }
}

// POST /api/lab-orders
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      medicalVisitId,
      testName,
      testCategory,
      urgency,
      clinicalNotes,
      specimenType,
    } = body;

    if (!medicalVisitId || !testName) {
      return NextResponse.json(
        { error: "Medical visit and test name are required" },
        { status: 400 }
      );
    }

    const labOrder = await prisma.labOrder.create({
      data: {
        medicalVisitId,
        testName,
        testCategory,
        priority: urgency || "ROUTINE",
        status: "ORDERED",
        notes: specimenType ? `${clinicalNotes || ""}\nSpecimen: ${specimenType}` : clinicalNotes,
      },
      include: {
        medicalVisit: {
          include: {
            client: true,
            doctor: true,
          },
        },
      },
    });

    return NextResponse.json(labOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating lab order:", error);
    return NextResponse.json(
      { error: "Failed to create lab order" },
      { status: 500 }
    );
  }
}
