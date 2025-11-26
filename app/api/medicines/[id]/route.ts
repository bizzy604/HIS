import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/medicines/[id]
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

    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        batches: {
          orderBy: {
            expiryDate: "asc",
          },
        },
        prescriptionItems: {
          include: {
            prescription: {
              include: {
                medicalVisit: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
          take: 10,
          orderBy: {
            prescription: {
              createdAt: "desc",
            },
          },
        },
      },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: "Medicine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return NextResponse.json(
      { error: "Failed to fetch medicine" },
      { status: 500 }
    );
  }
}

// PATCH /api/medicines/[id]
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
    const {
      name,
      genericName,
      category,
      manufacturer,
      unitPrice,
      stockQuantity,
      reorderLevel,
      unit,
      description,
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (genericName !== undefined) updateData.genericName = genericName;
    if (category !== undefined) updateData.category = category;
    if (manufacturer !== undefined) updateData.manufacturer = manufacturer;
    if (unitPrice !== undefined) updateData.unitPrice = parseFloat(unitPrice);
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (reorderLevel !== undefined) updateData.reorderLevel = parseInt(reorderLevel);
    if (unit !== undefined) updateData.unit = unit;
    if (description !== undefined) updateData.description = description;

    const medicine = await prisma.medicine.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Error updating medicine:", error);
    return NextResponse.json(
      { error: "Failed to update medicine" },
      { status: 500 }
    );
  }
}

// DELETE /api/medicines/[id]
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

    await prisma.medicine.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return NextResponse.json(
      { error: "Failed to delete medicine" },
      { status: 500 }
    );
  }
}
