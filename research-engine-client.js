(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SpeakerResearchEngineClient = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ENGINE_URL = 'https://conference-research-engine.vercel.app/v1/live-research';
  const OPPORTUNITY_FIELDS = ['id','name','category','location','deliveryMode','eventDate','deadlineDate','sourceType','sourceUrl','topics','audience'];
  const TALK_FIELDS = ['id','title','pitch','stage','topics','audience','demoReady'];

  function safeHttps(value) {
    try {
      const url = new URL(String(value));
      return url.protocol === 'https:' ? url.href : '';
    } catch (_) { return ''; }
  }

  function bounded(value, max) {
    return String(value == null ? '' : value).slice(0, max);
  }

  function publicRecord(record, fields) {
    const result = {};
    fields.forEach(field => {
      if (record[field] === undefined || record[field] === null) return;
      if (field === 'sourceUrl') {
        const safe = safeHttps(record[field]);
        if (safe) result[field] = safe;
      } else if (Array.isArray(record[field])) {
        result[field] = record[field].slice(0, 20).map(value => bounded(value, 120));
      } else if (typeof record[field] === 'boolean') {
        result[field] = record[field];
      } else {
        result[field] = bounded(record[field], field === 'pitch' ? 600 : 200);
      }
    });
    return result;
  }

  function buildReportRequest(opportunity, talks, now) {
    const date = now instanceof Date ? now : new Date();
    return {
      source: 'tracker-ui',
      opportunity: publicRecord(opportunity || {}, OPPORTUNITY_FIELDS),
      talks: (talks || []).slice(0, 20).map(talk => publicRecord(talk, TALK_FIELDS)),
      options: {as_of: date.toISOString().slice(0, 10), history_editions: 3, max_recommendations: 15}
    };
  }

  function fixedError(status) {
    if (status === 429) return {kind:'error', code:'rate_limit', message:'The research engine is busy. Try again shortly.', retryable:true};
    if (status >= 500) return {kind:'error', code:'server', message:'The research engine is temporarily unavailable.', retryable:true};
    return {kind:'error', code:'request', message:'The research engine could not process this conference.', retryable:false};
  }

  async function requestReport({opportunity, talks, fetchImpl, signal, now} = {}) {
    const fetcher = fetchImpl || fetch;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), 55000);
    if (signal) signal.addEventListener('abort', () => controller.abort('cancelled'), {once:true});
    try {
      const response = await fetcher(ENGINE_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json', Accept:'application/json'},
        body: JSON.stringify(buildReportRequest(opportunity, talks, now)),
        credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal
      });
      let body;
      try { body = await response.json(); } catch (_) { return {kind:'error', code:'bad_response', message:'The research engine returned an unreadable response.', retryable:true}; }
      if (!response.ok) return fixedError(response.status);
      if (!body || body.schema_version !== 'cre-report/1' || !Array.isArray(body.recommendations) || !body.history || !Array.isArray(body.evidence)) {
        return {kind:'error', code:'bad_report', message:'The research engine returned an invalid report.', retryable:true};
      }
      return {kind:'report', report:body};
    } catch (error) {
      if (error && error.name === 'AbortError') {
        if (signal && signal.aborted) return {kind:'cancelled'};
        return {kind:'error', code:'timeout', message:'Research timed out. Try again.', retryable:true};
      }
      return {kind:'error', code:'network', message:"Couldn't reach the research engine.", retryable:true};
    } finally { clearTimeout(timer); }
  }

  return {ENGINE_URL, buildReportRequest, requestReport};
});
