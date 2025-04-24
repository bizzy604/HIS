import { getAuth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/app-router";
import { prisma } from "./db";

export async function getCurrentDoctor() {
  const { userId } = getAuth();
  
  if (!userId) {
    return null;
  }
  
  const user = await currentUser();
  if (!user) {
    return null;
  }
  
  // Find or create doctor record for the authenticated user
  let doctor = await prisma.doctor.findUnique({
    where: {
      clerkId: userId
    }
  });
  
  if (!doctor) {
    // Create new doctor record if not exists
    doctor = await prisma.doctor.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.emailAddresses[0]?.emailAddress || ''
      }
    });
  }
  
  return doctor;
}

// Helper to check if the current user can access a specific client
export async function canAccessClient(clientId: string) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return false;
  
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      doctorId: doctor.id
    }
  });
  
  return !!client;
}

// Helper to check if the current user can access a specific program
export async function canAccessProgram(programId: string) {
  const doctor = await getCurrentDoctor();
  if (!doctor) return false;
  
  const program = await prisma.program.findFirst({
    where: {
      id: programId,
      doctorId: doctor.id
    }
  });
  
  return !!program;
}

// Get clients for the current doctor (implements Row-Level Security)
export async function getCurrentDoctorClients() {
  const doctor = await getCurrentDoctor();
  if (!doctor) return [];
  
  return prisma.client.findMany({
    where: {
      doctorId: doctor.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

// Get programs for the current doctor (implements Row-Level Security)
export async function getCurrentDoctorPrograms() {
  const doctor = await getCurrentDoctor();
  if (!doctor) return [];
  
  return prisma.program.findMany({
    where: {
      doctorId: doctor.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
