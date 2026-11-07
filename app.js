(function () {
  'use strict';
  const core = window.SpeakerTrackerCore;
  let state = core.loadState(localStorage);
  let activeEditId = null;

  const $ = id => document.getElementById(id);
  const els = {
    list: $('opportunityList'), talks: $('talkList'), empty: $('emptyState'), count: $('resultCount'),
    search: $('search'), statusFilter: $('statusFilter'), sourceFilter: $('sourceFilter'), deadlineFilter: $('deadlineFilter'), priorityFilter: $('priorityFilter'),
    dialog: $('editorDialog'), form: $('opportunityForm'), toast: $('toast')
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function dateLabel(value) {
    if (!value) return 'No date';
    const [y, m, d] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('en-GB', {day:'numeric', month:'short', year:'numeric', timeZone:'UTC'}).format(new Date(Date.UTC(y, m - 1, d)));
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function persist(message) {
    core.saveState(localStorage, state);
    if (message) showToast(message);
  }

  function statusOptions(selected) {
    return core.STATUSES.map(status => `<option${status === selected ? ' selected' : ''}>${escapeHtml(status)}</option>`).join('');
  }

  function currentFilters() {
    return {search: els.search.value, status: els.statusFilter.value, source: els.sourceFilter.value, deadline: els.deadlineFilter.value, priority: els.priorityFilter.value};
  }

  function renderMetrics() {
    const active = core.activeOpportunities(state.opportunities);
    const deadlines = active.map(item => core.deadlineState(item.deadlineDate));
    $('metricOpen').textContent = active.length;
    $('metricSoon').textContent = deadlines.filter(x => x.days !== null && x.days <= 21).length;
    $('metricDrafting').textContent = active.filter(x => x.status === 'Drafting').length;
    $('metricSubmitted').textContent = active.filter(x => x.status === 'Submitted').length;
  }

  function cardHtml(item) {
    const deadline = core.deadlineState(item.deadlineDate);
    const match = core.bestTalk(item, state.talks);
    const sourceType = item.sourceType || 'Official CFP';
    const sourceClass = sourceType === 'LinkedIn lead' ? 'linkedin' : sourceType.startsWith('Sessionize') ? 'sessionize' : '';
    const travel = item.travelSupport || (item.deliveryMode === 'Online' ? 'Online / no trip' : 'Not stated');
    const travelClass = travel === 'Travel sponsored' ? 'funded' : travel === 'Partial / conditional' ? 'partial' : travel === 'Not covered' ? 'unfunded' : 'neutral';
    const actionLabel = sourceType === 'LinkedIn lead' ? 'View LinkedIn' : sourceType === 'Sessionize recommendation' ? 'Open group' : 'Open CFP';
    return `<article class="opportunity-card" data-testid="opportunity-item" data-record-id="${escapeHtml(item.id)}">
      <div class="opportunity-title"><span class="priority-dot ${escapeHtml(item.priority)}" aria-hidden="true"></span><div><div class="record-badges"><span class="source-badge ${sourceClass}">${escapeHtml(sourceType)}</span><span class="travel-badge ${travelClass}">${travel === 'Travel sponsored' ? 'Trip sponsored' : escapeHtml(travel)}</span></div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.category)} · ${escapeHtml(item.location)} · event ${dateLabel(item.eventDate)}</p></div></div>
      <div class="status-cell"><span class="label">Application</span><select class="status-select" data-status-id="${escapeHtml(item.id)}" aria-label="Application status for ${escapeHtml(item.name)}">${statusOptions(item.status)}</select></div>
      <div class="deadline"><span class="label">CFP deadline</span><strong>${dateLabel(item.deadlineDate)}</strong><span class="deadline-badge ${deadline.key}">${escapeHtml(deadline.label)}</span></div>
      <div class="card-actions"><a class="primary cfp-link" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">${actionLabel}</a><button class="quiet edit-button" data-edit-id="${escapeHtml(item.id)}" data-testid="edit-opportunity" type="button">Edit</button></div>
      <div class="talk-match"><span class="label">Best talk match</span>${match ? `<strong>${escapeHtml(match.talk.title)} <span class="score">${match.score}%</span></strong><small>${escapeHtml(match.reasons.slice(0,2).join(' · '))}</small>` : '<strong>No talk idea yet</strong>'}</div>
      <div class="next-action"><span><b>Travel:</b> ${escapeHtml(item.travelDetails || travel)}</span><span><b>Next:</b> ${escapeHtml(item.nextAction || 'Choose a next action.')}</span></div>
    </article>`;
  }

  function renderTalks() {
    els.talks.innerHTML = state.talks.map(talk => `<article class="talk-card"><p class="kicker">${escapeHtml(talk.stage.toUpperCase())}${talk.demoReady ? ' · DEMO READY' : ''}</p><h3>${escapeHtml(talk.title)}</h3><p>${escapeHtml(talk.pitch)}</p><div class="chips">${talk.topics.map(topic => `<span class="chip">${escapeHtml(topic)}</span>`).join('')}</div></article>`).join('');
  }

  function render() {
    const filtered = core.filterOpportunities(state.opportunities, currentFilters());
    filtered.sort((a, b) => {
      const ad = core.deadlineState(a.deadlineDate).days;
      const bd = core.deadlineState(b.deadlineDate).days;
      return (ad ?? 99999) - (bd ?? 99999) || a.name.localeCompare(b.name);
    });
    els.list.innerHTML = filtered.map(cardHtml).join('');
    els.empty.hidden = filtered.length !== 0;
    const activeCount = core.activeOpportunities(state.opportunities).length;
    els.count.textContent = `${filtered.length} of ${activeCount} open opportunities`;
    renderMetrics();
    renderTalks();
  }

  function clearFilters() {
    els.search.value = '';
    els.statusFilter.value = 'all';
    els.sourceFilter.value = 'all';
    els.deadlineFilter.value = 'all';
    els.priorityFilter.value = 'all';
    render();
  }

  function fillEditor(item) {
    $('recordId').value = item ? item.id : '';
    $('nameField').value = item?.name || '';
    $('categoryField').value = item?.category || '';
    $('locationField').value = item?.location || '';
    $('eventDateField').value = item?.eventDate || '';
    $('deadlineField').value = item?.deadlineDate || '';
    $('modeField').value = item?.deliveryMode || 'Hybrid';
    $('statusField').value = item?.status || 'Not started';
    $('priorityField').value = item?.priority || 'Medium';
    $('sourceTypeField').value = item?.sourceType || 'Official CFP';
    $('sourceField').value = item?.source || '';
    $('sourceUrlField').value = item?.sourceUrl || '';
    $('travelSupportField').value = item?.travelSupport || (item?.deliveryMode === 'Online' ? 'Online / no trip' : 'Not stated');
    $('travelDetailsField').value = item?.travelDetails || '';
    $('topicsField').value = (item?.topics || []).join(', ');
    $('nextActionField').value = item?.nextAction || '';
    $('notesField').value = item?.notes || '';
  }

  function openEditor(id) {
    activeEditId = id || null;
    const item = id ? state.opportunities.find(x => x.id === id) : null;
    $('editorTitle').textContent = item ? 'Edit opportunity' : 'Add opportunity';
    $('deleteButton').hidden = !item;
    fillEditor(item);
    els.dialog.showModal();
    $('nameField').focus();
  }

  function closeEditor() {
    els.form.reset();
    activeEditId = null;
    els.dialog.close();
  }

  function formRecord() {
    const old = state.opportunities.find(x => x.id === activeEditId);
    const status = $('statusField').value;
    return {
      ...(old || {}),
      id: old?.id || core.createId($('nameField').value, state.opportunities),
      name: $('nameField').value.trim(), category: $('categoryField').value.trim(), location: $('locationField').value.trim(),
      eventDate: $('eventDateField').value, deadlineDate: $('deadlineField').value, deadlineTimezone: old?.deadlineTimezone || 'UTC',
      deliveryMode: $('modeField').value, status, priority: $('priorityField').value, sourceType: $('sourceTypeField').value,
      source: $('sourceField').value.trim(), sourceUrl: $('sourceUrlField').value.trim(), sourceStatus: old?.sourceStatus || '', sourceScore: old?.sourceScore ?? '',
      travelSupport: $('travelSupportField').value, travelDetails: $('travelDetailsField').value.trim(),
      topics: $('topicsField').value.split(',').map(x => x.trim()).filter(Boolean), audience: old?.audience || ['Developers'],
      matchedTalkIds: old?.matchedTalkIds || [], nextAction: $('nextActionField').value.trim(), notes: $('notesField').value,
      submittedAt: status === 'Submitted' ? (old?.submittedAt || new Date().toISOString().slice(0,10)) : (old?.submittedAt || ''),
      confirmationReference: old?.confirmationReference || '', lastUpdated: new Date().toISOString().slice(0,10)
    };
  }

  function saveOpportunity(event) {
    event.preventDefault();
    const deadlineInput = $('deadlineField');
    deadlineInput.setCustomValidity(core.deadlineState(deadlineInput.value).key === 'passed' ? 'Only CFPs with an unexpired deadline can be tracked.' : '');
    if (!els.form.reportValidity()) return;
    const record = formRecord();
    const index = state.opportunities.findIndex(x => x.id === activeEditId);
    if (index >= 0) state.opportunities[index] = record;
    else state.opportunities.push(record);
    persist(index >= 0 ? 'Opportunity updated' : 'Opportunity added');
    closeEditor();
    render();
  }

  function deleteOpportunity() {
    if (!activeEditId) return;
    const item = state.opportunities.find(x => x.id === activeEditId);
    if (!window.confirm(`Delete “${item.name}”?`)) return;
    if (core.SEED_OPPORTUNITIES.some(seed => seed.id === activeEditId)) {
      state.dismissedIds = [...new Set([...(state.dismissedIds || []), activeEditId])];
    }
    state.opportunities = state.opportunities.filter(x => x.id !== activeEditId);
    persist('Opportunity deleted');
    closeEditor();
    render();
  }

  function download(name, type, content) {
    const url = URL.createObjectURL(new Blob([content], {type}));
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function downloadJson() {
    const activeState = {...state, opportunities: core.activeOpportunities(state.opportunities)};
    download('speaker-application-tracker.json', 'application/json;charset=utf-8', JSON.stringify(activeState, null, 2));
    showToast('JSON backup exported');
  }

  function downloadCsv() {
    download('speaker-opportunities.csv', 'text/csv;charset=utf-8', '\ufeff' + core.toCsv(core.activeOpportunities(state.opportunities)));
    showToast('CSV exported');
  }

  function resetData() {
    if (!window.confirm('Replace all saved data with the current open CFPs and starter talk ideas?')) return;
    state = core.initialState();
    persist('Seed data restored');
    clearFilters();
  }

  async function importJson(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || parsed.version !== 5 || !Array.isArray(parsed.opportunities) || !Array.isArray(parsed.talks)) throw new Error('Unsupported file');
      state = {...parsed, opportunities: core.activeOpportunities(parsed.opportunities)}; persist('Backup imported'); clearFilters();
    } catch (error) {
      window.alert(`Could not import this file: ${error.message}`);
    } finally { $('importJson').value = ''; }
  }

  core.STATUSES.forEach(status => {
    els.statusFilter.insertAdjacentHTML('beforeend', `<option>${escapeHtml(status)}</option>`);
    $('statusField').insertAdjacentHTML('beforeend', `<option>${escapeHtml(status)}</option>`);
  });

  $('deadlineField').min = new Date().toISOString().slice(0, 10);
  $('deadlineField').addEventListener('input', event => event.target.setCustomValidity(''));
  $('addButton').addEventListener('click', () => openEditor());
  $('closeEditor').addEventListener('click', closeEditor);
  $('cancelEditor').addEventListener('click', closeEditor);
  $('deleteButton').addEventListener('click', deleteOpportunity);
  els.form.addEventListener('submit', saveOpportunity);
  ['input','change'].forEach(event => $('filters').addEventListener(event, render));
  $('clearFilters').addEventListener('click', clearFilters);
  $('emptyClear').addEventListener('click', clearFilters);
  $('exportJson').addEventListener('click', downloadJson);
  $('exportCsv').addEventListener('click', downloadCsv);
  $('resetData').addEventListener('click', resetData);
  $('importJson').addEventListener('change', event => importJson(event.target.files[0]));
  els.list.addEventListener('click', event => { const button = event.target.closest('[data-edit-id]'); if (button) openEditor(button.dataset.editId); });
  els.list.addEventListener('change', event => {
    const select = event.target.closest('[data-status-id]');
    if (!select) return;
    const item = state.opportunities.find(x => x.id === select.dataset.statusId);
    if (item) { item.status = select.value; item.lastUpdated = new Date().toISOString().slice(0,10); persist('Status updated'); render(); }
  });
  document.querySelectorAll('.view-tab').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.view-tab').forEach(x => { x.classList.toggle('active', x === button); x.setAttribute('aria-selected', x === button ? 'true' : 'false'); });
    document.querySelectorAll('.view').forEach(view => { const active = view.id === button.dataset.view; view.classList.toggle('active', active); view.hidden = !active; });
  }));
  els.dialog.addEventListener('click', event => { if (event.target === els.dialog) closeEditor(); });
  render();
})();
