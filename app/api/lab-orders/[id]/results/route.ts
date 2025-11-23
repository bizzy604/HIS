import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      parameter,
      value,
      unit,
      referenceRange,
      isAbnormal,
      notes,
      verifiedBy,
    } = body;

    if (!parameter || !value) {
      return NextResponse.json(
        { error: "Parameter and value are required" },
        { status: 400 }
      );
    }

    const labResult = await prisma.labResult.create({
      data: {
        labOrderId: params.id,
        parameter,
        value,
        unit,
        referenceRange,
        isAbnormal: isAbnormal || false,
        notes,
        verifiedBy,
        verifiedAt: verifiedBy ? new Date() : null,
      },
    });

    // Update lab order status to COMPLETED
    await prisma.labOrder.update({
      where: { id: params.id },
      data: { 
        status: "COMPLETED", 
        completedAt: new Date() 
      },
    });

    return NextResponse.json(labResult, { status: 201 });
  } catch (error) {
    console.error("Error creating lab result:", error);
    return NextResponse.json(
      { error: "Failed to create lab result" },
      { status: 500 }
    );
  }
}
