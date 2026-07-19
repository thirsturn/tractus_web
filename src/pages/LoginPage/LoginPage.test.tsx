import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from './LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('LoginPage Component', () => {
  it('renders the login form by default', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Should display the Login heading
    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    
    // Should have Username input
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    
    // Confirm password should NOT be in the document initially
    expect(screen.queryByPlaceholderText(/Confirm Password/i)).not.toBeInTheDocument();
  });

  it('switches to the registration form when toggled', () => {
    // Wrap in AuthProvider since LoginPage now uses useAuth()
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Click the toggle link to switch to 'Sign Up'
    const toggleBtn = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(toggleBtn);
    
    // Now it should display the Join heading
    expect(screen.getByText(/Join Tractus/i)).toBeInTheDocument();
    
    // The email field should appear
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    
    // The Confirm Password field should appear
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
  });
});
