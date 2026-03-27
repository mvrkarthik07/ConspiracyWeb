export const THEMES = [
  {
    id: "political" as const,
    label: "Covert Political Engineering by the Powerful",
    short: "POLITICAL ENGINEERING",
    description:
      "Some believe those in power will do whatever it takes to remain there, quietly shaping society in their favour behind the scenes, with the public none the wiser.",
    generalBelief:
      "Some believe those in power will do whatever it takes to remain there, and that powerful groups quietly shape society in their favour behind the scenes, with the public none the wiser.",
    whyBelieve:
      "For some, such theories can seem convincing or gratifying, especially when people are trying to make sense of how power, leadership, and public policy operate within a society.",
    context:
      "In Singapore, these discussions occasionally reference the long-standing role of the People's Action Party (PAP), which has held the mandate to govern the country for decades.",
  },
  {
    id: "secrets" as const,
    label: "State Secrets and Institutional Cover-Ups",
    short: "STATE SECRETS",
    description:
      "Allegations that institutions hide events, decisions, or data from the public eye — with a vacuum in understanding that some fill with speculative stories.",
    generalBelief:
      "Stories and theories have surfaced suggesting that certain events or decisions might be guided, or intentionally hidden by forces that the public doesn't fully see or understand.",
    whyBelieve:
      "People tend to wonder if there's more going on behind closed doors in Singapore than what meets the public eye, especially when institutions are not perceived as transparent or honest enough by some.",
    context:
      "From alleged cover-ups to unexplained government decisions, these claims explore what might be swept under the carpet and whether institutions sometimes act in ways that aren't immediately obvious.",
  },
  {
    id: "science" as const,
    label: "Hidden Motives Behind Science and Medicine",
    short: "SCIENCE & MEDICINE",
    description:
      "Skepticism about whether unseen motivations drive medical recommendations, and whether powerful organisations influence what the public is told about health.",
    generalBelief:
      "The skeptical may question if there are unseen motivations behind certain medical recommendations, or whether powerful organisations could influence what the public is told, especially when parts of the healthcare sector are profit-driven.",
    whyBelieve:
      "This mindset often arises because conversations about healthcare in Singapore have touched on issues such as affordability, and healthcare plays an important role in everyday decision-making.",
    context:
      "These perspectives are frequently applied to local initiatives — from national vaccination programmes to public health campaigns. This is particularly visible given Singapore's access to advanced medical technology and an ageing, health-conscious population.",
  },
  {
    id: "elites" as const,
    label: "Elites Scheming Against the People",
    short: "ELITE SCHEMES",
    description:
      "When economic pressures are felt strongly by certain groups, it creates room for speculation about whether elites or powerful institutions work primarily to benefit themselves.",
    generalBelief:
      "Individuals who feel the weight of economic disparity may question whether Singapore's prosperity benefits everyone equally — feeding into the idea that the rich are getting richer while others struggle.",
    whyBelieve:
      "Such doubts are fuelled by local economic realities. Singapore is ranked among the world's richest cities, yet also ranked the most expensive city for expatriates in 2025 — raising questions about what this means for the average Singaporean.",
    context:
      "This section explores theories that revolve around elites supposedly scheming against the general public, from CPF mismanagement to the rigging of housing and labour markets.",
  },
  {
    id: "geopolitical" as const,
    label: "Geopolitical Maneuvering & Foreign Influence",
    short: "GEOPOLITICAL",
    description:
      "For an interconnected 'little red dot' surrounded by larger neighbours and global powers, it is not unusual to wonder whether unseen geopolitical forces are influencing domestic affairs.",
    generalBelief:
      "Shifting alliances, regional tensions, and the influence of major international players can give rise to theories suggesting that more complicated dynamics are unfolding behind the scenes.",
    whyBelieve:
      "This perspective is rooted in Singapore's unique position — surrounded by larger neighbours and major global powers, people wonder whether unseen geopolitical forces could be influencing domestic affairs.",
    context:
      "This section explores theories that centre on geopolitical manoeuvring and foreign influence in Singapore, from secret defence capabilities to great-power interference in local social friction.",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export interface SurveyItem {
  id: string;
  theme: ThemeId;
  themeLabel: string;
  category: string;
  text: string;
}

export const surveyItems: SurveyItem[] = [

  // ── THEME 1: Covert Political Engineering ─────────────────────────────────

  // Electoral Manipulation
  {
    id: "A1",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "The Singapore government manipulates electoral boundaries (gerrymandering) to ensure the ruling party stays in power.",
  },
  {
    id: "A2",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "The government knows who each citizen votes for, despite claims that voting in Singapore is secret.",
  },
  {
    id: "A3",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "Some opposition parties in Singapore were secretly created or funded by the PAP to split the opposition vote.",
  },
  {
    id: "A4",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "The timing of general elections in Singapore is deliberately chosen by the ruling party to disadvantage opposition voters.",
  },
  {
    id: "A4b",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "The PAP set a short runway to GE2025 specifically to lower voter turnout and strengthen their electoral mandate.",
  },
  {
    id: "A3b",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "Chee Soon Juan was planted by the PAP to discredit the Singapore Democratic Party (SDP) from within.",
  },

  // PAP Power Plays
  {
    id: "A5",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "Opposition-held wards in Singapore are deliberately given less government funding and resources compared to PAP-held wards — as seen in Hougang and Potong Pasir.",
  },
  {
    id: "A6",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "The PAP has worked behind the scenes to undermine or remove political figures who pose a threat to their power.",
  },
  {
    id: "A7",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "Operation Cold Store was politically motivated to eliminate opposition figures, not genuinely aimed at preventing communism — and was intentionally planned by Lee Kuan Yew to consolidate his rise to power.",
  },
  {
    id: "A8",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "Singapore's separation from Malaysia was not forced upon Singapore; it was secretly initiated by Singapore's own leaders, contrary to the official narrative.",
  },
  {
    id: "A29",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "The Iswaran corruption case resulted in an unusually lenient sentence because of his connections to the PAP and people in power — or because he holds secrets they wish to protect.",
  },
  {
    id: "A6b",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "PAP intentionally sabotages Pritam Singh to make him lose his Leader of Opposition position.",
  },
  {
    id: "A6c",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "The Raeesah Khan/Pritam Singh investigation was a calculated political hit job designed to dismantle the Workers' Party.",
  },
  {
    id: "A9",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "The true amount of Singapore's national reserves is hidden from the public, and the government actively misrepresents the country's financial health.",
  },

  // Political Figures
  {
    id: "A21",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Political Figures",
    text: "Lee Kuan Yew is not actually dead, but has been cryogenically preserved in a secret facility, with plans to revive him in the future.",
  },
  {
    id: "A22",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Political Figures",
    text: "The death of lawyer M. Ravi was politically motivated or connected to the incumbent government.",
  },
  {
    id: "A23",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Political Figures",
    text: "Lee Hsien Loong's first wife did not die from natural medical causes; there may have been foul play or circumstances the public was not told about.",
  },
  {
    id: "A26",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Political Figures",
    text: "There is a hidden tunnel beneath 38 Oxley Road connecting to the Istana, which is why the government resists having the house demolished or opened to the public.",
  },

  // Social Control
  {
    id: "A36",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Social Control",
    text: "Singapore's education system is deliberately designed to discourage critical thinking and condition students to obey authority and the government.",
  },
  {
    id: "A36b",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Social Control",
    text: "The Singapore system only truly benefits individuals who pursue STEM fields, with arts and social science graduates deliberately marginalised.",
  },

  // ── THEME 2: State Secrets & Institutional Cover-Ups ──────────────────────

  // Media Manipulation
  {
    id: "A13",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Media Manipulation",
    text: "Mainstream media in Singapore is deliberately used as a propaganda tool to support the ruling party and suppress dissenting views.",
  },
  {
    id: "A34",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Media Manipulation",
    text: "Singapore's mainstream media had evidence of ministers associating with criminals but deliberately suppressed the information until it could no longer be hidden.",
  },
  {
    id: "A37",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Media Manipulation",
    text: "The government uses AI and social media algorithms to influence or control the information Singaporeans are exposed to online.",
  },

  // Government Surveillance
  {
    id: "A15",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Government Surveillance",
    text: "The Singapore government monitors citizens' online activity and personal data far more extensively than it publicly acknowledges.",
  },
  {
    id: "A16",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Government Surveillance",
    text: "TraceTogether data collected during COVID-19 was used for government surveillance purposes beyond what was disclosed to the public.",
  },

  // Covered Incidents
  {
    id: "A17",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "The Singapore government concealed the true number or severity of COVID-19 cases from the public.",
  },
  {
    id: "A32",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "The government covered up the full truth about the escape and fate of Mas Selamat — including claims that he was actually killed rather than allowed to flee.",
  },
  {
    id: "A33",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "The government concealed or downplayed the severity of a pollution incident in western Singapore, denying what residents could clearly detect.",
  },
  {
    id: "A32b",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "The 1961 Bukit Ho Swee fire was deliberately engineered by the government to clear land and force resettlement into public housing.",
  },
  {
    id: "A34b",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "Singapore ministers were knowingly connected with Fujian gang member Su Haijin, who was later convicted of money laundering — and the media actively covered this up.",
  },
  {
    id: "A38",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "The RVHS student arrest was a scapegoat incident used by the government to send a political message rather than address a genuine security threat.",
  },
  {
    id: "B1",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "The disappearance of Malaysia Airlines Flight MH370 was not an accident but was the result of deliberate interference by a government or other powerful entity.",
  },

  // Institutional Bias
  {
    id: "A35",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Institutional Bias",
    text: "BTO balloting in Singapore secretly gives priority to applicants who are civil servants or grassroots volunteers.",
  },
  {
    id: "A39",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Institutional Bias",
    text: "The vaping ban in Singapore is not about public health — it was introduced to protect cigarette tax revenue, which would be threatened by cheaper alternatives.",
  },
  {
    id: "A40",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Institutional Bias",
    text: "Unemployment rates and happiness index scores published by the government are deliberately inflated or manipulated to maintain a positive national image.",
  },

  // ── THEME 3: Hidden Motives Behind Science and Medicine ───────────────────

  // COVID & Vaccines
  {
    id: "C1",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "COVID & Vaccines",
    text: "COVID-19 was deliberately created in a laboratory — it was a population check by governments or powerful organisations, not a naturally occurring virus.",
  },
  {
    id: "C3",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "COVID & Vaccines",
    text: "COVID-19 vaccines were not adequately tested and cause serious side effects (including strokes) that are being actively concealed from the public.",
  },
  {
    id: "C21",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "COVID & Vaccines",
    text: "Vaccines contain a liquid microchip implanted by the government to track and surveil citizens without their knowledge.",
  },
  {
    id: "C30",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "COVID & Vaccines",
    text: "Pharmaceutical companies already knew about COVID-19 before it became public and had vaccines prepared in advance, proving the pandemic was planned.",
  },
  {
    id: "C30b",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "COVID & Vaccines",
    text: "Singapore's government holds shares in pharmaceutical companies, which means it has a financial incentive to allow viruses and diseases to spread.",
  },

  // Pharmaceutical Conspiracies
  {
    id: "C4",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Pharmaceutical Conspiracies",
    text: "Pharmaceutical companies already have cures for major diseases like cancer and AIDS but deliberately withhold them to maximise long-term profits.",
  },
  {
    id: "C5",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Pharmaceutical Conspiracies",
    text: "Big Pharma deliberately develops drugs that manage chronic conditions rather than curing them, to ensure continuous revenue from repeat prescriptions.",
  },
  {
    id: "C6",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Pharmaceutical Conspiracies",
    text: "Scientists or researchers who discover cures for major diseases are silenced, killed, or have their work suppressed by pharmaceutical companies and governments.",
  },

  // Scientific Deception
  {
    id: "C14",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "Climate change is exaggerated or fabricated by scientists and governments for political and economic control — even despite Singapore's own rising temperatures.",
  },
  {
    id: "C24",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "GMO (genetically modified) foods are harmful to human health, despite what scientists and regulatory bodies claim.",
  },
  {
    id: "C24b",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "Mainstream nutritional guidelines are deliberately designed to keep people unhealthy and dependent on medication, benefiting the food and pharmaceutical industries.",
  },
  {
    id: "C24c",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "Yishun has unusually high rates of crime and bizarre behaviour because of secret government testing, bad Feng Shui, or some other hidden force that the authorities conceal.",
  },

  // ── THEME 4: Elites Scheming Against the People ───────────────────────────

  // CPF & Finances
  {
    id: "A10",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "CPF & Finances",
    text: "CPF money is not fully available for withdrawal because the government has invested it poorly and incurred losses it does not disclose to the public.",
  },
  {
    id: "A11",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "CPF & Finances",
    text: "The CPF minimum sum keeps increasing because the government does not have enough money to allow everyone to withdraw their full CPF at once.",
  },
  {
    id: "A12",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "CPF & Finances",
    text: "The interest earned on CPF savings is actually much higher than the 2.5–4% that the government pays out to members.",
  },

  // Cost of Living
  {
    id: "E1",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Cost of Living",
    text: "MRT fares keep increasing, but the quality of service consistently fails to improve — the fare hikes benefit the company and its shareholders, not commuters.",
  },
  {
    id: "E2",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Cost of Living",
    text: "High commercial rental costs are deliberately engineered to kill hawker culture — replacing affordable local food with higher-margin commercial operators.",
  },
  {
    id: "E3",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Cost of Living",
    text: "The cost of living in Singapore is increasing at a rate far faster than salary adjustments, deliberately widening the wealth gap.",
  },
  {
    id: "E4",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Cost of Living",
    text: "New HDB estates built on former cemeteries (e.g., Bidadari) are haunted or bring bad luck — and the government deliberately conceals this historical background from buyers.",
  },

  // Elite Exploitation
  {
    id: "C12",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "The wealthy elite secretly manipulate stock markets and financial systems to ensure ordinary people can never accumulate enough wealth to challenge them.",
  },
  {
    id: "E5",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "The Singapore government prioritises foreign talent over local workers, suppressing local wages and opportunities for the benefit of multinational corporations.",
  },
  {
    id: "E6",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "Singapore's wealthy elite have secret bunkers in New Zealand and are quietly moving their assets out of Singapore in anticipation of a future collapse or war.",
  },
  {
    id: "E7",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "Marina Bay Sands functions as a secret financial ark for the ultra-wealthy — a structure designed to protect elite assets during a crisis.",
  },

  // Discrimination
  {
    id: "E8",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Discrimination",
    text: "Minorities in Singapore are systematically treated unfairly, with racial and religious discrimination institutionally tolerated and covered up.",
  },
  {
    id: "E9",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Discrimination",
    text: "Singles and LGBTQ+ individuals can only purchase HDB flats at the age of 35 as a deliberate punishment for not conforming to the government's preferred family structure.",
  },

  // ── THEME 5: Geopolitical Maneuvering & Foreign Influence ─────────────────

  // Singapore's Position
  {
    id: "A30",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Singapore's Position",
    text: "Singapore possesses a secret advanced missile defence system similar to Israel's Iron Dome — acquired through covert defence ties with Israel — that the government does not publicly acknowledge.",
  },
  {
    id: "B10",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Singapore's Position",
    text: "Singapore's water agreements with Malaysia involve hidden tensions or secret concessions that are not fully disclosed to the public.",
  },
  {
    id: "G1",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Singapore's Position",
    text: "Tensions between Singapore and Malaysia are manufactured or secretly far more dangerous than what is officially reported — both sides quietly suppress the full picture.",
  },
  {
    id: "A31",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Singapore's Position",
    text: "Singapore has always maintained a Chinese prime minister because there is a genuine fear — kept from public discourse — that neighbouring countries would become hostile if a non-Chinese PM took power.",
  },

  // Foreign Interference
  {
    id: "G2",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Foreign Interference",
    text: "Foreign powers (e.g., China or the US) are deliberately stoking local social friction and racial tensions in Singapore as part of broader information warfare strategies.",
  },
  {
    id: "G3",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Foreign Interference",
    text: "Critics in Singapore who expose US-Israel ties or Singapore's role in them are silenced, discredited, or worse, to protect diplomatic relationships.",
  },
  {
    id: "B4",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Foreign Interference",
    text: "Authorities in Myanmar or Thailand are secretly cooperating with human trafficking and online scam syndicates, rather than genuinely combating them.",
  },

  // Information Warfare
  {
    id: "C22",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Information Warfare",
    text: "Social media algorithms are deliberately designed by powerful foreign interests to radicalise users, create echo chambers, and weaken social cohesion in small nations like Singapore.",
  },
  {
    id: "G4",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Information Warfare",
    text: "The Singapore government is secretly pro-Trump and adjusts its foreign policy and media coverage to align with US political interests.",
  },

  // Great Power Manipulation
  {
    id: "C18",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Great Power Manipulation",
    text: "A shadow government or 'deep state' operates behind the scenes in major countries, making the real decisions regardless of who is elected — and Singapore's foreign policy is shaped by this.",
  },
  {
    id: "C25",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Great Power Manipulation",
    text: "The US government is secretly allied with or controlled by Israel, and Singapore's defence and diplomatic ties to both powers are deeper and more compromising than publicly disclosed.",
  },
  {
    id: "C28",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Great Power Manipulation",
    text: "The initial Hamas attack on Israel in October 2023 was a false flag operation used as a pretext for the subsequent military campaign in Gaza.",
  },
  {
    id: "C26",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Great Power Manipulation",
    text: "The conflict between Iran and Israel is partly staged, and the two countries are secretly cooperating on certain matters behind closed doors.",
  },
];
