/* Compare page: pick up to three models in a family and line their specs up row by row */
Pages.compare = () => {
  const params = new URLSearchParams(location.search);
  let c = COMPARABLE.includes(params.get('c')) ? params.get('c') : 'phones';
  let picks = [];
  const columns = () => (matchMedia('(max-width: 733px)').matches ? 2 : 3);

  function family() { return PRODUCTS.filter(p => p.category === c); }

  function renderTabs() {
    $('#cmpTabs').innerHTML = COMPARABLE.map(id => {
      const cat = CATEGORIES.find(x => x.id === id);
      return `<button role="tab" aria-selected="${id === c}" data-tab="${id}">${cat.label}</button>`;
    }).join('');
    $('#cmpCat').textContent = CATEGORIES.find(x => x.id === c).label;
    document.title = `Compare ${CATEGORIES.find(x => x.id === c).label} models — Halo`;
  }

  function render() {
    const list = family();
    const n = Math.min(columns(), list.length);
    picks = picks.slice(0, n);
    while (picks.length < n) picks.push(list.find(p => !picks.includes(p.id)).id);
    const chosen = picks.map(getProduct);
    const cols = `style="--cols:${n}"`;

    $('#cmpPickers').innerHTML = `<div class="cmp-cols" ${cols}>${chosen.map((p, k) => `
      <label class="cmp-select"><span class="sr">Model ${k + 1}</span>
        <select class="select" data-col="${k}">${list.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
      </label>`).join('')}</div>`;

    const labels = [...new Set(chosen.flatMap(p => p.specs.map(s => s[0])))];
    const value = (p, label) => (p.specs.find(s => s[0] === label) || [, '—'])[1];
    $('#cmpBody').innerHTML = `
      <div class="cmp-cols cmp-heads" ${cols}>${chosen.map(p => `
        <div class="cmp-head">
          <a class="cmp-art" href="product.html?id=${p.id}" data-art-id="${p.id}">${Art.render(p)}</a>
          ${colorDots(p, 8)}
          ${p.badge ? `<p class="eyebrow">${esc(p.badge)}</p>` : ''}
          <h2>${esc(p.name)}</h2>
          <p class="muted">${esc(p.tagline)}</p>
          <p class="cmp-price">From ${fmt(p.price)}</p>
          <a class="pill-btn small" href="product.html?id=${p.id}">Buy</a>
        </div>`).join('')}</div>
      <div class="cmp-row"><p class="cmp-label">Finishes</p><div class="cmp-cols" ${cols}>${chosen.map(p => `<p>${p.colors.map(x => esc(x.name)).join(', ')}</p>`).join('')}</div></div>
      ${optionsOf(chosen[0]) ? `<div class="cmp-row"><p class="cmp-label">${chosen[0].storage ? 'Capacity' : 'Sizes'}</p><div class="cmp-cols" ${cols}>${chosen.map(p => `<p>${(optionsOf(p) || []).map(o => o.label).join(', ') || '—'}</p>`).join('')}</div></div>` : ''}
      ${labels.map(l => `
      <div class="cmp-row"><p class="cmp-label">${esc(l)}</p>
        <div class="cmp-cols" ${cols}>${chosen.map(p => `<p class="${value(p, l) === '—' ? 'none' : ''}">${esc(value(p, l))}</p>`).join('')}</div>
      </div>`).join('')}`;

    const u = new URLSearchParams({ c });
    history.replaceState(null, '', `?${u}`);
  }

  $('#cmpTabs').addEventListener('click', e => {
    const t = e.target.closest('[data-tab]');
    if (!t || t.dataset.tab === c) return;
    c = t.dataset.tab; picks = [];
    renderTabs(); render();
  });
  $('#cmpPickers').addEventListener('change', e => {
    const sel = e.target.closest('select');
    if (!sel) return;
    const k = Number(sel.dataset.col);
    const other = picks.indexOf(sel.value);
    if (other > -1) picks[other] = picks[k]; // picking a model shown elsewhere swaps the two columns
    picks[k] = sel.value;
    render();
  });
  // Hover a colour to preview it
  $('#cmpBody').addEventListener('pointerover', e => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    const art = dot.closest('.cmp-head').querySelector('.cmp-art');
    art.innerHTML = Art.render(getProduct(art.dataset.artId), { hex: dot.dataset.hex });
  });
  matchMedia('(max-width: 733px)').addEventListener('change', render);

  renderTabs();
  render();
};
