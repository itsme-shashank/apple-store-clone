/* Store page: category chips, live filter and sort, all reflected in the URL */
Pages.store = () => {
  const params = new URLSearchParams(location.search);
  const state = {
    c: CATEGORIES.some(c => c.id === params.get('c')) ? params.get('c') : 'all',
    q: params.get('q') || '',
    sort: params.get('sort') || 'featured'
  };
  const q = $('#q'), sort = $('#sort');
  q.value = state.q;
  sort.value = state.sort;

  function renderChips() {
    $('#catStrip').innerHTML = CATEGORIES.filter(c => c.id !== 'all').map(c =>
      `<button class="cat" data-c="${c.id}" aria-pressed="${c.id === state.c}">
        <span class="cat-art">${Art.render(getProduct(CATEGORY_ICON[c.id]))}</span>${c.label}</button>`).join('');
    $('#chips').innerHTML = CATEGORIES.map(c =>
      `<button class="chip" data-c="${c.id}" aria-pressed="${c.id === state.c}">${c.label}</button>`).join('');
  }

  function render() {
    $('#storeShelves').hidden = state.c !== 'all' || !!state.q.trim();
    const term = state.q.trim().toLowerCase();
    let list = PRODUCTS.filter(p =>
      (state.c === 'all' || p.category === state.c) &&
      (!term || [p.name, p.tagline, p.category, p.blurb].join(' ').toLowerCase().includes(term)));

    if (state.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
    $('#grid').innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="empty" style="grid-column:1/-1"><div class="empty-ring">${Icons.search}</div>
           <h3>No matches for “${esc(state.q)}”.</h3><p>Try a different word, or <button class="link-btn" id="clearFilters">clear filters</button>.</p></div>`;
    // Stagger the cards in, briefly
    $$('#grid .card').forEach((card, i) => { card.style.animationDelay = `${Math.min(i, 8) * 35}ms`; });

    const url = new URLSearchParams();
    if (state.c !== 'all') url.set('c', state.c);
    if (state.q) url.set('q', state.q);
    if (state.sort !== 'featured') url.set('sort', state.sort);
    const qs = url.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);

    const cat = CATEGORIES.find(c => c.id === state.c);
    document.title = `${state.c === 'all' ? 'Store' : cat.label} — Halo`;
  }

  const pickCategory = e => {
    const chip = e.target.closest('[data-c]');
    if (!chip) return;
    // Tapping the active category again clears it
    state.c = chip.classList.contains('cat') && state.c === chip.dataset.c ? 'all' : chip.dataset.c;
    renderChips();
    render();
  };
  $('#chips').addEventListener('click', pickCategory);
  $('#catStrip').addEventListener('click', pickCategory);
  q.addEventListener('input', () => { state.q = q.value; render(); });
  sort.addEventListener('change', () => { state.sort = sort.value; render(); });
  $('#grid').addEventListener('click', e => {
    if (e.target.id === 'clearFilters') {
      state.q = ''; state.c = 'all'; q.value = '';
      renderChips(); render();
    }
  });

  // Promotional shelves only show on the unfiltered store
  $('#latestTrack').innerHTML = LATEST.map(l => {
    const p = getProduct(l.id);
    return `
    <a class="promo-card ${l.theme || ''}" href="${link(`product.html?id=${p.id}`)}">
      <p class="eyebrow">${esc(l.eyebrow)}</p>
      <h3>${esc(l.title)}</h3>
      <p class="promo-text">${esc(l.text)}</p>
      <p class="promo-price">From ${fmt(p.price)} or ${emi(p.price)}/mo.</p>
      <div class="promo-art art-${p.art}">${Art.render(p, { hex: l.hex })}</div>
    </a>`;
  }).join('');
  $('#helpTrack').innerHTML = [
    [Icons.chat, 'Shop one on one with a Specialist.', 'Online or in a store.', 'data-help'],
    [Icons.store, 'Visit a Halo Store.', 'Get hands‑on with every product and pick up today.', `href="${link(`support.html#contact`)}"`],
    [Icons.gift, 'Join a free session.', 'Learn photography, music and more at Today at Halo.', `href="${link(`support.html#contact`)}"`],
    [Icons.truck, 'Track your order.', 'See delivery status or change your address.', `href="${link(`support.html#orders`)}"`]
  ].map(([icon, h, t, attr]) => {
    const tag = attr.startsWith('href') ? 'a' : 'button';
    return `<${tag} class="help-tile" ${attr}>${icon}<h3>${h}</h3><p>${t}</p></${tag}>`;
  }).join('');
  $('#whyTrack').innerHTML = whyCardsHTML();
  $('main').insertAdjacentHTML('beforeend', footnotesHTML());

  renderChips();
  render();
};
