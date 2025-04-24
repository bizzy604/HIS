import useSWR, { mutate } from 'swr';
import { toast } from './use-toast';

// Define the program type
export interface Program {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  enrollments: Enrollment[];
}

// Define the enrollment type (simplified version)
interface Enrollment {
  id: string;
  clientId: string;
  client: {
    id: string;
    name: string;
  };
}

// Program creation/update type
export interface ProgramData {
  name: string;
  description: string;
  status: "active" | "inactive";
  startDate: string;
  endDate: string | null;
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

// Hook to get all programs
export function usePrograms() {
  const { data, error, isLoading, mutate } = useSWR<Program[]>('/api/programs', fetcher);
  
  return {
    programs: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Hook to get a specific program
export function useProgram(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Program>(
    id ? `/api/programs/${id}` : null,
    fetcher
  );
  
  return {
    program: data,
    isLoading,
    isError: error,
    mutate
  };
}

// Function to create a new program
export async function createProgram(programData: ProgramData) {
  try {
    const response = await fetch('/api/programs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create program');
    }
    
    const newProgram = await response.json();
    
    // Update the program list cache
    mutate('/api/programs');
    
    return newProgram;
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to create program',
      variant: 'destructive',
    });
    throw error;
  }
}

// Function to update an existing program
export async function updateProgram(
  id: string,
  programData: Partial<ProgramData>
) {
  try {
    const response = await fetch(`/api/programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update program');
    }
    
    const updatedProgram = await response.json();
    
    // Update the caches
    mutate('/api/programs');
    mutate(`/api/programs/${id}`);
    
    return updatedProgram;
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to update program',
      variant: 'destructive',
    });
    throw error;
  }
}

// Function to delete a program
export async function deleteProgram(id: string) {
  try {
    const response = await fetch(`/api/programs/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete program');
    }
    
    // Update the cache
    mutate('/api/programs');
    
    return true;
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to delete program',
      variant: 'destructive',
    });
    throw error;
  }
}
