import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { SurveyPage } from "@/pages/SurveyPage";
import { ExplorePage } from "@/pages/ExplorePage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { TopicPage } from "@/pages/TopicPage";
import { TheoryPage } from "@/pages/TheoryPage";
import { GameLandingPage } from "@/pages/GameLandingPage";
import { GamePlayPage } from "@/pages/GamePlayPage";
import { GameResultsPage } from "@/pages/GameResultsPage";

function DiagnosticsFooter() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const stamp = new Date().toISOString();
  return (
    <footer className="mt-10 border-t border-[var(--border-default)]">
      <div className="mx-auto max-w-6xl px-5 py-6">
        <p className="section-label mb-4">DIAGNOSTICS</p>
        <div className="grid gap-y-2 text-[11px] tracking-[0.12em] uppercase">
          <Row label="Survey status" value="ACTIVE" />
          <Row label="Total responses" value="LOADING" />
          <Row label="Questions" value="65" />
          <Row label="Clusters" value="5 (POLITICAL / SECRETS / SCIENCE / ELITES / GEOPOLITICAL)" />
          <Row label="Node graph" value="LIVE" />
          <Row label="DB status" value="CONNECTED" />
          <Row label="Last update" value={stamp} />
          <Row label="Build" value="v0.1.0" />
          <Row label="User agent" value={ua} />
        </div>
      </div>
    </footer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[220px_1fr] gap-x-6">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: 0 }}>
        {value}
      </span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full" style={{ background: "var(--bg-base)" }}>
      <header style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="mx-auto max-w-6xl px-5 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link
            to="/"
            className="wordmark whitespace-nowrap"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "var(--text-primary)",
              textDecoration: "none",
            }}
          >
            CONSPIRACY INDEX
          </Link>
          <nav className="flex items-center justify-center gap-10">
            <NavLink to="/">GRAPH</NavLink>
            <span style={{ color: "var(--border-default)" }}>|</span>
            <NavLink to="/game/survey">SURVEY</NavLink>
            <span style={{ color: "var(--border-default)" }}>|</span>
            <NavLink to="/game/results">RESULTS</NavLink>
            <span style={{ color: "var(--border-default)" }}>|</span>
            <NavLink to="/explore">EXPLORE</NavLink>
          </nav>
          <div className="flex items-center justify-end">
            <Link className="terminal-btn-primary whitespace-nowrap" to="/game/survey">
              ENTER SURVEY →
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <DiagnosticsFooter />
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-[11px] uppercase"
      style={{
        fontFamily: "var(--font-sans)",
        letterSpacing: "0.1em",
        color: "var(--text-secondary)",
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="terminal-panel p-6">
      <p className="section-label">{title}</p>
      <p className="body-copy mt-3">
        Placeholder route.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/game" element={<GameLandingPage />} />
        <Route path="/game/play" element={<GamePlayPage />} />
        <Route path="/game/results" element={<GameResultsPage />} />
        <Route path="/game/survey" element={<SurveyPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/category/:slug/topic/:topicSlug" element={<TopicPage />} />
        <Route path="/theory/:id" element={<TheoryPage />} />
        <Route path="*" element={<Placeholder title="Not found"/>} />
      </Routes>
    </Shell>
  );
}
