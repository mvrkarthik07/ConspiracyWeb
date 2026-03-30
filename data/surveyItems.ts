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

export interface SurveyItemDetail {
  theorySource?: string;       // The original source/origin of the circulating claim
  generalBelief: string;       // Blue — what people believe
  whyBelieve: string;          // Red  — why they believe it
  context: string;             // Green — Singapore-specific examples/context
  verification?: string;       // Fact-check section
  source?: string;             // Academic/news source for the fact-check
}

export interface SurveyItem {
  id: string;
  theme: ThemeId;
  themeLabel: string;
  category: string;
  text: string;
  detail?: SurveyItemDetail;
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
    id: "A1b",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "Spoilt votes in Singapore elections indirectly benefit the PAP by reducing the total valid votes available for opposition parties in closely contested constituencies.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/comments/1kc7n4i/for_oppo_supporters_stuck_with_mosquito_parties/",
      generalBelief: "Among the many political theories that circulate in Singapore, one centres on the role of spoilt votes in elections. Rather than believing that these votes are directly added to the PAP's total, some suggest that spoiling a vote can indirectly increase the PAP's chances of winning. According to this view, spoilt votes reduce the number of valid votes cast for opposition parties, creating a grey zone that may make the PAP's level of support appear stronger than it actually is.",
      whyBelieve: "Part of what makes this theory compelling is how little most voters see of the counting process, which can create uncertainty once ballots are cast. In practice, spoilt votes are ballots where voter intent cannot be clearly determined, and they are excluded from the final vote count. However, a higher number of spoilt ballots can mathematically reduce the pool of votes that opposition parties might otherwise have gained, especially in tighter races.",
      context: "In closely contested constituencies, even a small number of rejected votes can feel significant — especially when emotions flare during elections. When combined with broader scepticism toward a long-dominant political system, and online discussions that amplify anecdotal claims, the idea that spoilt votes may shape outcomes indirectly can start to feel plausible.",
      verification: "Claims that spoilt votes are used in a deliberate or strategic way to benefit the PAP are not supported by verified evidence. Singapore's election process includes established safeguards, such as counting agents from different political parties and clear criteria for determining valid and spoilt ballots. Disputed ballots can also be reviewed during counting.",
      source: "https://www.eld.gov.sg/gazettes/2011/SOP%20for%20Bukit%20Panjang.pdf",
    },
  },
  {
    id: "A3",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "Some opposition parties in Singapore were secretly created or funded by the PAP to split the opposition vote.",
    detail: {
      theorySource: "https://www.reddit.com/r/askSingapore/comments/1k7fa52/what_are_some_wild_election_conspiracies_and/",
      generalBelief: "A recurring theory in Singapore suggests that the People's Action Party (PAP) may secretly fund or support certain opposition parties to create the appearance of a competitive political landscape. According to this narrative, a controlled or weakened opposition could make the PAP appear more credible, competent, and stable by comparison, reinforcing public confidence in its leadership while maintaining overall dominance.",
      whyBelieve: "This idea often appeals to individuals who already perceive Singapore's political system as highly managed or theatrical. The long-standing dominance of a single party can lead some to question how opposition groups sustain themselves financially and politically, especially when they face resource constraints and electoral challenges. Online discussions and anecdotal observations further reinforce this belief, particularly when voters try to make sense of uneven campaign visibility or performance across different constituencies.",
      context: "From time to time, such claims surface in online forums and political discussions, where individuals question how opposition parties fund their activities or why some parties appear less organised or less effective than others. In reality, opposition parties in Singapore rely on member contributions, donations, and volunteer support, similar to political parties in many other countries.",
      verification: "There is no credible evidence to support the claim that the PAP secretly funds opposition parties to enhance its own image. Political party financing in Singapore operates within a regulated framework, and opposition parties function independently with their own leadership and funding sources.",
      source: "https://www.eld.gov.sg/registry.html",
    },
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
    detail: {
      theorySource: "https://www.reddit.com/r/askSingapore/comments/1k7fa52/what_are_some_wild_election_conspiracies_and/",
      generalBelief: "Some believe that the short notice given before GE2025 was a deliberate tactical decision by the PAP to suppress voter turnout — particularly among younger voters, first-time voters, and those who may not have had sufficient time to make informed decisions. According to this view, a rushed election timeline gives opposition parties less time to organise, and gives voters less time to mobilise.",
      whyBelieve: "In Singapore's political context, where the ruling party has significant control over the timing of elections, the decision to call a snap election can easily be interpreted as a strategic move rather than an administrative one. When the announcement comes with a very short campaign period, it can feel to opposition supporters as though the system is deliberately stacked against them.",
      context: "GE2025 was called with a relatively short runway. Critics and online commentators noted that opposition parties had to rapidly organise their candidate slates, campaign materials, and rallies with limited time. Social media discussions highlighted comparisons with previous elections and questioned whether the timing was selected to maximise PAP's incumbent advantage.",
      verification: "Under Singapore's electoral laws, there is no minimum campaign period that must be observed. While the ruling party does have discretion over timing, there is no verified evidence that GE2025's timeline was specifically chosen to suppress voter turnout. Voter turnout in Singapore has historically remained high regardless of campaign duration.",
    },
  },
  {
    id: "A3b",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "Electoral Manipulation",
    text: "Chee Soon Juan was planted by the PAP to discredit the Singapore Democratic Party (SDP) from within.",
    detail: {
      theorySource: "https://www.asiaone.com/singapore/criticise-first-copy-later-chee-soon-juan-accuses-pap-adopting-sdps-policy-ideas",
      generalBelief: "A lesser-known political conspiracy theory in Singapore suggests that Chee Soon Juan was deliberately 'planted' by the People's Action Party (PAP) to weaken or discredit the Singapore Democratic Party (SDP). According to this narrative, his leadership style, legal troubles, and confrontational approach to politics are not coincidental, but instead part of a broader strategy to make the opposition appear less credible or less electable in the eyes of the public.",
      whyBelieve: "This theory often appeals to those who already view Singapore's political landscape as tightly controlled. Chee Soon Juan has had a long and highly contentious political career, including multiple legal disputes and public controversies, which some interpret as unusually damaging for an opposition figure. Online discussions and political echo chambers may further amplify these suspicions, especially when events are viewed selectively or without broader context.",
      context: "Chee Soon Juan became a prominent figure in the Singapore Democratic Party in the early 1990s and later assumed leadership of the party. Over the years, he has been involved in high-profile legal cases and political disputes, which have shaped public perceptions of both himself and the SDP. These differing views have contributed to the persistence of theories that attempt to explain his political trajectory in more strategic or conspiratorial terms.",
      verification: "There is no credible evidence to support the claim that Chee Soon Juan was planted by the PAP to undermine the Singapore Democratic Party. His political career, including his actions, positions, and challenges, is well documented and can be explained by known political, legal, and social factors.",
      source: "https://www.academia.sg/wp-content/uploads/2020/06/Loke-2019-First-Wave.pdf",
    },
  },

  // PAP Power Plays
  {
    id: "A5",
    theme: "political",
    themeLabel: "Covert Political Engineering by the Powerful",
    category: "PAP Power Plays",
    text: "Opposition-held wards in Singapore are deliberately given less government funding and resources compared to PAP-held wards — as seen in Hougang and Potong Pasir.",
    detail: {
      theorySource: "https://geraldgiam.sg/2010/07/opposition-wards-achieve-more-with-less/",
      generalBelief: "A long-standing political belief in Singapore is that constituencies held by the opposition, particularly Hougang and Potong Pasir, were intentionally deprived of resources or upgrades as a way to 'punish' voters for not supporting the People's Action Party (PAP). In this narrative, public housing upgrades, estate improvements, and funding for local projects are seen not just as policy decisions, but as tools that could be used to signal consequences for electoral choices.",
      whyBelieve: "This belief is shaped in part by visible differences that residents and observers have noticed over the years. Compared to PAP-held wards, opposition constituencies were sometimes perceived as receiving fewer or slower upgrades. Political messaging has also played a role — in the past, statements by leaders linking estate upgrading to electoral support have been interpreted by some as confirmation that resources may be distributed strategically.",
      context: "Potong Pasir, long held by opposition figure Chiam See Tong, and Hougang, a stronghold of the Workers' Party, are often cited as examples. In earlier decades, both areas were frequently compared to neighbouring PAP wards in terms of estate upgrading and amenities. Critics pointed to delays or differences in programmes as evidence of political bias.",
      verification: "The idea that opposition wards were deliberately 'punished' is debated and rooted partly in historical policy approaches rather than proven covert intent. There were periods when estate upgrading programmes were explicitly tied to voting patterns. However, over time, policies have shifted towards a more standardised and needs-based approach.",
      source: "https://www.channelnewsasia.com/singapore/explainer-perennial-issue-public-funding-upgrading-works-in-opposition-wards-5696406",
    },
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
    detail: {
      theorySource: "https://www.straitstimes.com/opinion/revisiting-operation-coldstore",
      generalBelief: "Some believe that Operation Coldstore, which involved the arrest of more than 100 individuals under the guise of national security, was not solely about countering communist threats. Instead, these narratives suggest that it was strategically used to weaken or eliminate political opponents, particularly those aligned with left-wing movements, thereby consolidating power for the ruling leadership.",
      whyBelieve: "This theory persists partly because of the political context of the time, when Singapore was facing real concerns about communist influence, but also intense political rivalry. The arrests included not only alleged communist sympathisers but also prominent opposition figures and activists, raising questions about whether the operation blurred the line between security and political control. The use of detention without trial further deepens scepticism, as it limits public access to evidence and due process.",
      context: "Operation Coldstore took place in February 1963, leading to the arrest of over 100 people, including trade unionists, student leaders, and political figures from opposition groups such as the Barisan Sosialis. The official justification was to curb a communist network that was seen as a threat to Singapore's stability. However, critics point out that many of those detained were also key political rivals.",
      verification: "Whether Operation Coldstore was primarily a security measure or a political strategy remains a subject of ongoing debate rather than a settled fact. There is historical evidence that communist influence was a genuine concern at the time, supported by intelligence from both local and international sources.",
      source: "https://dr.ntu.edu.sg/entities/publication/37c2c7a1-727f-41fc-9dac-5ed423aec676",
    },
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
    detail: {
      theorySource: "https://www.facebook.com/CriticalSpectator/posts/so-iswaran-was-sentenced-to-12-months-more-than-the-prosecution-wantedlooks-like/1089689959181261/",
      generalBelief: "Following the legal case involving S. Iswaran, some conspiracy theories have emerged suggesting that he received a lighter sentence, or that mitigating factors such as health conditions were exaggerated or fabricated, due to his past connections with the PAP. In more extreme versions, these claims extend to the idea that he may possess sensitive information, which allegedly influenced how his case was handled.",
      whyBelieve: "Such theories often arise in high-profile cases involving political figures, where public expectations of accountability are especially high. When outcomes appear less severe than expected, some individuals may interpret this as evidence of unequal treatment. Limited public access to full medical or legal details can create gaps in understanding, which speculation may fill.",
      context: "In the case of S. Iswaran, public attention has focused on the legal proceedings, sentencing decisions, and any mitigating factors presented during the case, including health considerations. Some online discussions have questioned whether these factors were given undue weight or whether the outcome reflects broader systemic bias.",
      verification: "There is no credible evidence to support claims that S. Iswaran received preferential treatment or benefited from undisclosed influence due to political connections. Legal proceedings in Singapore follow established judicial processes, where sentencing takes into account factors such as the nature of the offence, precedents, and mitigating circumstances.",
      source: "https://www.straitstimes.com/singapore/why-was-iswaran-handed-a-one-year-jail-sentence",
    },
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
    detail: {
      theorySource: "https://www.channelnewsasia.com/singapore/cop-report-wp-implications-politics-opposition-party-analysis-2492246",
      generalBelief: "A theory circulating in Singapore suggests that the investigations involving Raeesah Khan and Pritam Singh were not solely about alleged procedural or legal breaches, but were strategically orchestrated to weaken the Workers' Party. According to this narrative, the timing, intensity, and publicity of the investigations were designed to damage the party's credibility, disrupt its leadership, and discourage public support.",
      whyBelieve: "This theory appeals to those who view Singapore's political landscape as tightly controlled, with opposition parties constantly under scrutiny, as well as strong supporters of the Workers' Party who may feel anger at the outcome. The prominence of the Workers' Party as the main opposition, coupled with high-profile controversies involving its key figures, makes it a natural target for speculation.",
      context: "Raeesah Khan resigned from Parliament in 2021 following admissions of untruths, while Pritam Singh faced intense scrutiny regarding the party's internal management. The overlap of timing with political developments and media coverage has been highlighted by theorists as suspicious, although official sources maintain that investigations were conducted according to legal and parliamentary procedures.",
      verification: "While the theory suggests that investigations were strategically orchestrated, official records indicate that the proceedings were conducted according to established legal and parliamentary procedures. No verifiable evidence has emerged to indicate external coordination aimed at undermining the party.",
      source: "https://www.channelnewsasia.com/singapore/raeesah-khans-lie-timeline-events-leading-up-findings-parliaments-privileges-committee-5625541",
    },
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
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "Lee Kuan Yew is not actually dead, but has been cryogenically preserved in a secret facility, with plans to revive him in the future.",
    detail: {
      theorySource: "No clear conspiracy theory source — cryogenics commonly cited as preservation method for deceased celebrities: https://www.cryonicsarchive.org/library/myths-about-cryonics/",
      generalBelief: "A conspiracy theory circulating online claims that Lee Kuan Yew, Singapore's founding Prime Minister, is not actually dead but has been cryogenically frozen in a secret facility, with plans to revive him in the future. Proponents suggest that his death in 2015 was staged publicly, and that Singapore's leadership or elite institutions are preserving him for strategic, scientific, or symbolic purposes.",
      whyBelieve: "This theory appeals to those fascinated by secret government operations, advanced technology, or the idea of controlling historical legacies. Lee Kuan Yew's towering influence over Singapore and the sudden publicised nature of his death make some people sceptical of official narratives. Popular culture references to cryonics, combined with online misinformation, reinforce the perception that highly prominent figures could be preserved secretly.",
      context: "Lee Kuan Yew passed away on 23 March 2015, with extensive media coverage and a national funeral attended by world leaders. Supporters of the conspiracy point to the rapid funeral arrangements, strict media guidelines, and limited public access to certain aspects of his funeral as 'suspicious' signs. Social media discussions sometimes highlight these events as evidence that his death may have been staged to maintain political stability.",
      verification: "Official records, government statements, and media reports confirm that Lee Kuan Yew passed away from natural causes. His body was cremated, and his ashes were interred at Mandai Columbarium in Singapore. There is no credible evidence or verified source supporting claims of cryogenic preservation. Authorities, historians, and journalists consistently treat these claims as unfounded.",
      source: "https://www.straitstimes.com/singapore/pm-lee-declares-7-day-period-of-national-mourning-to-mark-mr-lee-kuan-yews-death",
    },
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
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Covered Incidents",
    text: "Lee Hsien Loong's first wife did not die from natural medical causes; her death under suspicious circumstances may have involved pressures or hidden factors that were never publicly disclosed.",
    detail: {
      theorySource: "https://www.sammyboy.com/threads/death-of-a-wife-and-the-profound-impact-on-modern-s%E2%80%99pore-history.234029/",
      generalBelief: "A conspiracy theory circulating in Singapore claims that Lee Hsien Loong's (LHL) first wife, Wong Ming Yang, died by suicide under suspicious circumstances rather than from personal or health struggles. Proponents suggest that her death may have involved external pressures or hidden family or political factors that were not publicly disclosed.",
      whyBelieve: "This theory appeals to those who are sceptical of official accounts and curious about the private lives of high-profile political figures. The limited public information about Wong Ming Yang's death, combined with the prominence of LHL as Singapore's Prime Minister, encourages speculation. Social media discussions and selective interpretation of family or political timelines reinforce the perception that the circumstances surrounding her death may have been concealed.",
      context: "Wong Ming Yang passed away in 1982, shortly after her marriage to LHL. Media coverage at the time was minimal, and the family has maintained privacy regarding the circumstances. The lack of detailed reporting and the high-profile status of LHL contribute to speculation that her death may have been connected to pressures associated with political life, though no direct evidence supports such claims.",
      verification: "Official accounts and statements from the family indicate that Wong Ming Yang's death was a personal tragedy, and there is no verified evidence to suggest foul play or external involvement. The family's decision to maintain privacy is consistent with cultural norms around mourning and sensitive personal matters. Speculative claims circulating online are not substantiated by credible sources.",
      source: "https://wiki.sg/p/Death_of_Wong_Ming_Yang_(1982)",
    },
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
    detail: {
      theorySource: "https://singaporelifetimes.blogspot.com/2008/03/conspiracy-theories.html",
      generalBelief: "A circulating claim in Singapore suggests that Mas Selamat, the Jemaah Islamiyah militant who escaped from detention in 2008, was killed while in custody, rather than having genuinely escaped. According to this narrative, authorities allegedly eliminated him to prevent further security risks or to close a sensitive chapter in Singapore's counter-terrorism history.",
      whyBelieve: "This theory appeals to those who are sceptical of official narratives, especially given Singapore's reputation for strict law enforcement and tight control over sensitive information. The sudden disappearance of Mas Selamat from public attention after his recapture, limited transparency about his detention conditions, and the high-profile nature of his escape make the story susceptible to speculation.",
      context: "Mas Selamat escaped from the Whitley Road detention centre in 2008, triggering a massive manhunt that lasted over a month. He was recaptured in Malaysia and returned to Singapore, after which public information about his whereabouts and condition became scarce. The lack of updates, combined with heightened public interest, has fuelled theories about his fate.",
      verification: "Official sources, including the Singapore Prison Service and the Internal Security Department, maintain that Mas Selamat remained in secure detention following his recapture. No evidence has been presented to suggest that he was killed, and authorities emphasise that the lack of public updates is standard for high-security detainees.",
      source: "https://www.reuters.com/article/economy/malaysia-imprisons-singapore-radical-mas-selamat-idUSKLR282229/",
    },
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
    detail: {
      theorySource: "https://en.wikipedia.org/wiki/Bukit_Ho_Swee_fire",
      generalBelief: "A circulating belief in Singapore claims that the 1961 Bukit Ho Swee fire, which destroyed thousands of homes and displaced many residents, was deliberately engineered rather than accidental. Proponents suggest that the fire was orchestrated to accelerate the clearance of squatter settlements and enable government-led urban redevelopment.",
      whyBelieve: "This theory appeals to those who are sceptical of official narratives, especially given the dramatic speed at which the fire spread and the subsequent rapid resettlement of residents into public housing. Some believe that the scale of destruction, combined with the government's quick response in relocating affected communities, indicates that the event may have been used to serve political or urban planning objectives.",
      context: "The Bukit Ho Swee fire occurred on 25 May 1961 and destroyed more than 2,800 homes in the squatter settlement, leaving over 16,000 people homeless. The tragedy prompted the Housing and Development Board (HDB) to accelerate the construction of public housing in the area. While some critics view the timing and scale of the redevelopment as suggestive of ulterior motives, official accounts attribute the fire to accidental causes.",
      verification: "Official investigations and historical records indicate that the Bukit Ho Swee fire was accidental, with no credible evidence of deliberate engineering. Authorities attribute the disaster to unsafe building materials and high-density living conditions typical of squatter settlements at the time.",
      source: "https://www.nlb.gov.sg/main/article-detail?cmsuuid=8a0ca033-7b44-47a1-b4cd-f841debdf6db",
    },
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
    detail: {
      theorySource: "No clear conspiracy theory source",
      generalBelief: "A conspiracy theory circulating in Singapore claims that the arrest and prosecution of a River Valley High School student who killed his schoolmate was a scapegoat incident — i.e., that authorities singled him out to serve as an example or to divert attention from larger systemic issues rather than because of the merits of the case.",
      whyBelieve: "This theory appeals to people who are sceptical of official narratives around youth crime and school safety, and who believe that a high-profile case like this might be used to symbolically show authority, deter broader concerns, or manage public perception. The prominence of the school, the youth of those involved, and the intense media coverage have fuelled speculation that the student was disproportionately targeted or portrayed to achieve a broader social message.",
      context: "In July 2021, a 16-year-old Secondary Four student attacked and killed a 13-year-old classmate, Ethan Hun Zhe Kai, with a combat axe on River Valley High School premises. The case was widely reported: the offender pleaded guilty to culpable homicide (a reduced charge), and in December 2023 was sentenced to 16 years' imprisonment. He later lost an appeal against his sentence in October 2024.",
      verification: "Officially, the case was handled according to Singapore's legal processes. Police arrested the student based on evidence of the offence in a school toilet, and prosecutors pursued charges after investigation. The High Court imposed a 16-year jail term, with the Court of Appeal later upholding this sentence. There is no credible evidence that the arrest was a scapegoating tactic.",
      source: "https://www.straitstimes.com/singapore/courts-crime/court-of-appeal-upholds-16-years-jail-for-teen-who-killed-river-valley-high-schoolmate-with-axe",
    },
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
    detail: {
      theorySource: "https://www.reddit.com/r/askSingapore/comments/1gn51np/would_working_in_a_government_sector_affect_bto/",
      generalBelief: "A common belief claims that civil servants in Singapore are given preferential treatment when it comes to Housing & Development Board (HDB) Build-To-Order (BTO) flats. According to this narrative, government employees are able to secure units more easily or receive priority in the ballot process, giving them an advantage over ordinary citizens.",
      whyBelieve: "This theory often resonates because civil servants, by virtue of their stable employment and familiarity with government processes, may appear better positioned to navigate BTO applications. When high-demand flats sell out quickly, it can create a perception that certain groups are favoured. Past anecdotes or rumours shared online about successful applications by civil servants can further reinforce the belief.",
      context: "HDB BTO exercises are conducted through a lottery system where applicants are assigned a random queue number, and flats are allocated according to eligibility criteria such as family nucleus, first-timer status, and income ceilings. While civil servants may benefit indirectly from stable incomes or work schedules that make application planning easier, there is no official policy granting them priority in balloting.",
      verification: "There is no credible evidence to suggest that civil servants are given priority in HDB BTO balloting. The system is designed to be random and fair, with clear eligibility rules and public oversight.",
      source: "https://www.mnd.gov.sg/newsroom/speeches/view/written-answer-by-ministry-of-national-development-on-randomised-balloting-process-for-hdb-bto-flats-for-first-time-applicants",
    },
  },
  {
    id: "A39",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Institutional Bias",
    text: "The vaping ban in Singapore is not about public health — it was introduced to protect cigarette tax revenue, which would be threatened by cheaper alternatives.",
    detail: {
      theorySource: "https://www.nus.edu.sg/uhc/articles/details/debunking-law-related-mistruths-regarding-vaping",
      generalBelief: "A theory surrounding Singapore's vaping regulations suggests that the ban on e-cigarettes is not primarily motivated by public health concerns, but rather by the government's interest in protecting cigarette tax revenue. According to this view, allowing vaping as a legal alternative could reduce cigarette consumption, lowering tax income from traditional tobacco products.",
      whyBelieve: "People may find this theory plausible because governments worldwide often face the tension between public health and revenue streams. Singapore levies significant taxes on cigarettes, making tobacco a substantial source of income. The timing and strictness of vaping regulations can appear inconsistent when compared to other public health policies.",
      context: "In Singapore, the sale, distribution, and possession of vaping products have been strictly prohibited since 2018, with the official justification being health risks. Critics, however, point out that cigarettes remain legal and heavily taxed. Comparisons with other countries that regulate vaping differently — allowing controlled use as a harm-reduction strategy — have further fuelled discussion.",
      verification: "There is no verified evidence that Singapore's vaping ban was implemented primarily to protect cigarette tax revenue. Government statements consistently emphasise public health risks, including the potential for nicotine addiction and lung-related illnesses.",
      source: "https://www.channelnewsasia.com/singapore/e-cigarette-vaping-ban-tobacco-tax-4037956",
    },
  },
  {
    id: "A40",
    theme: "secrets",
    themeLabel: "State Secrets and Institutional Cover-Ups",
    category: "Institutional Bias",
    text: "Unemployment rates and happiness index scores published by the government are deliberately inflated or manipulated to maintain a positive national image.",
    detail: {
      theorySource: "No clear conspiracy theory source",
      generalBelief: "A conspiracy theory circulating in Singapore claims that official unemployment rates, national Happiness Index scores, and air quality data are manipulated or suppressed. According to this narrative, authorities allegedly adjust these figures to present a more favourable image of the country's economic stability, societal well-being, or environmental performance, particularly during periods of public concern or policy scrutiny.",
      whyBelieve: "This theory appeals to those who are sceptical of government transparency and official statistics. People sometimes notice discrepancies between official reports and personal or community experiences, such as friends struggling to find jobs despite low unemployment figures, or haze events seeming worse than reported. Online discussions and social media commentary can amplify these perceptions.",
      context: "Singapore's official unemployment rates often appear low, even during global economic shocks, and the World Happiness Report ranks Singapore relatively high compared with some indicators of social stress. During haze episodes affecting air quality, some residents have noted differences between official Pollutant Standards Index (PSI) readings and on-the-ground experiences. These observations have fuelled speculation that figures may be 'faked' or suppressed.",
      verification: "Government agencies in Singapore, such as the Ministry of Manpower and the National Environment Agency, publish data based on established statistical and scientific methodologies. Independent audits, academic studies, and cross-referencing with international datasets indicate that Singapore's reported figures are credible. Discrepancies between official figures and personal perception are typically due to methodological limitations, timing, or localised variations — not intentional data manipulation.",
      source: "https://www.ceicdata.com/en/indicator/singapore/unemployment-rate",
    },
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
    detail: {
      theorySource: "https://www.channelnewsasia.com/singapore/preliminary-assessment-48-year-old-man-stroke-not-caused-covid-19-vaccine-jab-cgh",
      generalBelief: "A conspiracy theory circulating in Singapore suggests that COVID-19 vaccines can cause strokes, and that this risk is being downplayed or concealed by health authorities and pharmaceutical companies. According to this narrative, recommendations for vaccination may be influenced by unseen motivations, such as maintaining public confidence in national vaccination programmes or protecting the interests of the healthcare and pharmaceutical sectors.",
      whyBelieve: "This belief often stems from concerns about vaccine safety, especially when reports of adverse events surface online or through word of mouth. In a context where healthcare decisions are closely tied to personal well-being, even rare medical incidents can feel significant. Combined with broader discussions about healthcare costs and trust in institutions, some individuals may question whether all risks are fully disclosed, particularly when vaccines are promoted at a national level.",
      context: "During Singapore's COVID-19 vaccination rollout, isolated reports of strokes and other serious conditions following vaccination gained attention on social media. These cases were sometimes interpreted as evidence of a causal link, especially when they involved otherwise healthy individuals. Given Singapore's widespread access to advanced medical care and a highly visible national vaccination programme, such incidents can quickly become focal points for speculation about whether medical risks are being understated.",
      verification: "Health authorities in Singapore, including the Ministry of Health and the Health Sciences Authority, have consistently stated that COVID-19 vaccines approved for use are safe and effective, with benefits outweighing the risks. While rare adverse events, such as specific clotting conditions, have been identified and publicly communicated, there is no credible evidence that COVID-19 vaccines directly cause strokes at a population level. Reported cases are carefully investigated, and findings are transparently shared.",
      source: "https://www.factually.gov.sg/corrections-and-clarifications/factually150421/",
    },
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
    detail: {
      theorySource: "https://www.thedailynexus.com/2015-05-07/the-threat-of-holistic-medicine/",
      generalBelief: "A conspiracy theory circulating globally and occasionally discussed in Singapore claims that scientists who discover genuine cures for cancer or chronic diseases are silenced, discredited, or even killed by powerful pharmaceutical companies or government actors. According to this narrative, these groups allegedly prioritise long-term profit from ongoing treatments over one-time cures, and therefore suppress breakthroughs that could disrupt existing healthcare markets.",
      whyBelieve: "This belief often stems from frustration and fear surrounding serious illnesses such as cancer, where treatments can be prolonged, costly, and emotionally taxing. In Singapore, where healthcare costs and long-term disease management are ongoing concerns, the idea that cures might exist but are withheld can feel compelling. Stories of patients undergoing extended treatment, combined with mistrust of profit-driven industries, can reinforce the perception that financial incentives may influence medical decisions. Online anecdotes and viral claims about 'miracle cures' being suppressed further deepen these suspicions.",
      context: "These claims are often linked to stories of alternative treatments or individual researchers who allegedly developed breakthrough cures but faced rejection from the medical community. In Singapore, such narratives may surface in discussions about cancer treatments, chronic disease management, or high medical expenses. Some sceptics point to the continued reliance on therapies like chemotherapy or long-term medication as evidence that more definitive cures are not being pursued or disclosed.",
      verification: "There is no credible evidence that scientists who discover cures are systematically silenced or harmed. Medical research operates within a global, highly scrutinised system involving universities, independent researchers, and international collaborations, making large-scale suppression extremely unlikely. While pharmaceutical companies are profit-driven, they also invest heavily in research and have strong incentives to develop effective and curative treatments.",
      source: "https://www.nas.gov.sg/archivesonline/data/pdfdoc/20100720004/press_release_-_astar_scientists_score_hat-trick_against_cancer_-_final.pdf",
    },
  },

  // Scientific Deception
  {
    id: "C14",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "Climate change is exaggerated or fabricated by scientists and governments for political and economic control — even despite Singapore's own rising temperatures.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/comments/... Chemtrails conspiracy theories in Singapore : r/singapore",
      generalBelief: "A conspiracy theory circulating globally and in Singapore claims that climate change is exaggerated — or even fabricated — by governments, scientists, and environmental organisations to control populations, justify regulations, or drive profit through green technologies. According to this narrative, warnings about rising temperatures, extreme weather, and environmental risks are deliberately overstated to influence behaviour, policy, and economic systems.",
      whyBelieve: "This belief appeals to those who are sceptical of official narratives and distrust institutions perceived as having political or economic motives. In Singapore, where the climate is already hot and humid year-round, some may view warnings about global warming as irrelevant or overstated. Conflicting media reports, shifting scientific projections, or policy measures such as carbon taxes can reinforce doubts, making people question whether climate science is fully objective or selectively framed.",
      context: "In Singapore, rising temperatures and occasional haze episodes highlight environmental challenges, yet conspiracy theorists sometimes interpret government climate initiatives — like promoting sustainable energy, green buildings, or carbon offsets — as mechanisms of control rather than genuine responses to environmental change. International reports on global sea level rise or temperature spikes are sometimes presented online alongside claims of exaggeration, contributing to local scepticism.",
      verification: "Climate change is supported by overwhelming scientific evidence showing long-term increases in global temperatures, rising sea levels, and more frequent extreme weather events. Singapore recognises these challenges through agencies like the National Environment Agency, which monitor temperature, rainfall, and air quality, and develop mitigation strategies. There is no credible evidence that climate change itself is fabricated or exaggerated for control.",
      source: "https://www.mss-int.sg/docs/default-source/v3_reports/v3-stakeholder-report_20240306.pdf",
    },
  },
  {
    id: "C24",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "GMO (genetically modified) foods are harmful to human health, despite what scientists and regulatory bodies claim.",
    detail: {
      theorySource: "https://forums.hardwarezone.com.sg/search/17392683/%3Fq%3DGMO%2Bsafety",
      generalBelief: "A conspiracy theory circulating globally and present in Singapore suggests that GMOs are unsafe for consumption, and that potential health risks are being downplayed or concealed by scientific institutions, governments, and large agricultural or biotechnology companies. According to this narrative, GMOs are promoted not purely for food security or innovation, but to serve commercial interests, with long-term health effects allegedly hidden from the public.",
      whyBelieve: "This belief often stems from broader concerns about food safety, health, and corporate influence. In Singapore, where food is largely imported and trust in supply chains is essential, uncertainty about how food is produced can heighten scepticism. The idea of altering genetic material may feel unnatural to some, and conflicting information online can reinforce doubts. Combined with general concerns about profit-driven industries, some individuals may question whether scientific consensus fully reflects public health interests.",
      context: "GMO-related discussions in Singapore typically emerge around imported food products, labelling transparency, and global debates about agricultural practices. Some sceptics point to international controversies, such as debates over pesticide use or corporate control of seeds, and apply these concerns locally. Social media posts and documentaries sometimes highlight alleged health risks or environmental consequences, which can influence perceptions even in the absence of direct local incidents.",
      verification: "Singapore's food safety is regulated by the Singapore Food Agency, which assesses GMOs based on international scientific standards before approval. Global scientific consensus, supported by organisations such as the World Health Organization and the Food and Agriculture Organization, indicates that approved GMOs are safe for consumption. There is no credible evidence that health risks are being systematically hidden.",
      source: "https://www.gmac.sg/guidelines/",
    },
  },
  {
    id: "C24b",
    theme: "science",
    themeLabel: "Hidden Motives Behind Science and Medicine",
    category: "Scientific Deception",
    text: "Mainstream nutritional guidelines are deliberately designed to keep people unhealthy and dependent on medication, benefiting the food and pharmaceutical industries.",
    detail: {
      theorySource: "https://www.medicalrepublic.com.au/face-fats-whats-science-dietary-guidelines/1520",
      generalBelief: "A conspiracy theory circulating globally and occasionally in Singapore claims that mainstream nutritional guidelines are intentionally misleading, designed to keep people unhealthy and reliant on long-term medication. According to this narrative, governments, health authorities, and industry players allegedly promote certain diets not purely for public health, but to sustain demand for pharmaceuticals and processed food products.",
      whyBelieve: "This belief often arises from confusion over evolving dietary advice and frustration with persistent health issues such as diabetes and heart disease. In Singapore, where public health campaigns actively shape dietary habits, individuals may question why such conditions remain prevalent. Exposure to conflicting nutrition trends online, combined with personal experiences, can lead some to doubt whether official guidelines truly prioritise well-being. Concerns about profit-driven industries further reinforce the perception that recommendations may be influenced by commercial interests.",
      context: "Singapore's dietary guidelines promote balanced meals, reduced sugar intake, and healthier lifestyle choices through national campaigns. However, sceptics sometimes point to rising rates of chronic illnesses despite these efforts, interpreting this as evidence that guidelines are ineffective or misleading. Shifts in global nutrition advice — such as changing views on fats, carbohydrates, or processed foods — can also be seen as inconsistencies that fuel suspicion about underlying motives.",
      verification: "Singapore's nutritional guidelines are developed based on scientific research and are regularly updated to reflect new evidence. Agencies such as the Health Promotion Board rely on clinical studies, population health data, and international standards. While industries involved in food and healthcare are profit-driven, there is no credible evidence that nutritional guidelines are intentionally designed to harm public health or create dependency on medication.",
      source: "https://www.moh.gov.sg/newsroom/update-on--my-healthy-plate--guidelines-for-ultra-processed-food-consumption-tracking-and-health-impact-among-singaporeans/",
    },
  },
  {
    id: "C24c",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "Yishun has unusually high rates of crime and bizarre behaviour because of secret government testing, bad Feng Shui, or some other hidden force that the authorities conceal.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/... / 'cursed neighbourhood': https://www.taipeitimes.com/News/feat/archives/2019/01/20/2003708250",
      generalBelief: "A popular urban conspiracy in Singapore suggests that Yishun is the country's equivalent of 'Area 51,' where unusual incidents, crimes, or behaviours are believed to stem from hidden causes such as bad feng shui or even secret government activities. According to this narrative, the area's reputation is not coincidental, but the result of deeper, unseen forces or experiments that affect residents in subtle ways.",
      whyBelieve: "This belief is often fuelled by the clustering of high-profile or unusual incidents in Yishun that gain widespread attention online. In a highly connected society, repeated exposure to such stories can create a perception that the area is uniquely different. Cultural beliefs in feng shui, combined with curiosity about whether authorities may be withholding information, further reinforce speculation. The contrast between Singapore's generally orderly image and the narratives associated with Yishun also makes the theory compelling to some.",
      context: "Over the years, Yishun has been linked in public discourse to a series of widely reported crimes, unusual events, and viral social media stories. These incidents are often compiled and shared online, creating a pattern that some interpret as more than coincidence. Others point to the town's layout, history, or demographic mix as possible explanations, while more extreme theories suggest secret testing or environmental factors influencing behaviour.",
      verification: "There is no credible evidence that Yishun is the site of secret government testing or that feng shui factors are causing abnormal behaviour. Authorities treat incidents in the area as individual cases, investigated and addressed through standard law enforcement processes. Studies of crime patterns show that perceived 'clusters' can emerge due to media amplification and confirmation bias. The reputation of Yishun as an 'Area 51' is best understood as an internet-driven narrative rather than a reflection of verified reality.",
      source: "https://www.straitstimes.com/singapore/netflix-shows-yishun-in-stranger-things-promotional-video",
    },
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
    detail: {
      theorySource: "https://forums.hardwarezone.com.sg/threads/any-bidadari-bto-ghost-stories.6098742/page-2",
      generalBelief: "A belief sometimes framed as a conspiracy in Singapore suggests that newer housing estates built on former cemeteries are haunted or bring bad luck, and that the government downplays or conceals this history to encourage public acceptance. According to this narrative, redevelopment projects may overlook or suppress the spiritual or cultural significance of these sites in favour of urban expansion.",
      whyBelieve: "This belief is closely tied to cultural attitudes toward death, ancestry, and respect for burial grounds. In a society where traditions and spiritual beliefs still hold meaning for many, the idea of living on former cemeteries can feel unsettling. When combined with limited public familiarity with the full history of certain sites, some individuals may perceive a lack of transparency and suspect that authorities are intentionally minimising such histories to avoid affecting housing demand or public sentiment.",
      context: "Bidadari was historically the site of a large cemetery before being redeveloped into a residential estate. While this transformation has been publicly documented, discussions online often revisit its past, linking it to stories of hauntings, unexplained occurrences, or 'bad energy.' Similar narratives have been associated with other redeveloped areas in Singapore, where former burial grounds or kampungs have made way for modern housing.",
      verification: "There is no credible evidence that estates built on former cemeteries are inherently haunted or bring bad luck. Redevelopment histories, including Bidadari's past as a cemetery, have been publicly acknowledged in planning documents and media coverage. Urban land use in Singapore is carefully managed due to space constraints, and the redevelopment of such sites follows established processes, including exhumation and relocation procedures conducted with religious considerations.",
      source: "https://www.nlb.gov.sg/main/article-detail?cmsuuid=385bbadd-2c16-47e4-ba0d-a59411893d37",
    },
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
    detail: {
      theorySource: "https://www.reddit.com/r/newzealand/comments/... Why are billionaires suddenly obsessed with bunkers in New Zealand? What do they know that we don't?",
      generalBelief: "A conspiracy theory circulating globally and occasionally discussed in Singapore claims that wealthy elites are secretly building bunkers in New Zealand and quietly moving their assets out of countries like Singapore in anticipation of a future collapse, crisis, or war. According to this narrative, these preparations are kept hidden from the public, allowing elites to secure their own safety while ordinary people remain unaware and unprepared.",
      whyBelieve: "This belief often resonates during periods of global uncertainty, such as economic instability, geopolitical tensions, or public health crises. In Singapore, where people are highly attuned to global developments, concerns about vulnerability as a small, interconnected nation can amplify such ideas. The visibility of extreme wealth, combined with reports of luxury properties or overseas investments by high-net-worth individuals, may lead some to suspect that elites are quietly preparing exit strategies that are not accessible to the general population.",
      context: "Online discussions frequently reference reports of wealthy individuals purchasing land or properties in remote, stable locations like New Zealand, sometimes described as 'safe havens.' These narratives are often linked to broader fears about global conflict, climate risks, or economic downturns. In the Singapore context, speculation may arise when there are visible capital outflows, overseas investments, or conversations about diversification, which are then interpreted as signs of an impending crisis.",
      verification: "While it is true that some wealthy individuals globally invest in overseas properties or diversify their assets, there is no credible evidence of a coordinated effort by elites to secretly relocate in anticipation of an imminent collapse or war. Such financial decisions are typically driven by risk management, lifestyle preferences, or investment strategies rather than hidden knowledge of future events. Capital flows and investments in Singapore are subject to regulatory oversight.",
      source: "https://www.legislation.govt.nz/act/public/2005/0082/latest/DLM357161.html",
    },
  },
  {
    id: "E7",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "Marina Bay Sands functions as a secret financial ark for the ultra-wealthy — a structure designed to protect elite assets during a crisis.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/... (search 'MBS ark' in comments): What're some Singapore conspiracy theories you've heard of or can come up with?",
      generalBelief: "A conspiracy theory circulating online suggests that Marina Bay Sands (MBS) is more than just an integrated resort, but is secretly designed to function as a protective 'ark' for the wealthy in times of crisis. According to this narrative, its elevated SkyPark structure, luxury facilities, and self-contained environment are interpreted as features that could allow elites to isolate themselves safely during emergencies, leaving the general population more exposed.",
      whyBelieve: "This belief often resonates with individuals who are sensitive to visible wealth inequality in Singapore. MBS is widely associated with luxury, exclusivity, and high-end experiences, which can reinforce perceptions that it primarily serves affluent groups. In a society where the cost of living is a recurring concern, such stark contrasts may lead some to question whether infrastructure and resources are disproportionately designed to benefit elites. The building's distinctive architecture and scale also make it an easy subject for speculation.",
      context: "MBS features high-security hotel spaces, premium amenities, and an iconic rooftop SkyPark that sits above the city skyline. During global crises such as pandemics, some luxury properties worldwide were perceived as safer or more insulated environments, which fuels the idea that similar spaces could serve protective purposes. Online discussions sometimes draw parallels between MBS and so-called 'elite bunkers' or exclusive shelters, interpreting its design and location as strategic rather than purely commercial.",
      verification: "There is no credible evidence that Marina Bay Sands was designed or intended to function as a secret refuge or 'ark' for the wealthy. The integrated resort was developed primarily as a tourism and entertainment hub, contributing to Singapore's economy through hospitality, retail, and conventions. Its design reflects architectural ambition and commercial goals rather than hidden protective functions.",
      source: "https://www.civildefence.gov.sg/learn/assets/list-of-civil-defence-public-shelter.pdf",
    },
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
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "Singapore possesses a secret advanced missile defence system similar to Israel's Iron Dome — acquired through covert defence ties with Israel — that the government does not publicly acknowledge.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/comments/2cde99/til_singapore_is_the_second_country_after_israel/",
      generalBelief: "A claim circulating online suggests that Singapore possesses a secret missile defence system similar to the Iron Dome, allegedly developed through close ties with Israel. According to this narrative, such a system is kept hidden from the public, providing enhanced protection for key infrastructure and elites, while ordinary citizens remain unaware.",
      whyBelieve: "This belief resonates with individuals who are aware of Singapore's strong emphasis on national security and its historically close defence relationships with advanced military partners. The idea that a small, highly developed nation might possess sophisticated, undisclosed capabilities can feel plausible, especially when combined with general perceptions that governments may not reveal all aspects of their defence systems.",
      context: "Singapore has openly invested in advanced air defence systems, such as the SPYDER air defence system and ASTER 30, which are publicly acknowledged. Its defence ties with Israel are also well-documented historically. However, speculation arises when people extend these known facts to suggest the existence of more advanced or hidden systems comparable to Iron Dome.",
      verification: "Singapore's air defence capabilities are periodically disclosed through official channels, and there is no credible evidence that it operates a secret Iron Dome-like system. Claims of a hidden, elite-focused missile shield are not supported by verifiable information and are largely based on extrapolation rather than evidence.",
      source: "https://www.mindef.gov.sg/news-and-events/latest-releases/29nov23_fs/",
    },
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
    detail: {
      theorySource: "https://www.channelnewsasia.com/singapore/states-times-review-article-shows-insidious-nature-deliberate-online-falsehoods-edwin-tong-5719426",
      generalBelief: "A claim circulating in Singapore suggests that tensions with Malaysia are either exaggerated for political purposes or far more serious than publicly acknowledged. According to this narrative, both governments may manage narratives about cross-border issues, trade disputes, or security concerns to serve domestic or strategic agendas.",
      whyBelieve: "This belief resonates with Singaporeans because of the country's geographic proximity and historical ties with Malaysia, combined with occasional cross-border disagreements on water, transport, and trade. For a small nation surrounded by a larger neighbour, it is natural to be wary of unseen tensions or unreported conflicts.",
      context: "Instances such as water agreements, Johor-Singapore train projects, and airspace management have occasionally been sources of friction. While official channels frame these as routine negotiations, conspiracy narratives suggest that these issues may be part of larger, hidden power plays or that risks are downplayed to avoid public concern.",
      verification: "There is no credible evidence that tensions with Malaysia are being deliberately exaggerated or secretly more dangerous than reported. Both countries engage in regular diplomatic dialogue, and cross-border issues are managed through established bilateral mechanisms.",
      source: "https://www.straitstimes.com/politics/parliament-curious-spike-in-online-comments-critical-of-spore-during-dispute-with-malaysia",
    },
  },
  {
    id: "A31",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Singapore's Position",
    text: "Singapore has always maintained a Chinese prime minister because there is a genuine fear — kept from public discourse — that neighbouring countries would become hostile if a non-Chinese PM took power.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/comments/ima6y3/what_will_happen_to_singapore_if_the_pm_is/",
      generalBelief: "A theory circulating online suggests that Singapore's neighbouring countries would take hostile action if a non-Chinese Prime Minister were to assume power. According to this narrative, regional powers allegedly monitor leadership changes closely and would exploit any perceived shift in political balance to undermine Singapore's sovereignty.",
      whyBelieve: "This belief resonates with anxieties stemming from Singapore's geographic and demographic context. As a small, multiracial nation surrounded by larger neighbours, some citizens may worry that leadership changes could alter regional dynamics or invite external pressure. Historical sensitivities around race, governance, and national security can amplify such perceptions.",
      context: "Proponents often point to Singapore's reliance on diplomatic ties, trade relations, and security agreements with surrounding countries, suggesting that a non-Chinese PM could be seen as less predictable or influential. Online discussions sometimes reference historical regional tensions or unverified 'leaks' that warn of consequences tied to leadership demographics.",
      verification: "There is no credible evidence that Singapore's neighbours would attack or threaten the country based on the ethnicity of its Prime Minister. Singapore maintains strong diplomatic, trade, and defence relationships with all neighbouring countries, guided by international law and mutual interests.",
      source: "https://lkyspp.nus.edu.sg/docs/default-source/ips/today-online_more-s-poreans-open-to-non-chinese-pm-president-since-2016--cna-ips-survey_020422.pdf",
    },
  },

  // Foreign Interference
  {
    id: "G2",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Foreign Interference",
    text: "Foreign powers (e.g., China or the US) are deliberately stoking local social friction and racial tensions in Singapore as part of broader information warfare strategies.",
    detail: {
      theorySource: "https://www.channelnewsasia.com/singapore/lawrence-wong-disinformation-ai-youtube-campaign-chinese-fake-videos-5949266",
      generalBelief: "A theory circulating in Singapore suggests that foreign powers, such as China or the United States, deliberately foment social friction or political disagreement locally. According to this narrative, online discourse, activism, or community tensions may be influenced or amplified by external actors seeking to destabilise society or shape public opinion.",
      whyBelieve: "This belief resonates because Singapore is a small, interconnected nation with a highly digital society where social issues can spread rapidly. Citizens aware of global geopolitical rivalries may be suspicious that international players are trying to influence domestic narratives. The presence of foreign-funded media or coordinated social media campaigns can reinforce this idea.",
      context: "Examples cited often include online campaigns on social or political topics, viral misinformation, or coordinated narratives that seem to polarise opinion. Some point to global patterns of foreign interference in other countries' elections and societies as evidence that similar tactics could be applied in Singapore.",
      verification: "There is no verified evidence that foreign powers are systematically orchestrating social friction in Singapore. The country maintains robust cybersecurity, media regulation, and public education measures to counter disinformation.",
      source: "https://www.sg101.gov.sg/defence-and-security/current-threats/hics-and-foreign-interference/",
    },
  },
  {
    id: "G3",
    theme: "geopolitical",
    themeLabel: "Geopolitical Maneuvering & Foreign Influence",
    category: "Foreign Interference",
    text: "Critics in Singapore who expose US-Israel ties or Singapore's role in them are silenced, discredited, or worse, to protect diplomatic relationships.",
    detail: {
      theorySource: "https://parstoday.ir/en/news/world-i233922-collusion_with_tel_aviv_while_claiming_neutrality_singapore_has_two_faces_a_narrative_of_dealing_with_critics_of_israel",
      generalBelief: "A claim circulating online suggests that individuals who expose sensitive ties between the United States, Israel, and Singapore are silenced, discredited, or even eliminated. According to this narrative, whistleblowers, journalists, or academics who attempt to reveal these connections face extreme consequences to prevent public awareness.",
      whyBelieve: "This belief often resonates with those already wary of international power dynamics and Singapore's role as a global hub for trade and defence. The secrecy surrounding intelligence, military collaborations, or strategic partnerships can create fertile ground for speculation.",
      context: "Proponents of this theory point to Singapore's defence and technology collaborations with Israel and the United States, as well as its strategic positioning in global trade networks, as potential motives for controlling narratives. Discussions on whistleblower cases in other countries are sometimes invoked as parallels.",
      verification: "There is no credible evidence that Singapore silences or harms individuals for exposing international ties. Singapore maintains strong legal protections for journalists. Claims that critics are targeted for exposing US-Israel ties are speculative and not supported by verifiable information.",
      source: "https://www.factually.gov.sg/corrections-and-clarifications/260326/",
    },
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

  // ── Supernatural / Cultural Beliefs (under Geopolitical as hidden state action) ──

  {
    id: "S1",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "The Singapore government has made secret deals with occultists or spiritual groups to protect the nation from supernatural harm — conducting hidden rituals behind the scenes.",
    detail: {
      theorySource: "https://www.reddit.com/r/singapore/comments/... (see comments): Uniquely Singaporean Conspiracy Theories : r/singapore",
      generalBelief: "A fringe conspiracy theory circulating online suggests that the Singapore government has made secret deals with occult practitioners or spiritual groups to protect the nation from supernatural harm. According to this narrative, unseen rituals or spiritual arrangements are allegedly carried out behind the scenes to ensure protection, stability, or prosperity for key institutions and elites.",
      whyBelieve: "This belief often draws from Singapore's multicultural context, where religious and spiritual practices are visible and widely respected. In a society that values harmony across different faiths, the presence of rituals or blessings in public life can sometimes be misinterpreted. For individuals already curious about what happens behind closed doors, visible practices may be taken further.",
      context: "In Singapore, it is not uncommon for multi-faith blessings or prayers to be conducted during major events, such as building openings or national ceremonies. These are typically symbolic gestures meant to reflect inclusivity and respect for different religious traditions. However, such practices can be misinterpreted as evidence of deeper or secretive spiritual arrangements.",
      verification: "There is no credible evidence that the Singapore government engages in occult practices or makes secret deals for supernatural protection. Publicly observed blessings or multi-faith ceremonies are conducted openly and are cultural or symbolic in nature.",
      source: "https://www.nlb.gov.sg/main/article-detail?cmsuuid=b23d71bf-6324-4f36-ac9a-0f27932a8d90",
    },
  },
  {
    id: "S2",
    theme: "elites",
    themeLabel: "Elites Scheming Against the People",
    category: "Elite Exploitation",
    text: "Singapore's $1 coin was deliberately designed with occult symbols (based on the bagua/Pa Kua) to ward off evil spirits — a hidden spiritual decision made by authorities.",
    detail: {
      generalBelief: "A long-circulating belief in Singapore suggests that the $1 coin was deliberately designed with symbolic features to ward off evil spirits. Some versions frame this as a quiet, behind-the-scenes decision by authorities to protect the nation, particularly during periods of rapid development, where unseen forces were believed to pose a threat to stability or prosperity.",
      whyBelieve: "This belief resonates in a cultural context where feng shui and symbolic meanings remain significant to many. In a highly planned and rapidly modernising society, some individuals may look for deeper explanations behind major decisions, especially when they appear unusually specific or intentional. The idea that leaders might take extra, unseen precautions — whether symbolic or spiritual — can feel plausible.",
      context: "The Singapore $1 coin features an octagonal shape, which some associate with the bagua in feng shui, a symbol believed to offer protection and balance. This has led to speculation that the coin's design was intentionally chosen to counter negative energy. Over time, this interpretation has been widely shared in public discourse and online discussions.",
      verification: "There is no official evidence that the $1 coin was designed specifically to ward off evil spirits. The Monetary Authority of Singapore has explained that the coin's design considerations included practical factors such as usability, recognisability, and distinctiveness. The belief is best understood as a cultural interpretation rather than a confirmed policy decision.",
      source: "https://alvinology.com/2015/02/26/theyallsay-singapore-1-coin-is-a-chinese-ba-gua/",
    },
  },
];
