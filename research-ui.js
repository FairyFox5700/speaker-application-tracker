(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SpeakerResearchUi = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function safeUrl(value) {
    try {
      const url = new URL(String(value));
      return url.protocol === 'https:' ? url.href : '#';
    } catch (_) {
      return '#';
    }
  }

  function externalLink(url, label, className) {
    const safe = safeUrl(url);
    const external = safe === '#' ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a${className ? ` class="${escapeHtml(className)}"` : ''} href="${escapeHtml(safe)}"${external}>${escapeHtml(label)}</a>`;
  }

  function kindLabel(kind) {
    if (kind === 'exact-prior-edition') return 'Exact prior edition';
    if (kind === 'current-program-only' || kind === 'current-program-evidence') return 'Current program only';
    return 'Related organizer evidence';
  }

  function renderResearchRecord(record, talksById) {
    const talks = talksById || {};
    const patterns = (record.recurringPatterns || []).map(pattern => `<li>${escapeHtml(pattern)}</li>`).join('');
    const sessions = (record.representativeSessions || []).map(session => `<li class="research-session">
      ${externalLink(session.url, session.title)}
      <span class="evidence-tag">${escapeHtml(kindLabel(session.evidenceKind))}</span>
      <p>${escapeHtml(session.theme)}</p>
    </li>`).join('');
    const ideas = (record.recommendations || []).map(idea => {
      const base = talks[idea.baseTalkId] || {};
      return `<article class="research-idea"><h4>${escapeHtml(idea.title)}</h4><p>${escapeHtml(idea.rationale)}</p><p class="base-talk"><span class="base-label">Base reusable talk:</span> ${escapeHtml(base.title || idea.baseTalkId)}</p></article>`;
    }).join('');
    const limitations = (record.limitations || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const sources = (record.sources || []).map(source => `<li>${externalLink(source.url, source.title)}</li>`).join('');

    return `<article class="research-card" id="research-${escapeHtml(record.opportunityId)}" data-research-record="${escapeHtml(record.opportunityId)}">
      <header class="research-card-head"><div><p class="kicker">${escapeHtml(kindLabel(record.editionEvidence && record.editionEvidence.kind))}</p><h3>${escapeHtml(record.conferenceName)}</h3></div><span class="reviewed-date">Reviewed ${escapeHtml(record.reviewedOn)}</span></header>
      <p class="edition-evidence">${externalLink(record.editionEvidence && record.editionEvidence.url, record.editionEvidence && record.editionEvidence.label)}</p>
      <div class="research-columns">
        <section><h4>Recurring patterns</h4><ul>${patterns}</ul></section>
        <section><h4>Representative sessions</h4><ul class="session-list">${sessions}</ul></section>
      </div>
      <section><h4>Conference-specific talk ideas</h4><div class="idea-grid">${ideas}</div></section>
      <div class="research-foot"><section><h4>Sources</h4><ul>${sources}</ul></section><section><h4>Limitations</h4><ul>${limitations}</ul></section></div>
    </article>`;
  }

  function renderResearchCatalog(records, talks, query) {
    const talksById = Object.fromEntries((talks || []).map(talk => [talk.id, talk]));
    const needle = String(query || '').trim().toLowerCase();
    const filtered = (records || []).filter(record => !needle || [
      record.conferenceName,
      record.editionEvidence && record.editionEvidence.label,
      ...(record.recurringPatterns || []),
      ...(record.representativeSessions || []).flatMap(session => [session.title, session.theme]),
      ...(record.recommendations || []).flatMap(idea => [idea.title, idea.rationale])
    ].join(' ').toLowerCase().includes(needle));
    return {count: filtered.length, html: filtered.map(record => renderResearchRecord(record, talksById)).join('')};
  }

  function renderEngineReport(report, talksById) {
    const talks = talksById || {};
    const recommendations = (report.recommendations || []).slice(0, 20);
    const sessions = (((report.history || {}).sessions) || []).slice(0, 10);
    const evidence = (report.evidence || []).slice(0, 30);
    const limitations = (report.limitations || []).slice(0, 20);
    const score = value => Math.max(0, Math.min(100, Math.round((Number(value) || 0) / 100)));
    const status = report.status === 'insufficient_evidence' ? 'Insufficient evidence' : 'Live research complete';
    const coverage = report.coverage || {};
    const sessionHtml = sessions.map(session => `<li class="research-session"><strong>${escapeHtml(session.title)}</strong><span class="evidence-tag">${escapeHtml(session.conference_year || 'Year unverified')}</span><p>${escapeHtml((session.topics || []).join(' · '))}</p>${safeUrl(session.source_url) === '#' ? '' : externalLink(session.source_url, 'Source')}</li>`).join('');
    const recommendationHtml = recommendations.map(item => {
      const base = talks[item.base_talk_id] || {};
      const tools = (item.tools_and_frameworks || []).slice(0, 8).map(tool => `<span class="chip">${escapeHtml(tool)}</span>`).join('');
      return `<article class="research-idea engine-idea"><header><span class="score">${score(item.score_bp)}/100</span><h4>${escapeHtml(item.title)}</h4></header><p>${escapeHtml(item.description)}</p><p><b>Why now:</b> ${escapeHtml(item.why_it_matters)}</p><p><b>Current signal:</b> ${escapeHtml(item.current_industry_developments)}</p><p><b>Conference connection:</b> ${escapeHtml(item.historical_conference_connection)}</p><p><b>Demo:</b> ${escapeHtml(item.potential_demo)}</p><div class="chips">${tools}</div><p class="base-talk"><span class="base-label">Base reusable talk:</span> ${escapeHtml(base.title || item.base_talk_id || 'New talk')}</p></article>`;
    }).join('');
    const evidenceHtml = evidence.map(item => `<li id="engine-${escapeHtml(String(item.evidence_id || '').replace(/[^a-z0-9_-]/gi, ''))}"><span class="evidence-tag">${escapeHtml(kindLabel(item.kind))}</span> ${safeUrl(item.source_url) === '#' ? escapeHtml(item.source_url) : externalLink(item.source_url, item.source_url)}<blockquote>${escapeHtml(item.excerpt)}</blockquote></li>`).join('');
    const limitationHtml = limitations.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const noRecommendations = recommendations.length ? '' : '<p class="empty-state">No topic had enough current evidence for a recommendation. The engine did not pad the result.</p>';
    return `<article class="research-card engine-report-card"><header class="research-card-head"><div><p class="kicker">${escapeHtml(status)}</p><h3>${escapeHtml((report.conference || {}).name)}</h3></div><span class="reviewed-date">As of ${escapeHtml(report.as_of)}</span></header><p class="engine-coverage">Coverage: <strong>${escapeHtml(coverage.grade || 'unknown')}</strong> · ${escapeHtml(coverage.verified_prior_sessions || 0)} verified prior sessions · ${escapeHtml(coverage.signal_sources || 0)} live signal sources</p>${noRecommendations}<section><h4>Recommended topics</h4><div class="idea-grid engine-idea-grid">${recommendationHtml}</div></section><section><h4>Verified programme sessions</h4><ul class="session-list">${sessionHtml || '<li>No extractable prior sessions were verified.</li>'}</ul></section><div class="research-foot"><section><h4>Evidence</h4><details><summary>${evidence.length} sources</summary><ul>${evidenceHtml}</ul></details></section><section><h4>Limitations</h4><ul>${limitationHtml}</ul></section></div></article>`;
  }

  return {escapeHtml, safeUrl, renderResearchRecord, renderResearchCatalog, renderEngineReport};
});
