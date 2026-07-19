import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';

describe('App Routing', () => {
  it('redirects to login by default on root path since unauthenticated', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    // It should render the Login heading because ProtectedRoute redirects to /login
    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
  });
});
