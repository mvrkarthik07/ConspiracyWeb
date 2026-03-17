import type { UserSession } from "./types";

const STORAGE_KEY = "conspiracyweb-user-sessions-v1";

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function loadUserSessions(): UserSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserSession[]) : [];
  } catch {
    return [];
  }
}

export function saveUserSessions(sessions: UserSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(-100)));
  } catch {
    // ignore
  }
}

export function appendUserSession(session: UserSession) {
  const sessions = loadUserSessions();
  sessions.push(session);
  saveUserSessions(sessions);
}

export function getAgreeRateForItem(itemId: string): { pct: number | null; n: number } {
  const sessions = loadUserSessions();
  let agree = 0;
  let total = 0;
  for (const s of sessions) {
    const v = s.sectionResponses?.[itemId];
    if (v === null || typeof v !== "number") continue;
    total += 1;
    if (v >= 5) agree += 1; // agree = 5–7
  }
  if (total === 0) return { pct: null, n: 0 };
  return { pct: Math.round((agree / total) * 100), n: total };
}

