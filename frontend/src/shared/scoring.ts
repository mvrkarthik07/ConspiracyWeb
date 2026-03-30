export function scoreCMS12(responses: Record<string, number>): number {
  const reversed = { ...responses };
  reversed["CMS12_5_R"] = 8 - responses["CMS12_5_R"];
  reversed["CMS12_8_R"] = 8 - responses["CMS12_8_R"];
  const values = Object.values(reversed);
  return values.reduce((a, b) => a + b, 0) / values.length; // Returns 1–7 average
}

/** Returns the raw total (12–84) used for personality typing */
export function totalCMS12(responses: Record<string, number>): number {
  const reversed = { ...responses };
  reversed["CMS12_5_R"] = 8 - (responses["CMS12_5_R"] ?? 4);
  reversed["CMS12_8_R"] = 8 - (responses["CMS12_8_R"] ?? 4);
  return Object.values(reversed).reduce((a, b) => a + b, 0);
}

export type PersonalityType = {
  id: string;
  title: string;
  range: string;
  description: string;
  tip: string;
  color: string;
};

export const PERSONALITY_TYPES: PersonalityType[] = [
  {
    id: "skeptic",
    title: "The Skeptic",
    range: "12–27",
    description:
      "You trust what you see and prefer facts over rumours. Secret societies? Puppet masters? Please, you've got better things to do — like queuing at the hawker centre for your laksa. MRT breakdowns? Just bad luck, not a secret plot.",
    tip: "Keep that healthy scepticism but don't ignore credible warnings or alternative perspectives entirely. Balance is key!",
    color: "#4ade80",
  },
  {
    id: "cautious",
    title: "The Cautious Observer",
    range: "28–42",
    description:
      "You peek behind the curtain sometimes. You might suspect some people in power have shady plans — but you know not everything is a grand conspiracy. You enjoy reading about hidden agendas, like following the latest HDB resale price trends or the latest COE bids.",
    tip: "Stay curious but critical. Fact-check before sharing WhatsApp forwards or Facebook posts. You'll impress your friends and avoid being 'that person' in the group chat.",
    color: "#22d3ee",
  },
  {
    id: "investigator",
    title: "The Curious Investigator",
    range: "43–57",
    description:
      "You notice patterns others might miss. CPF policies, ERP hikes, or even hawker stall shortages? You might suspect a bigger plan — but you still question the evidence. You probably spend your evenings scrolling through multiple news sources or Reddit threads to get 'the full story.'",
    tip: "Strengthen your skills by checking multiple reliable sources. Debate with friends over kopi — and sometimes your friend might just hold the source of truth!",
    color: "#fb923c",
  },
  {
    id: "believer",
    title: "The Believer",
    range: "58–72",
    description:
      "You see strings everywhere, and you're pretty sure someone is pulling them. Governments, corporations, media — none of them escapes your suspicion. Ordinary events? Forget it — they're probably part of a bigger plan.",
    tip: "Pause and ask, 'Is there solid evidence?' before drawing conclusions. Fact-checking, talking to diverse perspectives, or even a reality-check buddy can keep you from going too far down the rabbit hole.",
    color: "#fb7185",
  },
  {
    id: "conspiracist",
    title: "The Paranoid Conspiracist",
    range: "73–84",
    description:
      "You live in a world of secret societies, hidden agendas, and global puppet masters. Nothing is accidental, and everything has a reason (and probably a cover-up). You might even think the barista making your coffee is secretly part of a grand plan. Reality? Optional. Suspicion? Essential.",
    tip: "Take a deep breath and slow down. Practice serious fact-checking, diversify your news sources, and question your own assumptions. Not every coincidence is a conspiracy!",
    color: "#a78bfa",
  },
];

export function getPersonalityType(total: number): PersonalityType {
  if (total <= 27) return PERSONALITY_TYPES[0];
  if (total <= 42) return PERSONALITY_TYPES[1];
  if (total <= 57) return PERSONALITY_TYPES[2];
  if (total <= 72) return PERSONALITY_TYPES[3];
  return PERSONALITY_TYPES[4];
}

export function interpretCMS12(score: number): string {
  if (score <= 2.5) return "Low tendency toward conspiratorial thinking";
  if (score <= 4.5) return "Moderate — open to questioning authority";
  return "High — strong conspiratorial worldview";
}
