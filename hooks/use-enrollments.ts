import useSWR, { mutate } from 'swr';
import { toast } from './use-toast';
import { Client } from './use-clients';
import { Program } from './use-programs';

// Define the enrollment type
export interface Enrollment {
  id: string;
  clientId: string;
  programId: string;
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  program: Program;
}

// Configure the fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  // If the status code is not in the range 200-299,
  // throw an error with the response
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return res.json();
};

// Hook to get all enrollments (optionally filtered)
export function useEnrollments(clientId?: string, programId?: string) {
  let url = '/api/enrollments';
  const params = new URLSearchParams();
  
  if (clientId) {
    params.append('clientId', clientId);
  }
  
  if (programId) {
    params.append('programId', programId);
  }
  
  if (params.toString()) {
    url = `${url}?${params.toString()}`;
  }
  
  const { data, error, isLoading, mutate } = useSWR<Enrollment[]>(url, fetcher);
  
  return {
    enrollments: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Hook to get a specific enrollment
export function useEnrollment(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Enrollment>(
    id ? `/api/enrollments/${id}` : null,
    fetcher
  );
  
  return {
    enrollment: data,
    isLoading,
    isError: error,
    mutate
  };
}

// Function to create a new enrollment
export async function createEnrollment(enrollmentData: {
  clientId: string;
  programId: string;
  status?: string;
  startDate?: string;
  endDate?: string | null;
}) {
  try {
    const response = await fetch('/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrollmentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create enrollment');
    }
    
    const newEnrollment = await response.json();
    
    // Update related caches
    mutate('/api/enrollments');
    if (enrollmentData.clientId) {
      mutate(`/api/enrollments?clientId=${enrollmentData.clientId}`);
      mutate(`/api/clients/${enrollmentData.clientId}`);
    }
    if (enrollmentData.programId) {
      mutate(`/api/enrollments?programId=${enrollmentData.programId}`);
      mutate(`/api/programs/${enrollmentData.programId}`);
    }
    
    return newEnrollment;
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to create enrollment',
      variant: 'destructive',
    });
    throw error;
  }
}

// Function to update an existing enrollment
export async function updateEnrollment(
  id: string,
  enrollmentData: Partial<{
    status: string;
    startDate: string;
    endDate: string | null;
  }>
) {
  try {
    const response = await fetch(`/api/enrollments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrollmentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update enrollment');
    }
    
    const updatedEnrollment = await response.json();
    
    // Update related caches
    mutate('/api/enrollments');
    mutate(`/api/enrollments/${id}`);
    
    // Update client and program caches too since enrollment status might have changed
    mutate(`/api/clients/${updatedEnrollment.clientId}`);
    mutate(`/api/programs/${updatedEnrollment.programId}`);
    
    return updatedEnrollment;
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to update enrollment',
      variant: 'destructive',
    });
    throw error;
  }
}

// Function to delete an enrollment
export async function deleteEnrollment(id: string, clientId: string, programId: string) {
  try {
    const response = await fetch(`/api/enrollments/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete enrollment');
    }
    
    // Update related caches
    mutate('/api/enrollments');
    mutate(`/api/clients/${clientId}`);
    mutate(`/api/programs/${programId}`);
    
    return true;
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to delete enrollment',
      variant: 'destructive',
    });
    throw error;
  }
}
