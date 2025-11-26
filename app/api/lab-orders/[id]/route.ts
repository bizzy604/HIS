import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/lab-orders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const labOrder = await prisma.labOrder.findUnique({
      where: { id },
      include: {
        medicalVisit: {
          include: {
            client: true,
            doctor: true,
          },
        },
        results: true,
      },
    });

    if (!labOrder) {
      return NextResponse.json(
        { error: "Lab order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(labOrder);
  } catch (error) {
    console.error("Error fetching lab order:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab order" },
      { status: 500 }
    );
  }
}

// PATCH /api/lab-orders/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, results } = body;

    const updateData: any = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }

    // If results are provided, we assume it's a status update or similar
    // The actual result creation is handled by the /results endpoint

    const labOrder = await prisma.labOrder.update({
      where: { id },
      data: updateData,
      include: {
        medicalVisit: {
          include: {
            client: true,
            doctor: true,
          },
        },
        results: true,
      },
    });

    return NextResponse.json(labOrder);
  } catch (error) {
    console.error("Error updating lab order:", error);
    return NextResponse.json(
      { error: "Failed to update lab order" },
      { status: 500 }
    );
  }
}

// DELETE /api/lab-orders/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.labOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Lab order deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab order:", error);
    return NextResponse.json(
      { error: "Failed to delete lab order" },
      { status: 500 }
    );
  }
}
