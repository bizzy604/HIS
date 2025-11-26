import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canAccessClient, getCurrentDoctor } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/clients/[id] - Get a single client
export async function GET(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    
    if (!await canAccessClient(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            program: true
          }
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update a client
export async function PUT(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    
    if (!await canAccessClient(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, status, lastVisit } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        status,
        lastVisit: lastVisit ? new Date(lastVisit) : undefined
      }
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    
    if (!await canAccessClient(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.client.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
