"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui";

const navLinks = [
  { href: "/#browse-topics", label: "Topics" },
  { href: "/categories", label: "Categories" },
  { href: "/game", label: "Game" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <div className="flex-1 flex flex-col">{children}</div>
      <AppFooter />
    </div>
  );
}

function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) window.location.href = `/?q=${encodeURIComponent(q)}`;
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-app flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-semibold text-text hover:text-accent transition-colors duration-fast rounded-ds focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ConspiracyWeb SG
        </Link>

        {/* Desktop: nav + search */}
        <nav className="hidden md:flex items-center gap-6 flex-1 max-w-xl mx-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors duration-fast rounded-ds focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                pathname === href || (pathname === "/" && href === "/#browse-topics")
                  ? "text-accent"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {label}
            </Link>
          ))}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
            <label htmlFor="nav-search" className="sr-only">
              Search theories
            </label>
            <Input
              id="nav-search"
              type="search"
              placeholder="Search theories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 text-sm"
              aria-label="Search theories"
            />
          </form>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 rounded-ds text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-surface-light transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`md:hidden absolute top-full left-0 right-0 border-b border-border bg-[var(--bg)] shadow-ds-lg ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-4 py-4 space-y-3 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="mobile-search" className="sr-only">
              Search theories
            </label>
            <Input
              id="mobile-search"
              type="search"
              placeholder="Search theories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-3"
              aria-label="Search theories"
            />
          </form>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium rounded-ds px-2 -mx-2 transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                pathname === href || (pathname === "/" && href === "/#browse-topics")
                  ? "text-accent bg-accent-subtle"
                  : "text-text hover:bg-surface-light"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-light">
      <div className="container-app py-8">
        <p className="text-small text-text-muted leading-relaxed max-w-2xl">
          Educational prototype summarizing circulating claims and public reporting. Not an endorsement. Verification status (TRUE / FALSE / UNVERIFIED) reflects assessed evidence, not legal or official determinations.
        </p>
        <p className="text-caption text-text-muted mt-4 opacity-80">© ConspiracyWeb SG</p>
      </div>
    </footer>
  );
}
