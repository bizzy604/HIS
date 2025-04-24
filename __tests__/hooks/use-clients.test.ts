/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useClients } from '@/hooks/use-clients';
import * as SWR from 'swr';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
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
      },
      {
        id: 'client_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'inactive',
      },
    ];

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
    expect(result.current.isError).toBe(false);
    
    // Check that SWR was called with the correct key
    expect(SWR.default).toHaveBeenCalledWith('/api/clients');
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
    expect(result.current.clients).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state', async () => {
    // Mock SWR to return error
    (SWR.default as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('Failed to fetch clients'),
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Check the returned state
    expect(result.current.clients).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('Failed to fetch clients'));
  });

  it('should create a client correctly', async () => {
    // Mock clients data and SWR mutate
    const mockMutate = jest.fn();
    (SWR.default as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    });
    (SWR.mutate as jest.Mock) = mockMutate;

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

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Call createClient
    const newClient = {
      name: 'New Client',
      email: 'new@example.com',
      status: 'active',
    };
    
    const response = await result.current.createClient(newClient);

    // Check that fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    });

    // Check that mutate was called to update the cache
    expect(mockMutate).toHaveBeenCalled();

    // Check the returned data
    expect(response).toEqual({
      id: 'new_client_123',
      name: 'New Client',
      email: 'new@example.com',
      status: 'active',
    });
  });

  it('should update a client correctly', async () => {
    // Mock clients data and SWR mutate
    const mockMutate = jest.fn();
    (SWR.default as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    });
    (SWR.mutate as jest.Mock) = mockMutate;

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

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Call updateClient
    const clientId = 'client_123';
    const updatedData = {
      name: 'Updated Client',
      email: 'updated@example.com',
      status: 'inactive',
    };
    
    const response = await result.current.updateClient(clientId, updatedData);

    // Check that fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(`/api/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    // Check that mutate was called to update the cache
    expect(mockMutate).toHaveBeenCalled();

    // Check the returned data
    expect(response).toEqual({
      id: 'client_123',
      name: 'Updated Client',
      email: 'updated@example.com',
      status: 'inactive',
    });
  });

  it('should delete a client correctly', async () => {
    // Mock clients data and SWR mutate
    const mockMutate = jest.fn();
    (SWR.default as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    });
    (SWR.mutate as jest.Mock) = mockMutate;

    // Mock fetch response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Call deleteClient
    const clientId = 'client_123';
    const response = await result.current.deleteClient(clientId);

    // Check that fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(`/api/clients/${clientId}`, {
      method: 'DELETE',
    });

    // Check that mutate was called to update the cache
    expect(mockMutate).toHaveBeenCalled();

    // Check the returned data
    expect(response).toEqual({ success: true });
  });

  it('should handle API errors when creating a client', async () => {
    // Mock SWR
    (SWR.default as jest.Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
    });

    // Mock fetch to throw an error
    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({ message: 'Validation error' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    // Render the hook
    const { result } = renderHook(() => useClients());

    // Call createClient and expect it to throw
    await expect(
      result.current.createClient({ name: 'Test', status: 'active' })
    ).rejects.toThrow('Failed to create client: Validation error');
  });
});
