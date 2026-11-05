'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <h1 className="text-2xl font-light tracking-tight">Something went wrong.</h1>
      <p className="max-w-md text-sm opacity-70">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="border-orange text-orange hover:text-orange/80 border-b pb-1 text-xs font-bold tracking-widest uppercase transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
