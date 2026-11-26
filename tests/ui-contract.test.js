const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('index exposes stable controls and static relative assets', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const hook of ['app', 'opportunity-list', 'add-opportunity', 'opportunity-form', 'search', 'deadline-filter', 'status-filter', 'clear-filters', 'export-json', 'export-csv']) {
    assert.match(html, new RegExp(`data-testid=["']${hook}["']`));
  }
  assert.doesNotMatch(html, /(?:src|href)=["']\//);
  assert.match(html, /<meta name="viewport"/);
});

test('app supports add, edit, delete, save, reset, filters, and exports', () => {
  const script = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  for (const behavior of ['render', 'openEditor', 'saveOpportunity', 'deleteOpportunity', 'downloadJson', 'downloadCsv', 'resetData']) {
    assert.match(script, new RegExp(`function ${behavior}\\b`));
  }
});

test('research is a third browsable view and loads its static UMD data before core', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(html, /data-view="research"/);
  assert.match(html, /id="research"[^>]*class="view"/);
  assert.match(html, /data-testid="research-list"/);
  assert.match(html, /15 priority CFPs researched[^<]*others remain pending/i);
  assert.ok(html.indexOf('conference-research.js') < html.indexOf('tracker-core.js'));
  assert.ok(html.indexOf('research-ui.js') < html.indexOf('app.js'));
  assert.match(app, /data-research-id/);
  assert.match(app, /renderResearch/);
});

test('sources is a fourth browsable view tracking discovery platforms and travel-grant programs', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(html, /data-view="sources"/);
  assert.match(html, /id="sources"[^>]*class="view"/);
  assert.match(html, /data-testid="sources-list"/);
  assert.match(app, /function renderSources\b/);
  assert.match(app, /function markSourceChecked\b/);
  assert.match(app, /data-check-source-id/);
});

test('mobile CSS prevents page overflow and keeps controls touch sized', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.match(css, /\.research-grid/);
});

test('ships an original monster-quest visual theme without external franchise assets', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(html, /class="quest-theme"/);
  assert.match(html, /SPEAKER QUEST/);
  assert.match(html, /class="device-lights"/);
  for (const token of ['--quest-red', '--quest-yellow', '--quest-blue', '--quest-cream', '--quest-ink']) {
    assert.match(css, new RegExp(token));
  }
  assert.match(css, /box-shadow:\s*4px 4px 0/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(html + css, /pokemon\.com|pokeapi|official pokemon/i);
});
