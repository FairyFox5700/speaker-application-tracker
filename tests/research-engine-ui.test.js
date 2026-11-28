const test = require('node:test');
const assert = require('node:assert/strict');
const ui = require('../research-ui.js');


test('renders live engine reports with escaped text, bounded scores, evidence and limitations', () => {
  const html = ui.renderEngineReport({
    status: 'insufficient_evidence',
    as_of: '2026-11-28',
    conference: {name:'<img src=x onerror=alert(1)>'},
    coverage: {grade:'partial', verified_prior_sessions:3, signal_sources:2},
    history: {sessions:[{title:'<script>alert(1)</script>', conference_year:2026, topics:['agents'], source_url:'javascript:bad'}]},
    recommendations:[{
      rank:1, title:'Safe <b>title</b>', description:'Description', why_it_matters:'Why',
      score_bp:12000, base_talk_id:'talk-1', potential_demo:'Demo', recommended_format:'Session',
      tools_and_frameworks:['Azure'], claims:[{text:'Claim', evidence_ids:['ev_1']}]
    }],
    limitations:['Important <tag>'],
    evidence:[{evidence_id:'ev_1', kind:'trend-signal', source_url:'https://example.com/source', excerpt:'Evidence <text>'}]
  }, {'talk-1':{title:'Base Talk'}});
  assert.doesNotMatch(html, /<script|<img|<b>title|javascript:/i);
  assert.match(html, /100\/100/);
  assert.match(html, /Base Talk/);
  assert.match(html, /Evidence &lt;text&gt;/);
  assert.match(html, /Important &lt;tag&gt;/);
  assert.match(html, /Insufficient evidence/);
  assert.match(html, /rel="noopener noreferrer"/);
});
