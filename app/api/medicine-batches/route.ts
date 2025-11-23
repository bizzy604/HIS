import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/medicine-batches
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const medicineId = url.searchParams.get("medicineId");
    const expiringSoon = url.searchParams.get("expiringSoon");

    let where: any = {};
    
    if (medicineId) {
      where.medicineId = medicineId;
    }

    if (expiringSoon === "true") {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      where.expiryDate = {
        lte: threeMonthsFromNow,
        gte: new Date(),
      };
    }

    const batches = await prisma.medicineBatch.findMany({
      where,
      include: {
        medicine: true,
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}

// POST /api/medicine-batches - Add new batch
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      medicineId,
      batchNumber,
      expiryDate,
      quantity,
      purchasePrice,
      sellingPrice,
    } = body;

    if (!medicineId || !batchNumber || !expiryDate || !quantity) {
      return NextResponse.json(
        { error: "Medicine ID, batch number, expiry date, and quantity are required" },
        { status: 400 }
      );
    }

    // Create batch and update medicine stock
    const batch = await prisma.medicineBatch.create({
      data: {
        medicineId,
        batchNumber,
        expiryDate: new Date(expiryDate),
        quantity: parseInt(quantity),
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : 0,
      },
    });

    // Update medicine stock
    await prisma.medicine.update({
      where: { id: medicineId },
      data: {
        stockQuantity: {
          increment: parseInt(quantity),
        },
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}
