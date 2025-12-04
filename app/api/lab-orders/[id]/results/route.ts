import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      parameter,
      value,
      unit,
      referenceRange,
      isAbnormal,
      notes,
      verifiedBy,
      resultsData,
      interpretation,
      performedBy,
    } = body;

    // Handle structured results data (for compatibility with different result formats)
    if (resultsData && typeof resultsData === 'string') {
      // If resultsData is a JSON string, parse it and create multiple results
      try {
        const parsedData = JSON.parse(resultsData);
        if (typeof parsedData === 'object') {
          const results = await Promise.all(
            Object.entries(parsedData).map(([param, val]) =>
              prisma.labResult.create({
                data: {
                  labOrderId: id,
                  parameter: param,
                  value: String(val),
                  unit: unit || "",
                  referenceRange: referenceRange || "",
                  isAbnormal: isAbnormal || false,
                  notes: interpretation || notes || "",
                  verifiedBy: performedBy || verifiedBy || doctor.name,
                  verifiedAt: new Date(),
                },
              })
            )
          );

          await prisma.labOrder.update({
            where: { id },
            data: { 
              status: "COMPLETED", 
              completedAt: new Date() 
            },
          });

          return NextResponse.json(
            { message: "Lab results added successfully", results },
            { status: 201 }
          );
        }
      } catch (e) {
        // If parsing fails, treat as single text result
      }
    }

    // Handle single parameter result
    if (!parameter && !value && !resultsData) {
      return NextResponse.json(
        { error: "Parameter and value, or resultsData are required" },
        { status: 400 }
      );
    }

    const labResult = await prisma.labResult.create({
      data: {
        labOrderId: id,
        parameter: parameter || "Result",
        value: value || resultsData || "",
        unit: unit || "",
        referenceRange: referenceRange || "",
        isAbnormal: isAbnormal || false,
        notes: interpretation || notes || "",
        verifiedBy: performedBy || verifiedBy || doctor.name,
        verifiedAt: new Date(),
      },
    });

    // Update lab order status to COMPLETED
    await prisma.labOrder.update({
      where: { id },
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
