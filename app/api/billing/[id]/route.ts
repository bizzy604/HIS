import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/billing/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const billing = await prisma.billing.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        medicalVisit: {
          include: {
            doctor: true,
          },
        },
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!billing) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(billing);
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}

// PATCH /api/billing/[id]
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
    const { status, paymentMethod, paidAmount } = body;

    const updateData: any = {};
    
    if (status !== undefined) {
      updateData.status = status;
    }
    
    if (paymentMethod !== undefined) {
      updateData.paymentMethod = paymentMethod;
    }
    
    if (paidAmount !== undefined) {
      updateData.paidAmount = parseFloat(paidAmount);
      updateData.paidAt = new Date();
    }

    const billing = await prisma.billing.update({
      where: { id: params.id },
      data: updateData,
      include: {
        client: true,
        medicalVisit: {
          include: {
            doctor: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(billing);
  } catch (error) {
    console.error("Error updating bill:", error);
    return NextResponse.json(
      { error: "Failed to update bill" },
      { status: 500 }
    );
  }
}

// DELETE /api/billing/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.billing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json(
      { error: "Failed to delete bill" },
      { status: 500 }
    );
  }
}
