(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SpeakerTrackerCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STORAGE_KEY = 'speakerTracker:v1';
  const STATUSES = ['Not started', 'Drafting', 'Submitted', 'Accepted', 'Rejected', 'Withdrawn'];

  const SEED_OPPORTUNITIES = [
    {
      id: 'nextgen-intelligence-2026',
      name: 'NextGen Intelligence Conference: Data, Cloud & AI',
      category: 'general conference',
      eventDate: '2026-11-16',
      deadlineDate: '2026-10-09',
      deadlineTimezone: 'Europe/London',
      location: 'London, U.K., Online',
      deliveryMode: 'Hybrid',
      source: 'Conferences & CFPs (confs.tech)',
      sourceUrl: 'https://confs.tech/',
      sourceStatus: 'CFP open',
      sourceScore: 0.29,
      topics: ['Agentic AI', 'Azure', 'Cloud', 'Data'],
      audience: ['Developers', 'Architects', 'Data leaders'],
      status: 'Not started',
      priority: 'High',
      matchedTalkIds: ['reliable-agentic-workflows'],
      nextAction: 'Check whether late submissions or a waitlist are available.',
      notes: '',
      submittedAt: '',
      confirmationReference: '',
      lastUpdated: '2026-10-31'
    },
    {
      id: 'ai-for-developers-2026',
      name: 'AI for Developers',
      category: 'data conference',
      eventDate: '2026-12-17',
      deadlineDate: '2026-06-01',
      deadlineTimezone: 'UTC',
      location: 'Online',
      deliveryMode: 'Online',
      source: 'Conferences & CFPs (confs.tech)',
      sourceUrl: 'https://confs.tech/',
      sourceStatus: 'CFP open',
      sourceScore: 0.29,
      topics: ['AI Engineering', 'Developer Tools', 'Agentic AI'],
      audience: ['Developers'],
      status: 'Not started',
      priority: 'Medium',
      matchedTalkIds: ['copilot-to-production'],
      nextAction: 'Confirm whether the CFP has reopened for the December event.',
      notes: '',
      submittedAt: '',
      confirmationReference: '',
      lastUpdated: '2026-10-31'
    },
    {
      id: 'ai-coding-summit-2026',
      name: 'AI Coding Summit',
      category: 'javascript conference',
      eventDate: '2026-02-26',
      deadlineDate: '2026-01-26',
      deadlineTimezone: 'UTC',
      location: 'Online',
      deliveryMode: 'Online',
      source: 'Conferences & CFPs (confs.tech)',
      sourceUrl: 'https://confs.tech/',
      sourceStatus: 'CFP open',
      sourceScore: 0.29,
      topics: ['AI Coding', 'Developer Tools', 'JavaScript'],
      audience: ['Developers'],
      status: 'Not started',
      priority: 'Low',
      matchedTalkIds: ['copilot-to-production'],
      nextAction: 'Archive unless a new edition is announced.',
      notes: '',
      submittedAt: '',
      confirmationReference: '',
      lastUpdated: '2026-10-31'
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
    return (items || []).filter(item => {
      const haystack = [item.name, item.category, item.location, item.source, ...(item.topics || []), ...(item.audience || [])].join(' ').toLowerCase();
      if (search && !haystack.includes(search)) return false;
      if (f.status && f.status !== 'all' && item.status !== f.status) return false;
      if (f.priority && f.priority !== 'all' && item.priority !== f.priority) return false;
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

  const EXPORT_FIELDS = ['id', 'name', 'category', 'eventDate', 'deadlineDate', 'deadlineTimezone', 'location', 'deliveryMode', 'source', 'sourceUrl', 'sourceStatus', 'sourceScore', 'topics', 'audience', 'status', 'priority', 'nextAction', 'notes', 'submittedAt', 'confirmationReference', 'lastUpdated'];

  function toCsv(items) {
    return [EXPORT_FIELDS.join(','), ...(items || []).map(item => EXPORT_FIELDS.map(field => csvEscape(item[field])).join(','))].join('\r\n') + '\r\n';
  }

  function initialState() {
    return {version: 1, opportunities: clone(SEED_OPPORTUNITIES), talks: clone(SEED_TALKS)};
  }

  function loadState(storage) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return initialState();
    const raw = store.getItem(STORAGE_KEY);
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1 && Array.isArray(parsed.opportunities) && Array.isArray(parsed.talks)) return parsed;
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

  return {STORAGE_KEY, STATUSES, SEED_OPPORTUNITIES, SEED_TALKS, EXPORT_FIELDS, deadlineState, matchTalk, bestTalk, filterOpportunities, toCsv, initialState, loadState, saveState, createId};
});
