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

test('mobile CSS prevents page overflow and keeps controls touch sized', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
});
