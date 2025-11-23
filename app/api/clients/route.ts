import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";
import { generateMRN } from "@/lib/generators";

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients for the current doctor
 *     description: Retrieves all clients associated with the authenticated doctor.
 *     tags:
 *       - Clients
 *     responses:
 *       200:
 *         description: A list of client records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     nullable: true
 *                   phone:
 *                     type: string
 *                     nullable: true
 *                   status:
 *                     type: string
 *                     enum: [active, inactive]
 *                   doctorId:
 *                     type: string
 *                   lastVisit:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Server error
 */
// GET /api/clients - Get all clients for the current doctor
export async function GET(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        enrollments: {
          include: {
            program: true,
          },
        },
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     description: Creates a new client associated with the authenticated doctor.
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Client's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Client's email address
 *               phone:
 *                 type: string
 *                 description: Client's phone number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Client's status
 *     responses:
 *       201:
 *         description: Client successfully created
 *       400:
 *         description: Bad request - Invalid data
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Server error
 */
// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, status, dateOfBirth, gender, bloodGroup, allergies, address, emergencyContact, insuranceProvider, policyNumber } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Generate unique MRN
    const mrn = await generateMRN();

    const client = await prisma.client.create({
      data: {
        mrn,
        name,
        email,
        phone,
        status: status || "active",
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        bloodGroup,
        allergies: allergies || [],
        address,
        emergencyContact,
        insuranceProvider,
        policyNumber,
        doctorId: doctor.id,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
