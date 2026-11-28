const test = require('node:test');
const assert = require('node:assert/strict');
const client = require('../research-engine-client.js');

const opportunity = {
  id: 'conf-1', name: 'Conference', category: 'AI', location: 'Berlin', deliveryMode: 'In-person',
  eventDate: '2027-01-01', deadlineDate: '2026-12-01', sourceType: 'Official CFP',
  sourceUrl: 'https://example.com/conf', topics: ['Agentic AI'], audience: ['Developers'],
  notes: 'private', nextAction: 'private', status: 'Drafting', confirmationReference: 'private'
};
const talks = [{id:'talk-1', title:'Talk', pitch:'Pitch', stage:'Ready', topics:['AI'], audience:['Developers'], demoReady:true, notes:'private'}];

test('builds a bounded request from public conference and talk fields only', () => {
  const payload = client.buildReportRequest(opportunity, talks, new Date('2026-11-28T12:00:00Z'));
  assert.equal(payload.source, 'tracker-ui');
  assert.equal(payload.options.as_of, '2026-11-28');
  assert.equal(payload.opportunity.sourceUrl, 'https://example.com/conf');
  for (const field of ['notes','nextAction','status','confirmationReference']) assert.equal(Object.hasOwn(payload.opportunity, field), false);
  assert.equal(Object.hasOwn(payload.talks[0], 'notes'), false);
});

test('drops unsafe source URLs and calls the fixed stateless endpoint without credentials', async () => {
  let captured;
  const fakeFetch = async (url, options) => {
    captured = {url, options};
    return {ok:true, status:200, json:async()=>({schema_version:'cre-report/1', status:'insufficient_evidence', recommendations:[], history:{sessions:[]}, trends:[], gaps:[], limitations:['No evidence'], evidence:[]})};
  };
  const unsafe = {...opportunity, sourceUrl:'javascript:alert(1)'};
  const result = await client.requestReport({opportunity:unsafe, talks, fetchImpl:fakeFetch, now:new Date('2026-11-28T12:00:00Z')});
  assert.equal(result.kind, 'report');
  assert.equal(captured.url, 'https://conference-research-engine.vercel.app/v1/live-research');
  assert.equal(captured.options.credentials, 'omit');
  assert.equal(captured.options.cache, 'no-store');
  assert.equal(captured.options.headers.Authorization, undefined);
  assert.equal(JSON.parse(captured.options.body).opportunity.sourceUrl, undefined);
});

test('maps hostile server errors to fixed safe messages', async () => {
  const result = await client.requestReport({
    opportunity, talks,
    fetchImpl: async () => ({ok:false, status:500, json:async()=>({detail:'<img src=x onerror=alert(1)>'})})
  });
  assert.deepEqual(result, {kind:'error', code:'server', message:'The research engine is temporarily unavailable.', retryable:true});
});
