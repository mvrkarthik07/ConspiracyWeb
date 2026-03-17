import { Link } from "react-router-dom";

export function GameLandingPage() {
  const card = "rounded-lg border border-white/15 bg-black/40 p-6";
  const button = "inline-flex rounded border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/5";

  return (
    <div className="space-y-4">
      <div className={card}>
        <p className="text-sm font-semibold text-white">GAME</p>
        <p className="mt-2 text-xs text-white/60">
          Choose a mode: Classic (scenario quiz) or Survey (CMS12 + belief items).
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={card}>
          <p className="text-sm font-semibold text-white">CLASSIC MODE</p>
          <p className="mt-2 text-xs text-white/60">Multiple choice scenarios with immediate feedback.</p>
          <div className="mt-4">
            <Link className={button} to="/game/play">START</Link>
          </div>
        </div>
        <div className={card}>
          <p className="text-sm font-semibold text-white">SURVEY MODE</p>
          <p className="mt-2 text-xs text-white/60">CMS12 onboarding + section belief survey + dashboard.</p>
          <div className="mt-4">
            <Link className={button} to="/game/survey">START</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

