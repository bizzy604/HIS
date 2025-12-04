import useSWR, { mutate } from 'swr';

// Define the client type
export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  lastVisit: string | null;
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  enrollments: Enrollment[];
}

// Define the enrollment type (simplified version)
interface Enrollment {
  id: string;
  programId: string;
  program: {
    id: string;
    name: string;
  };
}

// Client creation/update type
export interface ClientData {
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  address?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  status: "active" | "inactive";
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

// Hook to get all clients
export function useClients() {
  const { data, error, isLoading, mutate } = useSWR<Client[]>('/api/clients', fetcher);
  
  return {
    clients: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Hook to get a specific client
export function useClient(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Client>(
    id ? `/api/clients/${id}` : null,
    fetcher
  );
  
  return {
    client: data,
    isLoading,
    isError: error,
    mutate
  };
}

// Function to create a new client
export async function createClient(clientData: ClientData) {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create client');
  }
  
  const newClient = await response.json();
  
  // Update the client list cache
  mutate('/api/clients');
  
  return newClient;
}

// Function to update an existing client
export async function updateClient(
  id: string,
  clientData: Partial<ClientData>
) {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update client');
  }
  
  const updatedClient = await response.json();
  
  // Update the caches
  mutate('/api/clients');
  mutate(`/api/clients/${id}`);
  
  return updatedClient;
}

// Function to delete a client
export async function deleteClient(id: string) {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete client');
  }
  
  // Update the cache
  mutate('/api/clients');
  
  return true;
}
