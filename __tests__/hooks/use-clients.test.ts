/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useClients, createClient, updateClient, Client } from '@/hooks/use-clients';
import * as SWR from 'swr';
import { toast } from '@/hooks/use-toast';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('useClients Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch clients correctly', async () => {
    // Mock clients data
    const mockClients = [
      {
        id: 'client_1',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        doctorId: 'doctor_123',
        enrollments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastVisit: null,
        phone: '123-456-7890',
      },
      {
        id: 'client_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'inactive',
        doctorId: 'doctor_123',
        enrollments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastVisit: null,
        phone: '987-654-3210',
      },
    ] as Client[];

    // Mock SWR to return clients data
    (SWR.default as jest.Mock).mockReturnValue({
      data: mockClients,
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Check the returned data
    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(null);
    
    // Check that SWR was called with the correct key
    expect(SWR.default).toHaveBeenCalledWith('/api/clients', expect.any(Function));
  });

  it('should handle loading state', async () => {
    // Mock SWR to return loading state
    (SWR.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      isValidating: true,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Check the returned state
    expect(result.current.clients).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(null);
  });

  it('should handle error state', async () => {
    const testError = new Error('Failed to fetch clients');
    
    // Mock SWR to return error
    (SWR.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: testError,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Check the returned state
    expect(result.current.clients).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toEqual(testError);
  });
});

describe('Client API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a client correctly', async () => {
    // Mock SWR mutate
    const mockMutate = jest.fn();
    (SWR.mutate as jest.Mock).mockImplementation(mockMutate);

    // Mock fetch response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'new_client_123',
        name: 'New Client',
        email: 'new@example.com',
        status: 'active',
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call createClient function directly
    const newClient = {
      name: 'New Client',
      email: 'new@example.com',
      phone: '',
      status: 'active' as const,
    };
    
    const response = await createClient(newClient);

    // Check that fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    });

    // Check that mutate was called to update the cache
    expect(SWR.mutate).toHaveBeenCalledWith('/api/clients');

    // Check the returned data
    expect(response).toEqual({
      id: 'new_client_123',
      name: 'New Client',
      email: 'new@example.com',
      status: 'active',
    });
  });

  it('should update a client correctly', async () => {
    // Mock SWR mutate
    const mockMutate = jest.fn();
    (SWR.mutate as jest.Mock).mockImplementation(mockMutate);

    // Mock fetch response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'client_123',
        name: 'Updated Client',
        email: 'updated@example.com',
        status: 'inactive',
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call updateClient function directly
    const clientId = 'client_123';
    const updatedData = {
      name: 'Updated Client',
      email: 'updated@example.com',
      status: 'inactive' as const,
    };
    
    const response = await updateClient(clientId, updatedData);

    // Check that fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(`/api/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    // Check that mutate was called to update the caches
    expect(SWR.mutate).toHaveBeenCalledWith('/api/clients');
    expect(SWR.mutate).toHaveBeenCalledWith(`/api/clients/${clientId}`);

    // Check the returned data
    expect(response).toEqual({
      id: 'client_123',
      name: 'Updated Client',
      email: 'updated@example.com',
      status: 'inactive',
    });
  });

  it('should handle error during client creation', async () => {
    // Mock fetch to return an error response
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Validation failed' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Call createClient and expect it to throw
    const invalidClient = {
      name: '',
      email: '',
      phone: '',
      status: 'active' as const,
    };
    
    await expect(createClient(invalidClient)).rejects.toThrow();
    expect(toast).toHaveBeenCalled();
  });
});
