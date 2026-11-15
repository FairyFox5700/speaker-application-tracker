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

  return {escapeHtml, safeUrl, renderResearchRecord, renderResearchCatalog};
});
