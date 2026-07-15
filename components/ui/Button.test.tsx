import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import Button from './Button';

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: Record<string, unknown>) => <button {...props}>{children as React.ReactNode}</button>,
    a: ({ children, ...props }: Record<string, unknown>) => <a {...props}>{children as React.ReactNode}</a>,
  },
}));

describe('Button', () => {
  it('renders children', () => {
    render(<Button href={undefined} onClick={undefined}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="primary" href={undefined} onClick={undefined}>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button.className).toContain('bg-black');
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick} href={undefined}>Click</Button>);
    await user.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as link when href is provided', () => {
    render(<Button href="/test" onClick={undefined}>Link</Button>);
    const link = screen.getByText('Link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });
});
