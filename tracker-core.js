(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SpeakerTrackerCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'speakerTracker:v5';
  const STATUSES = ['Not started', 'Drafting', 'Submitted', 'Accepted', 'Rejected', 'Withdrawn'];

  const MANUAL_OPPORTUNITIES = [
    {
      id: 'data-saturday-denmark-2027', name: 'Data Saturday Denmark 2027', category: 'data and cloud conference',
      eventDate: '2027-01-30', deadlineDate: '2026-11-14', deadlineTimezone: 'Europe/Copenhagen',
      location: 'Microsoft HQ, Kongens Lyngby, Denmark', deliveryMode: 'In-person',
      sourceType: 'Sessionize public CFP', source: 'Official Sessionize CFP', sourceUrl: 'https://sessionize.com/datasatdk-2027/', sourceStatus: 'CFP open', sourceScore: 0.88,
      topics: ['Agentic AI', 'Azure', 'Cloud', 'Data', 'Microsoft Fabric'], audience: ['Developers', 'Architects', 'Data leaders'],
      status: 'Not started', priority: 'High', matchedTalkIds: ['reliable-agentic-workflows'],
      nextAction: 'Adapt the Azure agent workflow talk for a data-platform audience.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'tdx-2027', name: 'TDX 2027', category: 'developer and enterprise AI conference',
      eventDate: '2027-03-10', deadlineDate: '2026-11-16', deadlineTimezone: 'America/Los_Angeles',
      location: 'San Francisco, U.S. · Salesforce+', deliveryMode: 'Hybrid',
      source: 'Official Salesforce CFP announcement', sourceUrl: 'https://developer.salesforce.com/blogs/2026/10/the-tdx-2027-call-for-participation-is-now-open', sourceStatus: 'CFP open', sourceScore: 0.83,
      topics: ['Agentic AI', 'Enterprise AI', 'Developer Tools', 'Platform Engineering'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'Medium', matchedTalkIds: ['human-loop-multi-agent'],
      nextAction: 'Frame the human-in-the-loop story for the agentic enterprise.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'fabcon-sqlcon-2027', name: 'FABCON & SQLCON 2027', category: 'Microsoft data and AI conference',
      eventDate: '2027-03-08', deadlineDate: '2026-11-22', deadlineTimezone: 'America/New_York',
      location: 'Atlanta, Georgia, U.S.', deliveryMode: 'In-person',
      sourceType: 'Sessionize public CFP', source: 'Official Sessionize CFP', sourceUrl: 'https://sessionize.com/fabcon-2027-sqlcon-2027-sessions/', sourceStatus: 'CFP open', sourceScore: 0.84,
      travelSupport: 'Travel sponsored', travelDetails: 'Non-Microsoft community speakers receive 3 hotel nights and a $500 travel stipend, plus a 3-day Gold Pass.',
      topics: ['Azure AI', 'Microsoft Fabric', 'Data', 'AI Engineering'], audience: ['Developers', 'Architects', 'Data leaders'],
      status: 'Not started', priority: 'Medium', matchedTalkIds: ['reliable-agentic-workflows'],
      nextAction: 'Connect the agent demo to Fabric data and Azure AI.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'azureday-poland-2027', name: 'AzureDay Poland 2027', category: 'Azure and AI conference',
      eventDate: '2027-03-11', deadlineDate: '2026-11-30', deadlineTimezone: 'Europe/Warsaw',
      location: 'Warsaw, Poland', deliveryMode: 'In-person',
      sourceType: 'Sessionize public CFP', source: 'Official Sessionize CFP', sourceUrl: 'https://sessionize.com/azureday-poland-2027/', sourceStatus: 'CFP open', sourceScore: 0.97,
      travelSupport: 'Travel sponsored', travelDetails: 'Accepted speakers can receive up to €450 toward transportation and up to 2 hotel nights, if needed.',
      topics: ['Agentic AI', 'Azure', 'Microsoft Foundry', 'Cloud', 'AI Engineering'], audience: ['Developers', 'Architects'],
      status: 'Not started', priority: 'High', matchedTalkIds: ['reliable-agentic-workflows'],
      nextAction: 'Submit the reliable agentic workflows talk with a live Azure demo.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'ai-context-new-york-2027', name: 'AI Context New York', category: 'agentic AI conference',
      eventDate: '2027-03-16', deadlineDate: '2027-01-04', deadlineTimezone: 'America/New_York',
      location: 'New York, U.S.', deliveryMode: 'In-person',
      sourceType: 'Sessionize public CFP', source: 'Official Sessionize CFP', sourceUrl: 'https://sessionize.com/ai-context-ny-co/', sourceStatus: 'CFP open', sourceScore: 0.96,
      travelSupport: 'Not covered', travelDetails: 'The official CFP states that travel and accommodation expenses are not covered.',
      topics: ['Agentic AI', 'Enterprise AI', 'AI Infrastructure', 'Protocols'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'High', matchedTalkIds: ['human-loop-multi-agent'],
      nextAction: 'Position the talk around scaling controlled agent systems in production.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'optimized-ai-conference-2027', name: 'Optimized AI Conference 2027', category: 'applied AI conference',
      eventDate: '2027-03-31', deadlineDate: '2027-02-28', deadlineTimezone: 'America/New_York',
      location: 'Atlanta, Georgia, U.S.', deliveryMode: 'In-person',
      sourceType: 'Sessionize public CFP', source: 'Official Sessionize CFP', sourceUrl: 'https://sessionize.com/OAIConference-2027/', sourceStatus: 'CFP open', sourceScore: 0.95,
      topics: ['Agentic AI', 'LLM Ops', 'RAG', 'AI Engineering'], audience: ['Developers', 'Engineering leaders'],
      status: 'Not started', priority: 'High', matchedTalkIds: ['copilot-to-production'],
      nextAction: 'Develop measurable business outcomes and evaluation examples.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'cloud-code-oost', name: 'Cloud & Code Oost', category: 'developer meetup series',
      eventDate: '2027-02-01', deadlineDate: '2027-09-22', deadlineTimezone: 'Europe/Amsterdam',
      location: 'Doetinchem, Netherlands', deliveryMode: 'In-person',
      sourceType: 'Sessionize public CFP', source: 'Official Sessionize CFP', sourceUrl: 'https://sessionize.com/cloudcodeoost/', sourceStatus: 'Rolling CFP open', sourceScore: 0.9,
      travelSupport: 'Partial / conditional', travelDetails: 'Flights are not covered; hotel coverage depends on the situation. Dinner is provided.',
      topics: ['Agentic AI', 'Azure', 'Cloud', 'Developer Tools', 'Software Architecture'], audience: ['Developers', 'Architects'],
      status: 'Not started', priority: 'Medium', matchedTalkIds: ['reliable-agentic-workflows'],
      nextAction: 'Offer a practical 45-minute Azure agent engineering session.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'datatune-2027-linkedin', name: 'DataTune 2027', category: 'data and AI conference',
      eventDate: '2027-03-12', deadlineDate: '2026-11-15', deadlineTimezone: 'America/Chicago',
      location: 'Nashville, Tennessee, U.S.', deliveryMode: 'In-person', sourceType: 'LinkedIn lead',
      source: 'LinkedIn — DataTune is looking for speakers', sourceUrl: 'https://linkedin.com/company/datatune-conf', sourceStatus: 'Speaker call open', sourceScore: 0.86,
      topics: ['Agentic AI', 'Data', 'AI Engineering', 'Cloud'], audience: ['Developers', 'Data leaders', 'Engineering leaders'],
      status: 'Not started', priority: 'High', matchedTalkIds: ['reliable-agentic-workflows'],
      nextAction: 'Submit a practical data-and-agent implementation story before 15 November.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'dreamole-2027-linkedin', name: 'dreamOlé 2027', category: 'Salesforce developer conference',
      eventDate: '2027-03-12', deadlineDate: '2026-12-15', deadlineTimezone: 'Europe/Madrid',
      location: 'Spain', deliveryMode: 'In-person', sourceType: 'LinkedIn lead',
      source: 'LinkedIn — dreamOlé is looking for speakers', sourceUrl: 'https://www.linkedin.com/posts/dreamole_dreamol%C3%A927-callforspeakers-salesforcedevs-activity-7520757540834492416-9_UM', sourceStatus: 'Speaker call open', sourceScore: 0.8,
      topics: ['Agentic AI', 'Agentforce', 'Data Cloud', 'AI Engineering', 'Architecture'], audience: ['Developers', 'Architects'],
      status: 'Not started', priority: 'Medium', matchedTalkIds: ['human-loop-multi-agent'],
      nextAction: 'Translate the enterprise-agent talk to Agentforce and Data Cloud.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'starwest-2027-linkedin', name: 'STARWEST 2027', category: 'software quality and testing conference',
      eventDate: '2027-09-19', deadlineDate: '2027-01-31', deadlineTimezone: 'America/Los_Angeles',
      location: 'Anaheim, California, U.S. · Online', deliveryMode: 'Hybrid', sourceType: 'LinkedIn lead',
      source: 'LinkedIn — Coveros is looking for STARWEST speakers', sourceUrl: 'https://linkedin.com/company/coveros', sourceStatus: 'Speaker call open', sourceScore: 0.74,
      travelSupport: 'Not covered', travelDetails: 'The official speaker page states that travel expenses are not covered; conference registration is complimentary.',
      topics: ['AI Engineering', 'Evaluation', 'Software Testing', 'Developer Tools'], audience: ['Developers', 'Engineering leaders'],
      status: 'Not started', priority: 'Medium', matchedTalkIds: ['copilot-to-production'],
      nextAction: 'Pitch AI evaluation, guardrails and quality engineering for production copilots.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-10-31'
    },
    {
      id: 'copilotverse-sessionize', name: 'Copilotverse Global User Group', category: 'Microsoft Copilot user group',
      eventDate: '2026-12-18', deadlineDate: '2026-12-18', deadlineTimezone: 'UTC',
      location: 'Online', deliveryMode: 'Online', sourceType: 'Sessionize recommendation',
      source: 'Sessionize Discover — suggested for Iryna', sourceUrl: 'https://community.powerplatform.com/usergroups/details/?groupid=36e9c4e1-fa6b-f011-bec2-6045bdda2e78', sourceStatus: 'Speaker discovery active', sourceScore: 0.94,
      travelSupport: 'Online / no trip', travelDetails: 'Online user group; no travel is required.',
      topics: ['Agentic AI', 'Copilot Studio', 'Copilot Extensibility', 'GitHub Copilot', 'Microsoft 365 Copilot'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'High', matchedTalkIds: ['copilot-to-production'],
      nextAction: 'Contact the user group and offer the production Copilot evaluation talk.', notes: '', submittedAt: '', confirmationReference: '', lastUpdated: '2026-11-07'
    },
    {
      id: 'code-europe-ai-2027', name: 'Code Europe AI 2027', category: 'AI, ML and engineering conference',
      eventDate: '2027-05-01', deadlineDate: '2027-02-01', deadlineTimezone: 'Europe/Warsaw',
      location: 'Poland (city not yet confirmed)', deliveryMode: 'In-person', sourceType: 'Official CFP',
      source: 'Official codeeurope.pl CFP page', sourceUrl: 'https://codeeurope.pl/cfp', sourceStatus: 'CFP open', sourceScore: 0.3,
      travelSupport: 'Not stated', travelDetails: '⚠️ UNVERIFIED — a third-party research digest claimed travel and accommodation are covered with no speaker fee, but the live CFP page does not display a deadline or financial terms. Confirm directly with the organizer before relying on this.',
      topics: ['AI Engineering', 'Cloud / DevOps'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'Low', matchedTalkIds: [],
      nextAction: '⚠️ Event date and CFP deadline are estimates — verify on codeeurope.pl/cfp before preparing a submission.', notes: 'Added from an unverified research digest on 2026-11-26; eventDate and deadlineDate are estimates, not confirmed on the live site.', submittedAt: '', confirmationReference: '', lastUpdated: '2026-11-26'
    },
    {
      id: 'civo-navigate-london-2027', name: 'Civo Navigate London 2027', category: 'cloud and AI sovereignty conference',
      eventDate: '2027-09-29', deadlineDate: '2027-06-01', deadlineTimezone: 'Europe/London',
      location: 'London, U.K.', deliveryMode: 'In-person', sourceType: 'Official CFP',
      source: 'Official civo.com Navigate London CFP page', sourceUrl: 'https://www.civo.com/navigate/london/2027/cfps', sourceStatus: 'CFP open', sourceScore: 0.25,
      travelSupport: 'Not stated', travelDetails: '⚠️ UNVERIFIED — a third-party research digest explicitly noted speaker funding is not confirmed for this event. The live page only shows 2025 event recap content, no visible 2027 CFP deadline or terms yet. Confirm directly with the organizer.',
      topics: ['Cloud / DevOps'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'Low', matchedTalkIds: [],
      nextAction: '⚠️ Event date and CFP deadline are estimates based on the 2025 edition timing — verify on civo.com/navigate/london before preparing a submission.', notes: 'Added from an unverified research digest on 2026-11-26; eventDate and deadlineDate are estimates, not confirmed on the live site.', submittedAt: '', confirmationReference: '', lastUpdated: '2026-11-26'
    },
    {
      id: 'arc-of-ai-2027', name: 'Arc of AI 2027', category: 'applied AI craft conference',
      eventDate: '2027-06-01', deadlineDate: '2027-03-01', deadlineTimezone: 'UTC',
      location: 'Location not stated', deliveryMode: 'In-person', sourceType: 'Official CFP',
      source: 'Official arcofai.com CFP page', sourceUrl: 'https://www.arcofai.com/cfp', sourceStatus: 'CFP open', sourceScore: 0.2,
      travelSupport: 'Not stated', travelDetails: '⚠️ UNVERIFIED — a third-party research digest claimed economy flights plus 4 hotel nights within a limited travel budget, but arcofai.com is a JavaScript-rendered site with no publicly fetchable deadline or terms. Confirm directly with the organizer before relying on this.',
      topics: ['Agentic AI', 'AI Engineering'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'Low', matchedTalkIds: [],
      nextAction: '⚠️ Event date and CFP deadline are placeholders — no public date information could be found. Verify on arcofai.com before preparing a submission.', notes: 'Added from an unverified research digest on 2026-11-26; eventDate and deadlineDate are placeholders, not confirmed on the live site.', submittedAt: '', confirmationReference: '', lastUpdated: '2026-11-26'
    },
    {
      id: 'eppc27-manual-override', name: 'European Power Platform Conference (EPPC27)', category: 'Microsoft Power Platform conference',
      eventDate: '2027-06-14', deadlineDate: '2027-01-13', deadlineTimezone: 'UTC',
      location: 'Location not stated', deliveryMode: 'In-person', sourceType: 'Sessionize public CFP',
      source: 'Sessionize public open CFP', sourceUrl: 'https://sessionize.com/eppc27/', sourceStatus: 'CFP open', sourceScore: 0.89,
      travelSupport: 'Travel sponsored', travelDetails: '3 nights accommodation covered in conference hotel (confirmed on the Sessionize CFP page). ⚠️ UNVERIFIED addition: a third-party research digest also claimed a €800 (1–2 sessions) or €2,000 (full-day tutorial) speaker compensation, with Microsoft employees excluded — this could not be confirmed on the public ESPC/EPPC pages. Confirm directly before relying on a speaker fee.',
      topics: ['Azure', 'Copilot', 'AI Engineering', 'RAG / MCP', 'Microsoft Data'], audience: ['Developers', 'Architects', 'Engineering leaders'],
      status: 'Not started', priority: 'High', matchedTalkIds: [],
      nextAction: 'Review the CFP and submit the best-matching talk; ask the organizer to confirm the speaker compensation terms.', notes: 'Hotel coverage confirmed via Sessionize scrape; speaker-fee claim from an unverified research digest added 2026-11-26.', submittedAt: '', confirmationReference: '', lastUpdated: '2026-11-26'
    }
  ];

  let generatedSessionize = {items: []};
  if (typeof globalThis !== 'undefined' && globalThis.SessionizePublicOpportunities) {
    generatedSessionize = globalThis.SessionizePublicOpportunities;
  } else if (typeof require === 'function') {
    try { generatedSessionize = require('./sessionize-opportunities.js'); } catch (_) {}
  }

  let generatedConfsTech = {items: []};
  if (typeof globalThis !== 'undefined' && globalThis.ConfsTechOpportunities) {
    generatedConfsTech = globalThis.ConfsTechOpportunities;
  } else if (typeof require === 'function') {
    try { generatedConfsTech = require('./confstech-opportunities.js'); } catch (_) {}
  }

  let conferenceResearch = {items: [], byOpportunityId: {}};
  if (typeof globalThis !== 'undefined' && globalThis.SpeakerConferenceResearch) {
    conferenceResearch = globalThis.SpeakerConferenceResearch;
  } else if (typeof require === 'function') {
    try { conferenceResearch = require('./conference-research.js'); } catch (_) {}
  }

  const opportunityMap = new Map();
  [...MANUAL_OPPORTUNITIES, ...(generatedSessionize.items || []), ...(generatedConfsTech.items || [])].forEach(item => {
    const urlKey = String(item.sourceUrl || '').toLowerCase().replace(/\/$/, '');
    const nameKey = String(item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const key = urlKey || nameKey;
    if (!opportunityMap.has(key)) opportunityMap.set(key, item);
  });
  const SEED_OPPORTUNITIES = [...opportunityMap.values()];

  const SEED_SOURCES = [
    {
      id: 'sessionize', name: 'Sessionize', category: 'CFP discovery platform',
      url: 'https://sessionize.com/', purpose: 'Primary CFP discovery and submission platform; already scraped automatically for this tracker.',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'confs-tech', name: 'Confs.tech', category: 'CFP discovery platform',
      url: 'https://confs.tech/', purpose: 'Open-source developer conference calendar with CFP deadlines; already scraped automatically for this tracker.',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'papercall', name: 'PaperCall', category: 'CFP discovery platform',
      url: 'https://www.papercall.io/', purpose: 'CFP submission platform, strong in dev/cloud/open-source conferences. Not yet automated here — JS-rendered listing, check manually.',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'cfp-land', name: 'CFP Land', category: 'CFP discovery platform',
      url: 'https://cfpland.com/', purpose: 'Community-run CFP aggregator/directory. Not yet automated here — check manually.',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'calling-all-papers', name: 'CallingAllPapers', category: 'CFP discovery platform',
      url: 'https://callingallpapers.com/', purpose: 'CFP discovery site. Not yet automated here — check manually.',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'linux-foundation-events', name: 'Linux Foundation Events', category: 'Travel grant program',
      url: 'https://events.linuxfoundation.org/', purpose: 'Travel funding program for accepted speakers/attendees at Linux Foundation events (eligibility varies by event).',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'cncf', name: 'CNCF', category: 'Travel grant program',
      url: 'https://www.cncf.io/', purpose: 'Cloud Native Computing Foundation travel/diversity funding for KubeCon and related events (eligibility varies).',
      notes: '', lastCheckedAt: null
    },
    {
      id: 'google-developer-community', name: 'Google Developer Community', category: 'Travel grant program',
      url: 'https://developers.google.com/community', purpose: 'Google Developer community programs, occasionally including speaker/travel support for community events.',
      notes: '', lastCheckedAt: null
    }
  ];

  const SEED_TALKS = [
    {
      id: 'reliable-agentic-workflows',
      title: 'Building Reliable Agentic Workflows on Azure',
      pitch: 'A practical path from an agent demo to a controlled, observable production workflow.',
      stage: 'Ready',
      topics: ['Agentic AI', 'Azure', 'Cloud'],
      audience: ['Developers', 'Architects'],
      demoReady: true
    },
    {
      id: 'copilot-to-production',
      title: 'From Copilot Demo to Production: Evaluation, Guardrails and Observability',
      pitch: 'How to make AI-assisted developer workflows measurable, governable and safe to ship.',
      stage: 'Draft',
      topics: ['AI Engineering', 'Developer Tools', 'Evaluation'],
      audience: ['Developers', 'Engineering leaders'],
      demoReady: true
    },
    {
      id: 'human-loop-multi-agent',
      title: 'Human-in-the-Loop Multi-Agent Systems for Enterprise Teams',
      pitch: 'Designing agent collaboration where people retain authority over consequential decisions.',
      stage: 'Idea',
      topics: ['Agentic AI', 'Human in the loop', 'Enterprise AI'],
      audience: ['Architects', 'Engineering leaders'],
      demoReady: false
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function dateOnlyUtc(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!match) return NaN;
    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  function todayUtc(now) {
    const date = new Date(now || Date.now());
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

  function deadlineState(deadlineDate, now) {
    const deadline = dateOnlyUtc(deadlineDate);
    if (!Number.isFinite(deadline)) return {key: 'unknown', label: 'No deadline', days: null};
    const days = Math.round((deadline - todayUtc(now)) / 86400000);
    if (days < 0) return {key: 'passed', label: `${Math.abs(days)} days passed`, days};
    if (days === 0) return {key: 'today', label: 'Due today', days};
    if (days <= 7) return {key: 'critical', label: `${days} days left`, days};
    if (days <= 21) return {key: 'soon', label: `${days} days left`, days};
    if (days <= 60) return {key: 'upcoming', label: `${days} days left`, days};
    return {key: 'later', label: `${days} days left`, days};
  }

  function activeOpportunities(items, now) {
    return (items || []).filter(item => {
      const state = deadlineState(item.deadlineDate, now);
      return state.days !== null && state.days >= 0;
    });
  }

  function overlaps(a, b) {
    const right = new Set((b || []).map(x => String(x).toLowerCase()));
    return (a || []).some(x => right.has(String(x).toLowerCase()));
  }

  function matchTalk(opportunity, talk) {
    let score = 0;
    const reasons = [];
    if (overlaps(opportunity.topics, talk.topics)) {
      score += 35;
      reasons.push('Agentic AI topic match');
    }
    const combined = [...(opportunity.topics || []), ...(talk.topics || [])].join(' ').toLowerCase();
    if (/azure|cloud/.test(combined)) {
      score += 25;
      reasons.push('Azure/cloud relevance');
    }
    if (overlaps(opportunity.audience, talk.audience)) {
      score += 15;
      reasons.push('Developer audience');
    }
    if (talk.demoReady) {
      score += 10;
      reasons.push('Demo ready');
    }
    return {score: Math.min(score, 100), reasons};
  }

  function bestTalk(opportunity, talks) {
    return (talks || []).map(talk => ({talk, ...matchTalk(opportunity, talk)}))
      .sort((a, b) => b.score - a.score || a.talk.title.localeCompare(b.talk.title))[0] || null;
  }

  function resolveOpportunityResearch(opportunity, talks) {
    const research = opportunity && conferenceResearch.byOpportunityId
      ? conferenceResearch.byOpportunityId[opportunity.id] || null
      : null;
    if (research) {
      const talksById = new Map((talks || []).map(talk => [talk.id, talk]));
      return {
        kind: 'researched',
        research,
        recommendations: research.recommendations.map(idea => ({...idea, baseTalk: talksById.get(idea.baseTalkId) || null}))
      };
    }
    const generic = bestTalk(opportunity || {}, talks);
    return {
      kind: 'generic',
      research: null,
      recommendations: generic ? [{
        title: generic.talk.title,
        rationale: generic.reasons.join(' · '),
        baseTalkId: generic.talk.id,
        baseTalk: generic.talk,
        score: generic.score
      }] : []
    };
  }

  const NO_CITY_PATTERNS = [/^online$/i, /location not stated/i, /city not yet confirmed/i, /not yet confirmed/i, /not stated/i, /^tbd$/i, /^tba$/i];

  function extractCity(location) {
    const raw = String(location || '').trim();
    if (!raw) return null;
    // Locations often look like "Warsaw, Poland", "Atlanta, Georgia, U.S.", "Anaheim, California, U.S. · Online"
    // or "San Francisco, U.S. · Salesforce+". Take the first comma-delimited segment, then strip
    // any trailing " · venue" style annotations, and reject segments that are clearly not a city.
    const firstSegment = raw.split(',')[0].split('·')[0].trim();
    if (!firstSegment) return null;
    if (NO_CITY_PATTERNS.some(pattern => pattern.test(firstSegment))) return null;
    if (NO_CITY_PATTERNS.some(pattern => pattern.test(raw)) && !raw.includes(',')) return null;
    return firstSegment;
  }

  // Keywords used to infer trip-sponsorship when the structured `travelSupport` field is missing
  // or left as "Not stated" but the free-text travel/notes description actually mentions it.
  const SPONSORED_TEXT = /\b(sponsor(?:ed|s)?|travel (?:stipend|budget|allowance|grant)|covers? (?:travel|flights?|hotel)|hotel (?:nights?|covered|stay covered)|(?:travel|flights?|hotel|accommodation)(?:s)?(?: and (?:travel|flights?|hotel|accommodation)s?)? (?:are |is )?(?:fully |partially )?covered|reimburse(?:d|ment)?|flights? (?:and|plus|\+) hotel|complimentary (?:travel|hotel))\b/i;
  const NOT_SPONSORED_TEXT = /\b(not covered|not sponsored|no travel (?:support|budget|stipend)|travel (?:is )?not (?:provided|covered)|does not (?:cover|publish|provide)|not publish)\b/i;
  const PARTIAL_TEXT = /\b(partial|conditional|depends on|limited (?:travel )?budget|up to)\b/i;

  function inferTravelSupport(item) {
    const explicit = item && item.travelSupport;
    if (explicit && explicit !== 'Not stated') return explicit;
    if (item && item.deliveryMode === 'Online' && !explicit) return 'Online / no trip';
    const text = [item && item.travelDetails, item && item.notes].filter(Boolean).join(' ');
    if (!text) return explicit || 'Not stated';
    if (NOT_SPONSORED_TEXT.test(text)) return 'Not covered';
    if (SPONSORED_TEXT.test(text)) return PARTIAL_TEXT.test(text) ? 'Partial / conditional' : 'Travel sponsored';
    return explicit || 'Not stated';
  }

  function filterOpportunities(items, filters, now) {
    const f = filters || {};
    const search = String(f.search || '').trim().toLowerCase();
    return activeOpportunities(items, now).filter(item => {
      const haystack = [item.name, item.category, item.location, item.sourceType, item.source, ...(item.topics || []), ...(item.audience || [])].join(' ').toLowerCase();
      if (search && !haystack.includes(search)) return false;
      if (f.status && f.status !== 'all' && item.status !== f.status) return false;
      if (f.priority && f.priority !== 'all' && item.priority !== f.priority) return false;
      if (f.source && f.source !== 'all' && (item.sourceType || 'Official CFP') !== f.source) return false;
      if (f.mode && f.mode !== 'all' && item.deliveryMode !== f.mode) return false;
      if (f.city && f.city !== 'all' && extractCity(item.location) !== f.city) return false;
      if (f.travel && f.travel !== 'all') {
        const travel = inferTravelSupport(item);
        if (f.travel === 'sponsored' && travel !== 'Travel sponsored') return false;
        if (f.travel === 'online' && travel !== 'Online / no trip') return false;
        if (f.travel === 'unstated' && (travel === 'Travel sponsored' || travel === 'Online / no trip')) return false;
      }
      if (f.deadline && f.deadline !== 'all') {
        const key = deadlineState(item.deadlineDate, now).key;
        if (f.deadline === 'open' && !['today', 'critical', 'soon', 'upcoming', 'later'].includes(key)) return false;
        else if (f.deadline !== 'open' && key !== f.deadline) return false;
      }
      return true;
    });
  }

  function csvEscape(value) {
    const text = Array.isArray(value) ? value.join(' | ') : String(value == null ? '' : value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  const EXPORT_FIELDS = ['id', 'name', 'category', 'eventDate', 'deadlineDate', 'deadlineTimezone', 'location', 'deliveryMode', 'sourceType', 'source', 'sourceUrl', 'sourceStatus', 'sourceScore', 'travelSupport', 'travelDetails', 'topics', 'audience', 'status', 'priority', 'nextAction', 'notes', 'submittedAt', 'confirmationReference', 'lastUpdated'];

  function toCsv(items) {
    return [EXPORT_FIELDS.join(','), ...(items || []).map(item => EXPORT_FIELDS.map(field => csvEscape(item[field])).join(','))].join('\r\n') + '\r\n';
  }

  function initialState() {
    return {version: 5, opportunities: clone(SEED_OPPORTUNITIES), talks: clone(SEED_TALKS), dismissedIds: [], sources: clone(SEED_SOURCES)};
  }

  function reconcileSources(savedSources) {
    const savedById = new Map((Array.isArray(savedSources) ? savedSources : []).map(item => [item.id, item]));
    const known = SEED_SOURCES.map(item => {
      const saved = savedById.get(item.id);
      if (!saved) return clone(item);
      const merged = {...item};
      ['notes', 'lastCheckedAt'].forEach(field => { if (saved[field] !== undefined) merged[field] = saved[field]; });
      return merged;
    });
    const knownIds = new Set(SEED_SOURCES.map(item => item.id));
    const custom = (Array.isArray(savedSources) ? savedSources : []).filter(item => !knownIds.has(item.id));
    return [...known, ...custom];
  }

  function loadState(storage) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return initialState();
    const raw = store.getItem(STORAGE_KEY);
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 5 && Array.isArray(parsed.opportunities) && Array.isArray(parsed.talks)) {
          const dismissed = new Set(Array.isArray(parsed.dismissedIds) ? parsed.dismissedIds : []);
          const catalogIds = new Set(SEED_OPPORTUNITIES.map(item => item.id));
          const savedById = new Map(parsed.opportunities.map(item => [item.id, item]));
          const mutableFields = ['status', 'priority', 'nextAction', 'notes', 'submittedAt', 'confirmationReference'];
          const catalog = SEED_OPPORTUNITIES.filter(item => !dismissed.has(item.id)).map(item => {
            const saved = savedById.get(item.id);
            if (!saved) return clone(item);
            const merged = {...item};
            mutableFields.forEach(field => { if (saved[field] !== undefined) merged[field] = saved[field]; });
            return merged;
          });
          const custom = parsed.opportunities.filter(item => !catalogIds.has(item.id) && !dismissed.has(item.id));
          return {...parsed, opportunities: [...catalog, ...custom], dismissedIds: [...dismissed], sources: reconcileSources(parsed.sources)};
        }
      } catch (_) {}
    }
    return initialState();
  }

  function saveState(storage, state) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return;
    store.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function createId(name, existing) {
    const base = String(name || 'opportunity').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'opportunity';
    const ids = new Set((existing || []).map(item => item.id));
    let id = `${base}-${Date.now().toString(36)}`;
    let n = 1;
    while (ids.has(id)) id = `${base}-${Date.now().toString(36)}-${n++}`;
    return id;
  }

  return {STORAGE_KEY, STATUSES, SEED_OPPORTUNITIES, SEED_TALKS, SEED_SOURCES, CONFERENCE_RESEARCH: conferenceResearch, EXPORT_FIELDS, deadlineState, activeOpportunities, matchTalk, bestTalk, resolveOpportunityResearch, filterOpportunities, extractCity, inferTravelSupport, toCsv, initialState, loadState, saveState, createId};
});
