import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-light tracking-tight">Page not found</h1>
      <Link
        href="/"
        className="border-orange text-orange hover:text-orange/80 border-b pb-1 text-xs font-bold tracking-widest uppercase transition-colors"
      >
        Back home
      </Link>
    </div>
  );
}
