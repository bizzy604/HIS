import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentDoctor } from "@/lib/auth";

// GET /api/analytics - Get analytics data for the current doctor
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const doctor = await getCurrentDoctor();
    if (!doctor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for date range filtering
    const url = new URL(request.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");
    
    const startDate = startDateParam ? new Date(startDateParam) : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    // Get total client count
    const totalClients = await prisma.client.count({
      where: {
        doctorId: doctor.id
      }
    });
    
    // Get active clients count
    const activeClients = await prisma.client.count({
      where: {
        doctorId: doctor.id,
        status: "active"
      }
    });
    
    // Get total program count
    const totalPrograms = await prisma.program.count({
      where: {
        doctorId: doctor.id
      }
    });
    
    // Get active programs count
    const activePrograms = await prisma.program.count({
      where: {
        doctorId: doctor.id,
        status: "active"
      }
    });
    
    // Get enrollment statistics
    const enrollments = await prisma.enrollment.findMany({
      where: {
        client: {
          doctorId: doctor.id
        },
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        program: true
      }
    });
    
    // Get monthly enrollment data for charts
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    const monthlyEnrollments = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "Enrollment"
      WHERE 
        "createdAt" >= ${sixMonthsAgo}
        AND EXISTS (
          SELECT 1 FROM "Client" 
          WHERE "Client"."id" = "Enrollment"."clientId" 
          AND "Client"."doctorId" = ${doctor.id}
        )
      GROUP BY month
      ORDER BY month ASC
    `;
    
    // Get program distribution
    const programDistribution = await prisma.program.findMany({
      where: {
        doctorId: doctor.id,
        status: "active"
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });
    
    // Get client status distribution
    const clientStatusDistribution = await prisma.client.groupBy({
      by: ["status"],
      where: {
        doctorId: doctor.id
      },
      _count: {
        _all: true
      }
    });
    
    // Get recent activity (enrollments and program creations)
    const recentActivity = await prisma.enrollment.findMany({
      where: {
        client: {
          doctorId: doctor.id
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      include: {
        client: true,
        program: true
      }
    });

    return NextResponse.json({
      counts: {
        totalClients,
        activeClients,
        totalPrograms,
        activePrograms,
        totalEnrollments: enrollments.length
      },
      enrollmentRate: totalClients > 0 ? (enrollments.length / totalClients) * 100 : 0,
      completionRate: enrollments.length > 0 
        ? (enrollments.filter((e: { status: string }) => e.status === "completed").length / enrollments.length) * 100 
        : 0,
      monthlyEnrollments,
      programDistribution: programDistribution.map((program: { name: string, _count: { enrollments: number } }) => ({
        name: program.name,
        value: program._count.enrollments
      })),
      clientStatusDistribution: clientStatusDistribution.map((status: { status: string, _count: { _all: number } }) => ({
        name: status.status,
        value: status._count._all
      })),
      recentActivity
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
