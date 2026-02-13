import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MenuDisplay from './MenuDisplay';

describe('MenuDisplay Component', () => {
  it('renders menu items and handles Add to Cart', async () => {
    const mockAddToCart = vi.fn();
    
    // Minimal mock for testing
    render(<MenuDisplay addToCart={mockAddToCart} />);

    // In a real test, we wait for API results. 
    // For TDD, we verify the button presence first.
    const buttons = await screen.findAllByText(/Add to Cart/i);
    expect(buttons.length).toBeGreaterThan(0);

    fireEvent.click(buttons[0]);
    expect(mockAddToCart).toHaveBeenCalled();
  });
});