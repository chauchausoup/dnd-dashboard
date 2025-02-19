import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './Sidebar';

// minimal mock for react-router used by Sidebar
vi.mock('react-router', () => {
  return {

    // simple mock for Link renders an anchor element
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),

    // useLocation returns a fixed pathname.
    useLocation: () => ({ pathname: '/' })
  };
});


describe('Sidebar component', () => {
  it('renders the dashboard text', () => {
    render(<Sidebar />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Spells/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();

  });
});