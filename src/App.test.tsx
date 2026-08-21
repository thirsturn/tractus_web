import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';

describe('App Routing', () => {
  it('renders the Dashboard by default since ProtectedRoute is temporarily bypassed', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    // It should render the Dashboard Sidebar (Menu)
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });
});
