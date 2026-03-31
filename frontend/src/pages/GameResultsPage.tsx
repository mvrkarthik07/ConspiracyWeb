import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadUserSessions } from "@/shared/persistence";
import { THEMES } from "@/shared/surveyItems";
import { THEME_COLORS } from "@/shared/themeColors";
import { getPersonalityType, totalCMS12 } from "@/shared/scoring";
import type { UserSession } from "@/shared/types";

function avg(vals: number[]) {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function SessionCard({ session }: { session: UserSession }) {
  const isCms12 = session.theme === "cms12";
  const themeMeta = !isCms12 ? THEMES.find((t) => t.id === session.theme) : null;
  const cfg = themeMeta ? THEME_COLORS[themeMeta.id] : null;
  const themeLabel = isCms12 ? "CMS12 PERSONALITY TEST" : (themeMeta?.short ?? "GENERAL");
  const accentColor = isCms12 ? "#fb923c" : (cfg?.text ?? "#888");

  // Compute stats from sectionResponses
  const responses = Object.entries(session.sectionResponses ?? {}).filter(
    ([, v]) => typeof v === "number"
  ) as [string, number][];
  const answeredCount = responses.length;
  const sectionAvg = answeredCount
    ? Math.round(avg(responses.map(([, v]) => v)) * 10) / 10
    : 0;
  const stronglyAgreed = responses.filter(([, v]) => v >= 6).length;

  // For CMS12 sessions, compute personality
  const cmsTotal = isCms12 && Object.keys(session.cms12).length > 0
    ? totalCMS12(session.cms12) : null;
  const personality = cmsTotal !== null ? getPersonalityType(cmsTotal) : null;

  const date = new Date(session.completedAt);
  const dateStr = date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: "#080808",
        border: `1px solid ${accentColor}33`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 2, background: accentColor }} />
      <div style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: accentColor,
              fontFamily: "var(--font-sans)",
            }}
          >
            {themeLabel}
          </span>
          <span style={{ fontSize: 10, color: "#444" }}>{dateStr}</span>
        </div>

        {isCms12 && personality ? (
          <div>
            <div
              style={{
                background: "#0d0d0d",
                border: `1px solid ${personality.color}33`,
                borderRadius: 3,
                padding: "14px 16px",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 9, color: personality.color, letterSpacing: "0.12em", marginBottom: 4 }}>
                {personality.range} POINTS
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e0e0e0", fontFamily: "var(--font-mono)" }}>
                {personality.title}
              </div>
              <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, margin: "8px 0 0" }}>
                {personality.description.slice(0, 120)}...
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>TOTAL SCORE</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: personality.color }}>{cmsTotal}</div>
                <div style={{ fontSize: 9, color: "#444" }}>/ 84</div>
              </div>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>AVG RATING</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ddd" }}>{session.cms12Score !== null ? (Math.round(session.cms12Score * 10) / 10).toFixed(1) : "—"}</div>
                <div style={{ fontSize: 9, color: "#444" }}>/ 7.0</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>AVG SCORE</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: accentColor }}>{sectionAvg.toFixed(1)}</div>
                <div style={{ fontSize: 9, color: "#444" }}>/ 7.0</div>
              </div>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>ANSWERED</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ddd" }}>{answeredCount}</div>
                <div style={{ fontSize: 9, color: "#444" }}>items</div>
              </div>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>STRONG AGREE</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ddd" }}>{stronglyAgreed}</div>
                <div style={{ fontSize: 9, color: "#444" }}>items (6–7)</div>
              </div>
            </div>
            {session.cms12Score !== null && (
              <div style={{ marginTop: 10, fontSize: 11, color: "#555" }}>
                CMS12 Score: {(Math.round(session.cms12Score * 10) / 10).toFixed(1)} / 7.0
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function GameResultsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);

  useEffect(() => {
    setSessions(loadUserSessions());
  }, []);

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        padding: "40px 20px",
        fontFamily: "var(--font-sans)",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#555",
            marginBottom: 8,
          }}
        >
          YOUR SURVEY RESULTS
        </div>
        <h2
          style={{
            fontSize: 20,
            color: "#e0e0e0",
            fontFamily: "var(--font-mono)",
            margin: 0,
          }}
        >
          Completed Sessions
        </h2>
      </div>

      {sorted.length === 0 ? (
        <div
          style={{
            background: "#080808",
            border: "1px solid #222",
            borderRadius: 4,
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>
            No survey results yet. Take a survey to see your results here.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link
              to="/game/survey"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "#fff",
                border: "1px solid #333",
                padding: "10px 18px",
                borderRadius: 3,
                textDecoration: "none",
              }}
            >
              TAKE GENERAL SURVEY
            </Link>
            <Link
              to="/explore"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "#888",
                border: "1px solid #222",
                padding: "10px 18px",
                borderRadius: 3,
                textDecoration: "none",
              }}
            >
              EXPLORE CLUSTERS
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sorted.map((s) => (
            <SessionCard key={s.sessionId} session={s} />
          ))}

          <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
            <Link
              to="/game/survey"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "#fff",
                border: "1px solid #333",
                padding: "10px 18px",
                borderRadius: 3,
                textDecoration: "none",
              }}
            >
              TAKE ANOTHER SURVEY
            </Link>
            <Link
              to="/explore"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "#888",
                border: "1px solid #222",
                padding: "10px 18px",
                borderRadius: 3,
                textDecoration: "none",
              }}
            >
              EXPLORE CLUSTERS
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
