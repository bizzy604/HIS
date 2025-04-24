import { prisma } from "./db";
import { currentUser } from "@clerk/nextjs/server";

// Function to get the current user for API routes and tests
export async function getCurrentUser() {
  try {
    // For API routes, get the authenticated user
    const user = await currentUser();
    
    if (!user) {
      return null;
    }
    
    // Find or create doctor record for the authenticated user
    const doctor = await prisma.doctor.findUnique({
      where: {
        clerkId: user.id
      }
    });
    
    return doctor ? { id: doctor.id } : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Use this for API routes and middleware
export async function getCurrentDoctor() {
  try {
    // For API routes, get the authenticated user
    const user = await currentUser();
    
    if (!user) {
      return null;
    }
    
    // Try to get user profile info
    let userEmail = user.emailAddresses[0]?.emailAddress || "unknown@example.com";
    let userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "New Doctor";
    
    // Find or create doctor record for the authenticated user
    let doctor = await prisma.doctor.findUnique({
      where: {
        clerkId: user.id
      }
    });
    
    if (!doctor) {
      // Create new doctor record if not exists
      doctor = await prisma.doctor.create({
        data: {
          clerkId: user.id,
          name: userName,
          email: userEmail
        }
      });
    }
    
    return doctor;
  } catch (error) {
    console.error("Error getting current doctor:", error);
    return null;
  }
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
