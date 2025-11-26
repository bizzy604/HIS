import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";
import { generateBillNumber } from "@/lib/generators";

// GET /api/billing
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
      where.clientId = clientId;
    }

    const bills = await prisma.billing.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            mrn: true,
            name: true,
            dateOfBirth: true,
          },
        },
        items: true,
      },
      orderBy: {
        billedAt: "desc",
      },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

// POST /api/billing
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      items,
      discount = 0,
      notes,
    } = body;

    if (!clientId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Client and at least one billing item are required" },
        { status: 400 }
      );
    }

    const billNumber = await generateBillNumber();

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.unitPrice * item.quantity,
      0
    );
    const discountAmount = discount ? (subtotal * discount) / 100 : 0;
    const taxAmount = (subtotal - discountAmount) * 0.15; // 15% tax
    const totalAmount = subtotal - discountAmount + taxAmount;

    const billing = await prisma.billing.create({
      data: {
        billNumber,
        clientId,
        totalAmount,
        status: "PENDING",
        notes,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            itemType: item.itemType || "CONSULTATION",
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(billing, { status: 201 });
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
