import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-white hover:text-accent transition-colors">
          ConspiracyWebSG
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Browse
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-surface-light">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
          This is an educational prototype. Content summarizes circulating claims and
          publicly available reporting. Verification status (TRUE / FALSE / UNVERIFIED)
          reflects assessed evidence, not legal or official determinations.
        </p>
        <p className="text-xs text-gray-600 mt-2">© ConspiracyWebSG</p>
      </div>
    </footer>
  );
}
