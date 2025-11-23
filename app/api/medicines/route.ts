import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/medicines - Get all medicines
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const lowStock = url.searchParams.get("lowStock");

    let where = {};
    if (lowStock === "true") {
      where = {
        stockQuantity: {
          lte: prisma.medicine.fields.reorderLevel,
        },
      };
    }

    const medicines = await prisma.medicine.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      include: {
        batches: {
          orderBy: {
            expiryDate: "asc",
          },
        },
        _count: {
          select: {
            prescriptionItems: true,
          },
        },
      },
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return NextResponse.json(
      { error: "Failed to fetch medicines" },
      { status: 500 }
    );
  }
}

// POST /api/medicines - Create a new medicine
export async function POST(request: NextRequest) {
  try {
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

    if (!name || !unitPrice) {
      return NextResponse.json(
        { error: "Name and unit price are required" },
        { status: 400 }
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        name,
        genericName,
        category,
        manufacturer,
        unitPrice: parseFloat(unitPrice),
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
        reorderLevel: reorderLevel ? parseInt(reorderLevel) : 10,
        unit: unit || "tablet",
        description,
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error("Error creating medicine:", error);
    return NextResponse.json(
      { error: "Failed to create medicine" },
      { status: 500 }
    );
  }
}
