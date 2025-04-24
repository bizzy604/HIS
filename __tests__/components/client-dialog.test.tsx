/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientDialog } from '@/components/client-dialog';
import { useClients } from '@/hooks/use-clients';
import { toast } from '@/components/ui/use-toast';

// Mock hooks and components
jest.mock('@/hooks/use-clients', () => ({
  useClients: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('ClientDialog Component', () => {
  // Mock functions
  const mockCreateClient = jest.fn();
  const mockUpdateClient = jest.fn();
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (useClients as jest.Mock).mockReturnValue({
      createClient: mockCreateClient,
      updateClient: mockUpdateClient,
    });
  });

  it('should render correctly in create mode', () => {
    render(
      <ClientDialog
        open={true}
        onClose={mockOnClose}
      />
    );

    // Check if form elements are rendered
    expect(screen.getByText('Add New Client')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    
    // Buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add Client')).toBeInTheDocument();
  });

  it('should render correctly in edit mode', () => {
    const mockClient = {
      id: 'client_123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      status: 'active',
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <ClientDialog
        open={true}
        onClose={mockOnClose}
        client={mockClient}
      />
    );

    // Check if form elements are populated with client data
    expect(screen.getByText('Edit Client')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('Phone')).toHaveValue('123-456-7890');
    
    // Buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Update Client')).toBeInTheDocument();
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
        onClose={mockOnClose}
      />
    );

    // Fill out the form
    await userEvent.type(screen.getByLabelText('Name'), 'New Client');
    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com');
    await userEvent.type(screen.getByLabelText('Phone'), '555-123-4567');
    
    // Select Active status
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'active' } });
    
    // Submit the form
    await userEvent.click(screen.getByText('Add Client'));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalledWith({
        name: 'New Client',
        email: 'new@example.com',
        phone: '555-123-4567',
        status: 'active',
      });
    });
    
    // Verify toast was shown on success
    expect(toast).toHaveBeenCalled();
    
    // Verify dialog was closed
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call updateClient when submitting in edit mode', async () => {
    const mockClient = {
      id: 'client_123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      status: 'active',
      lastVisit: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mock successful API call
    mockUpdateClient.mockResolvedValue({
      ...mockClient,
      name: 'John Doe Updated',
    });

    render(
      <ClientDialog
        open={true}
        onClose={mockOnClose}
        client={mockClient}
      />
    );

    // Change the name field
    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'John Doe Updated');
    
    // Submit the form
    await userEvent.click(screen.getByText('Update Client'));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalledWith(mockClient.id, {
        name: 'John Doe Updated',
        email: 'john@example.com',
        phone: '123-456-7890',
        status: 'active',
      });
    });
    
    // Verify toast was shown on success
    expect(toast).toHaveBeenCalled();
    
    // Verify dialog was closed
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display error message when API call fails', async () => {
    // Mock API error
    mockCreateClient.mockRejectedValue(new Error('API Error'));

    render(
      <ClientDialog
        open={true}
        onClose={mockOnClose}
      />
    );

    // Fill out the form minimally and submit
    await userEvent.type(screen.getByLabelText('Name'), 'Error Test');
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'active' } });
    
    // Submit the form
    await userEvent.click(screen.getByText('Add Client'));

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to add client.')).toBeInTheDocument();
    });
    
    // Dialog should remain open
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    render(
      <ClientDialog
        open={true}
        onClose={mockOnClose}
      />
    );

    // Submit without filling any fields
    await userEvent.click(screen.getByText('Add Client'));

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Status is required')).toBeInTheDocument();
    });
    
    // API should not be called
    expect(mockCreateClient).not.toHaveBeenCalled();
  });
});
