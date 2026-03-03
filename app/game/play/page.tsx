import { GamePlayClient } from "@/components/GamePlayClient";

export const metadata = {
  title: "Play — Conspirational Thinking Game",
  description: "Answer 10 scenario-based questions on source evaluation, bias detection, and evidence.",
};

export default function GamePlayPage() {
  return <GamePlayClient />;
}
