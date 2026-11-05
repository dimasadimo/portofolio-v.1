import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  /** Rendered instead of `children` when a descendant throws during render. */
  fallback?: (props: { error: Error; reset: () => void }) => React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Root render-error guard (CONVENTIONS.md §11). Without this, a throw anywhere in the
 * tree unmounts the whole app and leaves a blank page.
 *
 * Must stay a class: `getDerivedStateFromError` has no hook equivalent.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Swap for a real reporter (Sentry) when one is wired up — §11.
    // eslint-disable-next-line no-console
    console.error('Unhandled render error', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback({ error, reset: this.reset });

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <h1 className="text-2xl font-light tracking-tight">Something went wrong.</h1>
        <p className="max-w-md text-sm opacity-70">
          This section failed to render. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={this.reset}
          className="border-orange text-orange hover:text-orange/80 border-b pb-1 text-xs font-bold tracking-widest uppercase transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}
