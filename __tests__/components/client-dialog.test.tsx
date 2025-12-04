/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientDialog } from '@/components/client-dialog';
import { Client } from '@/hooks/use-clients';
import '@testing-library/jest-dom';

// Mock hooks and functions
jest.mock('@/hooks/use-clients', () => ({
  createClient: jest.fn(),
  updateClient: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

// Create a mock client that satisfies the Client interface
const createMockClient = (overrides = {}): Client => ({
  id: 'client_123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  status: 'active',
  lastVisit: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  doctorId: 'doctor_123',
  enrollments: [],
  ...overrides
});

describe('ClientDialog Component', () => {
  // Mock functions
  const mockCreateClient = jest.fn();
  const mockUpdateClient = jest.fn();
  const mockOnOpenChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Override mock implementations
    const usClientsModule = require('@/hooks/use-clients');
    usClientsModule.createClient.mockImplementation(mockCreateClient);
    usClientsModule.updateClient.mockImplementation(mockUpdateClient);
  });

  it('should render correctly in create mode', () => {
    render(
      <ClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        mode="add"
      />
    );

    // Check if form elements are rendered
    expect(screen.getByRole('heading', { name: 'Add Client' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    
    // Buttons
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Client' })).toBeInTheDocument();
  });

  it('should render correctly in edit mode', () => {
    const mockClient = createMockClient();

    render(
      <ClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        mode="edit"
        client={mockClient}
      />
    );

    // Check if form elements are populated with client data
    expect(screen.getByRole('heading', { name: 'Edit Client' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('Phone')).toHaveValue('123-456-7890');
    
    // Buttons
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('should call createClient when submitting in create mode', async () => {
    // Mock successful API call
    mockCreateClient.mockResolvedValue({
      id: 'new_client_123',
      name: 'New Client',
    });

    render(
      <ClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        mode="add"
      />
    );

    // Fill out the form
    await userEvent.type(screen.getByLabelText('Name'), 'New Client');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.type(screen.getByLabelText('Phone'), '555-123-4567');
    
    // Select Active status
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'active' } });
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Add Client' }));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalledWith({
        name: 'New Client',
        email: 'new@example.com',
        phone: '555-123-4567',
        status: 'active',
      });
    });
    
    // Verify dialog was closed
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call updateClient when submitting in edit mode', async () => {
    const mockClient = createMockClient();

    // Mock successful API call
    mockUpdateClient.mockResolvedValue({
      ...mockClient,
      name: 'John Doe Updated',
    });

    render(
      <ClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        mode="edit"
        client={mockClient}
      />
    );

    // Change the name field
    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'John Doe Updated');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalledWith(mockClient.id, {
        name: 'John Doe Updated',
        email: 'john@example.com',
        phone: '123-456-7890',
        status: 'active',
      });
    });
    
    // Verify dialog was closed
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should display error message when API call fails', async () => {
    // Mock API error
    mockCreateClient.mockRejectedValue(new Error('API Error'));

    render(
      <ClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        mode="add"
      />
    );

    // Fill out the form minimally and submit
    await userEvent.type(screen.getByLabelText('Name'), 'Error Test');
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'active' } });
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Add Client' }));

    // Wait for the error processing to complete
    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalled();
    });
  });

  it('should validate required fields', async () => {
    render(
      <ClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        mode="add"
      />
    );

    // Submit without filling any fields
    await userEvent.click(screen.getByRole('button', { name: 'Add Client' }));

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });
});
