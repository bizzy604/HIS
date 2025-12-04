import { prisma } from "./db";

/**
 * Generate a unique Medical Record Number (MRN)
 * Format: MRN-YYYYMMDD-XXXX (e.g., MRN-20251123-0001)
 */
export async function generateMRN(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  // Get the count of clients created today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const todayCount = await prisma.client.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  
  // Generate sequential number (padded to 4 digits)
  const sequence = (todayCount + 1).toString().padStart(4, '0');
  
  return `MRN-${dateStr}-${sequence}`;
}

/**
 * Generate a unique Bill Number
 * Format: BILL-YYYYMMDD-XXXX
 */
export async function generateBillNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const todayCount = await prisma.billing.count({
    where: {
      billedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  
  const sequence = (todayCount + 1).toString().padStart(4, '0');
  
  return `BILL-${dateStr}-${sequence}`;
}
