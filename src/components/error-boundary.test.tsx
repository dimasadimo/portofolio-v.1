import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from '@/components/error-boundary';

function Boom({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('kaboom');
  return <p>recovered</p>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs the caught error itself; keep the test output readable.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('shows the fallback alert instead of unmounting the tree', () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('renders a custom fallback when one is supplied', () => {
    render(
      <ErrorBoundary fallback={({ error }) => <p>caught: {error.message}</p>}>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText('caught: kaboom')).toBeInTheDocument();
  });

  it('clears the error when the retry button is pressed', async () => {
    const user = userEvent.setup();

    function Flaky() {
      return <Boom shouldThrow={false} />;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('recovered')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
