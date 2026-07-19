import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Routing', () => {
  it('renders the DashboardLayout by default on root path', () => {
    render(<App />);
    
    // It should render the Sidebar (Tractus Spaces)
    expect(screen.getByText('Tractus Spaces')).toBeInTheDocument();
    
    // It should render the SpaceFeedPage (Home)
    expect(screen.getByText(/Space Feed \(Home\)/i)).toBeInTheDocument();
  });
});
