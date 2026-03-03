import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex flex-col items-center justify-center py-16 text-center">
      <h1 className="typography-display mb-2">Page not found</h1>
      <p className="typography-small text-text-muted mb-8 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="rounded-ds border border-border bg-surface-light px-4 py-2 text-small font-medium text-text hover:bg-surface-lighter hover:border-accent/40 transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        Back to home
      </Link>
    </div>
  );
}
