import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {
  it('renders the login form by default', () => {
    render(<LoginPage />);
    
    // Should display the Login heading
    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    
    // Should have an Email placeholder instead of Username for the main input
    expect(screen.getByPlaceholderText(/johndoe@gmail.com/i)).toBeInTheDocument();
    
    // Confirm password should NOT be in the document initially
    expect(screen.queryByPlaceholderText(/Confirm Password/i)).not.toBeInTheDocument();
  });

  it('switches to the registration form when toggled', () => {
    render(<LoginPage />);
    
    // Click the toggle link to switch to 'Sign Up'
    const toggleBtn = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(toggleBtn);
    
    // Now it should display the Join heading
    expect(screen.getByText(/Join Tractus/i)).toBeInTheDocument();
    
    // The username field should appear
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    
    // The Confirm Password field should appear
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
  });
});
