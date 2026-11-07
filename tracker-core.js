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
    }
  ];

  let generatedSessionize = {items: []};
  if (typeof globalThis !== 'undefined' && globalThis.SessionizePublicOpportunities) {
    generatedSessionize = globalThis.SessionizePublicOpportunities;
  } else if (typeof require === 'function') {
    try { generatedSessionize = require('./sessionize-opportunities.js'); } catch (_) {}
  }

  const opportunityMap = new Map();
  [...MANUAL_OPPORTUNITIES, ...(generatedSessionize.items || [])].forEach(item => {
    const urlKey = String(item.sourceUrl || '').toLowerCase().replace(/\/$/, '');
    const nameKey = String(item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const key = urlKey || nameKey;
    if (!opportunityMap.has(key)) opportunityMap.set(key, item);
  });
  const SEED_OPPORTUNITIES = [...opportunityMap.values()];

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
    return {version: 5, opportunities: clone(SEED_OPPORTUNITIES), talks: clone(SEED_TALKS), dismissedIds: []};
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
          return {...parsed, opportunities: [...catalog, ...custom], dismissedIds: [...dismissed]};
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

  return {STORAGE_KEY, STATUSES, SEED_OPPORTUNITIES, SEED_TALKS, EXPORT_FIELDS, deadlineState, activeOpportunities, matchTalk, bestTalk, filterOpportunities, toCsv, initialState, loadState, saveState, createId};
});
