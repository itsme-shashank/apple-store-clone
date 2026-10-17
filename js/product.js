/* Product page: configurator + a spring-driven, flickable gallery */
Pages.product = () => {
  const params = new URLSearchParams(location.search);
  const p = getProduct(params.get('id'));
  const root = $('#pdp');

  if (!p) {
    root.innerHTML = `<div class="not-found"><h1 class="headline">We can’t find that product.</h1>
      <p class="muted" style="margin:12px 0 24px">It may have moved, or the link might be mistyped.</p>
      <a class="pill-btn" href="store.html">Browse the Store</a></div>`;
    return;
  }

  document.title = `Buy ${p.name} — Halo`;
  const opts = optionsOf(p);
  const isPhone = p.art === 'phone';
  const clampIdx = (v, max) => Math.max(0, Math.min(max, Number.isFinite(v) ? v : 0));
  const state = {
    color: clampIdx(parseInt(params.get('color'), 10), p.colors.length - 1),
    opt: opts ? clampIdx(parseInt(params.get('opt'), 10), opts.length - 1) : 0,
    trade: null,      // null = not chosen, false = no trade-in, string = device name
    care: null,       // null = not chosen, true / false
    engraving: ''
  };
  const cat = CATEGORIES.find(c => c.id === p.category);
  const carePrice = CARE_PLANS[p.category];
  const canTrade = TRADE_IN_CATEGORIES.includes(p.category);
  const canEngrave = ENGRAVABLE.includes(p.id);
  const siblings = PRODUCTS.filter(x => x.category === p.category);
  const comparable = COMPARABLE.includes(p.category);
  const maxCredit = Math.max(...TRADE_IN.map(t => t.credit));
  const slides = isPhone ? ['back', 'front', 'duo'] : p.art === 'tablet' ? ['front', 'back'] : ['main'];
  const slideLabel = { back: 'Back', front: 'Front', duo: 'Front and back', main: p.name };

  const delivery = new Date(Date.now() + 2 * 864e5).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const highlights = p.highlights
    || (isPhone ? PHONE_HIGHLIGHTS[p.variant] : p.specs.map(([k, v]) => ({ title: v + '.', text: k })));

  const optHeading = p.storage ? 'Storage. <span>How much space do you need?</span>' : p.optTitle;

  // Devices pair with accessories and audio; accessories surface other categories first
  const isDevice = !['accessories', 'audio'].includes(p.category);
  const related = PRODUCTS.filter(x => x.id !== p.id && (!isDevice || ['accessories', 'audio'].includes(x.category)))
    .sort((a, b) => (a.category === p.category) - (b.category === p.category))
    .slice(0, 8);

  root.innerHTML = `
  ${siblings.length > 1 ? `
  <nav class="chapternav" aria-label="${esc(cat.label)} models">
    <div class="chapternav-track">
      ${siblings.map(x => `<a class="chap" href="product.html?id=${x.id}" ${x.id === p.id ? 'aria-current="page"' : ''}>
        <span class="chap-art">${Art.render(x)}</span><span class="chap-name">${esc(x.name)}</span>${x.badge === 'New' ? '<em>New</em>' : ''}</a>`).join('')}
      ${comparable ? `<a class="chap" href="compare.html?c=${p.category}"><span class="chap-art icon">${Icons.compare}</span><span class="chap-name">Compare</span></a>` : ''}
      <a class="chap" href="store.html?c=accessories"><span class="chap-art">${Art.render(getProduct('magring-charger'))}</span><span class="chap-name">Accessories</span></a>
    </div>
  </nav>` : ''}
  <div class="local-nav">
    <div class="wrap local-nav-inner">
      <h2>${esc(p.name)}</h2>
      <div class="local-nav-right"><span id="lnPrice"></span><a class="pill-btn small" href="#buy">Buy</a></div>
    </div>
  </div>

  <div class="wrap pdp">
    <div class="gallery">
      <div class="gallery-frame" id="frame" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(p.name)} images">
        ${canEngrave ? `<div class="engrave-preview" id="engravePreview" data-for="${p.id}" aria-hidden="true"></div>` : ''}
        <div class="gallery-track" id="track">
          ${slides.map((s, i) => `<div class="slide" data-view="${s}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}: ${slideLabel[s]}"></div>`).join('')}
        </div>
      </div>
      ${slides.length > 1 ? `
      <div class="gallery-ui">
        <button class="paddle" data-g="-1" aria-label="Previous image">${Icons.chevronLeft}</button>
        <div class="pager" id="pager">${slides.map((s, i) => `<button data-i="${i}" aria-label="Show ${slideLabel[s]}"></button>`).join('')}</div>
        <button class="paddle" data-g="1" aria-label="Next image">${Icons.chevron}</button>
      </div>` : ''}
    </div>

    <div class="buy" id="buy">
      ${p.badge ? `<p class="eyebrow">${esc(p.badge)}</p>` : ''}
      <h1 class="headline">Buy ${esc(p.name)}</h1>
      <p class="lead">${esc(p.blurb)}</p>
      <p class="price-lg" id="price"></p>

      ${p.colors.length > 1 ? `
      <div class="step">
        <h3>Finish. <span>Pick your favourite.</span></h3>
        <div class="swatches" role="radiogroup" aria-label="Finish" id="swatches">
          ${p.colors.map((c, i) => `<button class="swatch" role="radio" style="--c:${c.hex}" data-i="${i}" aria-label="${esc(c.name)}"></button>`).join('')}
        </div>
        <p class="swatch-name" id="swatchName"></p>
      </div>` : ''}

      ${opts ? `
      <div class="step">
        <h3>${optHeading}</h3>
        <div class="opts" role="radiogroup" aria-label="${p.storage ? 'Storage' : esc(p.optTitle.split('.')[0])}" id="opts">
          ${opts.map((o, i) => `<button class="opt" role="radio" data-i="${i}"><strong>${o.label}</strong><span>${fmt(p.price + o.add)}<br>or ${emi(p.price + o.add)}/mo.</span></button>`).join('')}
        </div>
      </div>` : ''}

      ${canEngrave ? `
      <div class="step">
        <h3>Engraving. <span>Make it yours. Free.</span></h3>
        <label class="toggle-row"><input type="checkbox" id="engraveToggle"><span class="switch" aria-hidden="true"></span>Add free engraving</label>
        <div class="field" id="engraveField" hidden>
          <input id="engraveInput" maxlength="18" placeholder=" " autocomplete="off" aria-describedby="engraveCount">
          <label for="engraveInput">Name, initials or emoji</label>
          <p class="fine" id="engraveCount" style="margin:6px 4px 0">18 characters left</p>
        </div>
      </div>` : ''}

      ${canTrade ? `
      <div class="step">
        <h3>Halo Trade In. <span>Get credit toward a new ${esc(p.name)}.</span>${fn(2)}</h3>
        <div class="opts" role="radiogroup" aria-label="Trade in" id="tradeOpts">
          <button class="opt" role="radio" aria-checked="false" data-trade="yes"><strong>Select a device</strong><span>Get up to ${fmt(maxCredit)}<br>in credit</span></button>
          <button class="opt" role="radio" aria-checked="false" data-trade="no"><strong>No trade‑in</strong></button>
        </div>
        <div class="trade-pick" id="tradePick" hidden>
          <label class="select-wrap"><span>Your current device</span>
            <select class="select big" id="tradeSelect">${TRADE_IN.map(t => `<option>${esc(t.name)}</option>`).join('')}</select></label>
          <p class="trade-est" id="tradeEst"></p>
        </div>
        <button class="link-btn" data-info="trade">How does trade‑in work?</button>
      </div>` : ''}

      ${carePrice ? `
      <div class="step">
        <h3>Halo Care+ coverage. <span>Protect your new ${esc(p.name)}.</span>${fn(3)}</h3>
        <div class="opts" role="radiogroup" aria-label="Halo Care+" id="careOpts">
          <button class="opt care-opt" role="radio" aria-checked="false" data-care="yes">
            <strong>Halo Care+</strong><span>${fmt(carePrice)}<br>or ${emi(carePrice)}/mo.</span>
            <ul class="care-points"><li>Unlimited repairs for accidental damage</li><li>Priority access to Specialists</li><li>Battery service coverage</li></ul>
          </button>
          <button class="opt" role="radio" aria-checked="false" data-care="no"><strong>No Halo Care+ coverage</strong></button>
        </div>
      </div>` : ''}

      <div class="summary-box" id="summaryBox">
        <div class="total"><span id="cfgName"></span><strong id="total"></strong></div>
        <p class="fine" id="tradeLine" hidden></p>
        <p class="fine" id="emiLine"></p>
        <button class="pill-btn block" id="addBtn">Add to Bag</button>
        <button class="save-btn" id="saveBtn" aria-pressed="false"></button>
      </div>

      <div class="step delivery">
        <h3>Delivery and pickup. <span>Check when it’ll arrive.</span></h3>
        <form class="pin-check" id="pinForm" novalidate>
          <div class="field"><input id="pinInput" inputmode="numeric" maxlength="6" placeholder=" " autocomplete="postal-code"><label for="pinInput">PIN code</label></div>
          <button class="pill-btn ghost" type="submit">Check</button>
        </form>
        <div class="pin-result" id="pinResult" aria-live="polite"></div>
      </div>

      <div class="perks">
        <div class="perk">${Icons.truck}<p><strong>Free delivery</strong>Order today, delivered by ${delivery}.</p></div>
        <div class="perk">${Icons.card}<p><strong>No‑cost EMI</strong>Up to 24 months on eligible cards.</p></div>
        ${canTrade ? `<div class="perk">${Icons.swap}<p><strong>Trade in</strong>Get up to ${fmt(maxCredit)} credit toward your new ${esc(cat.label.toLowerCase())}.</p></div>` : ''}
      </div>

      <div class="help-card">
        <p><strong>Need shopping help?</strong><button class="pill-link" data-help>Chat with a Specialist ${Icons.chevron}</button></p>
        ${comparable ? `<p><strong>Which ${esc(cat.label.toLowerCase())} is right for you?</strong><a class="pill-link" href="compare.html?c=${p.category}">Compare models ${Icons.chevron}</a></p>` : ''}
      </div>
    </div>
  </div>

  <section class="section dark-band" id="highlights" aria-labelledby="h-hl">
    <div class="wrap">
      <div class="section-head"><h2 class="headline reveal" id="h-hl">Get the highlights. <span>${esc(p.tagline)}</span></h2></div>
      <div class="highlights">
        ${highlights.map(h => `<div class="hl reveal"><p><strong>${esc(h.title)}</strong> ${esc(h.text)}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="h-specs">
    <div class="wrap">
      <div class="section-head"><h2 class="headline reveal" id="h-specs">Tech specs.</h2></div>
      <dl class="specs reveal">${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
  </section>

  <section class="section alt shelf" aria-labelledby="h-rel">
    <div class="wrap section-head"><h2 class="headline reveal" id="h-rel">Pairs well with. <span>Complete your setup.</span></h2></div>
    <div class="shelf-track">${related.map(cardHTML).join('')}</div>
  </section>
  ${footnotesHTML()}
  <div class="buybar" id="buybar" aria-hidden="true">
    <div class="wrap buybar-inner">
      <div class="buybar-info"><strong id="bbName"></strong><span id="bbPrice"></span></div>
      <button class="pill-btn" id="bbAdd" tabindex="-1">Add to Bag</button>
    </div>
  </div>`;

  /* ---------- Configurator ---------- */
  const color = () => p.colors[state.color];
  const unit = () => p.price + (opts ? opts[state.opt].add : 0) + (state.care ? carePrice : 0);
  const credit = () => (state.trade ? TRADE_IN.find(t => t.name === state.trade).credit : 0);
  const bagItem = () => ({
    id: p.id, color: color().name, option: opts ? opts[state.opt].label : null,
    care: !!state.care, engraving: state.engraving.trim() || null, tradeIn: state.trade || null
  });

  function renderSlides(animated) {
    $$('.slide', root).forEach(slide => {
      const view = slide.dataset.view;
      const html = view === 'duo' ? Art.duo(p, color().hex) : Art.render(p, { hex: color().hex, view });
      if (!animated || Motion.reducedMotion()) { slide.innerHTML = html; return; }
      slide.classList.add('swap');
      setTimeout(() => {
        slide.innerHTML = html;
        requestAnimationFrame(() => requestAnimationFrame(() => slide.classList.remove('swap')));
      }, 140);
    });
  }

  function renderConfig() {
    $$('#swatches .swatch', root).forEach((b, i) => {
      b.setAttribute('aria-checked', String(i === state.color));
      b.tabIndex = i === state.color ? 0 : -1;
    });
    $$('#opts .opt', root).forEach((b, i) => {
      b.setAttribute('aria-checked', String(i === state.opt));
      b.tabIndex = i === state.opt ? 0 : -1;
    });
    if ($('#swatchName')) $('#swatchName').textContent = color().name;
    const price = unit();
    $('#price').innerHTML = `${opts && opts.length > 1 ? 'From ' + fmt(p.price) : fmt(p.price)}<small>or ${emi(p.price)}/mo. for 24 mo. with no‑cost EMI${fn(1)}</small>`;
    $('#lnPrice').textContent = `${fmt(price)} or ${emi(price)}/mo.`;
    const name = [p.colors.length > 1 ? color().name : null, opts ? opts[state.opt].label : null, state.care ? 'Care+' : null].filter(Boolean).join(' · ') || p.name;
    const due = Math.max(0, price - credit());
    $('#cfgName').textContent = name;
    $('#total').textContent = fmt(due);
    $('#tradeLine').hidden = !state.trade;
    $('#tradeLine').textContent = state.trade ? `${fmt(price)} − ${fmt(credit())} trade‑in credit for ${state.trade}` : '';
    $('#emiLine').innerHTML = `Or ${emi(due)}/mo. for 24 months${fn(1)}. Free delivery and free returns.`;
    $('#bbName').textContent = `${p.name} · ${name}`;
    $('#bbPrice').textContent = `${fmt(due)} or ${emi(due)}/mo.`;
    $$('#careOpts .opt', root).forEach(b => b.setAttribute('aria-checked', String(state.care === (b.dataset.care === 'yes'))));
    $$('#tradeOpts .opt', root).forEach(b => b.setAttribute('aria-checked', String(state.trade === null ? false : (b.dataset.trade === 'yes') === !!state.trade)));
    if ($('#tradePick')) {
      $('#tradePick').hidden = !state.trade;
      if (state.trade) $('#tradeEst').innerHTML = `Estimated credit: <strong>${fmt(credit())}</strong>. We’ll confirm it when we collect your device.`;
    }
    renderSave();

    const u = new URLSearchParams({ id: p.id });
    if (state.color) u.set('color', state.color);
    if (state.opt) u.set('opt', state.opt);
    history.replaceState(null, '', `?${u}${location.hash}`);
  }

  // Radio groups: click to choose, arrow keys to move
  function radioGroup(sel, key, onChange) {
    const group = $(sel, root);
    if (!group) return;
    group.addEventListener('click', e => {
      const b = e.target.closest('[role="radio"]');
      if (!b) return;
      const i = Number(b.dataset.i);
      if (i === state[key]) return;
      state[key] = i;
      onChange();
    });
    group.addEventListener('keydown', e => {
      const n = group.querySelectorAll('[role="radio"]').length;
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      state[key] = (state[key] + d + n) % n;
      onChange();
      group.querySelectorAll('[role="radio"]')[state[key]].focus();
    });
  }
  radioGroup('#swatches', 'color', () => { renderConfig(); renderSlides(true); });
  radioGroup('#opts', 'opt', renderConfig);

  $('#addBtn').addEventListener('click', () => addToBag(bagItem()));
  $('#bbAdd').addEventListener('click', () => addToBag(bagItem()));

  /* ---------- Save for later ---------- */
  function renderSave() {
    const on = Saves.has(bagItem());
    const b = $('#saveBtn');
    b.setAttribute('aria-pressed', String(on));
    b.innerHTML = `${on ? Icons.bookmarkFill : Icons.bookmark}<span>${on ? 'Saved' : 'Save for later'}</span>`;
  }
  $('#saveBtn').addEventListener('click', () => {
    const on = Saves.toggle(bagItem());
    renderSave();
    toast(on ? `${p.name} saved. Find it in Your Saves.` : 'Removed from Your Saves.', on ? 'View' : null, () => { location.href = 'saves.html'; });
  });

  /* ---------- Trade-in & Care+ ---------- */
  $('#tradeOpts') && $('#tradeOpts').addEventListener('click', e => {
    const b = e.target.closest('[data-trade]');
    if (!b) return;
    state.trade = b.dataset.trade === 'yes' ? $('#tradeSelect').value : false;
    renderConfig();
  });
  $('#tradeSelect') && $('#tradeSelect').addEventListener('change', e => { state.trade = e.target.value; renderConfig(); });
  $('#careOpts') && $('#careOpts').addEventListener('click', e => {
    const b = e.target.closest('[data-care]');
    if (!b) return;
    state.care = b.dataset.care === 'yes';
    renderConfig();
  });
  root.addEventListener('click', e => {
    const info = e.target.closest('[data-info="trade"]');
    if (!info) return;
    Modal.open(`<div class="modal-icon">${Icons.swap}</div><h2 class="title">How trade‑in works.</h2>
      <ol class="modal-steps">
        <li><strong>Tell us about your device.</strong> Pick it while you buy and we’ll apply an estimated credit right away.</li>
        <li><strong>Get your new Halo.</strong> Your order arrives as usual, with the credit already taken off.</li>
        <li><strong>Hand over your old device.</strong> We check it at your door. If it matches what you told us, you’re done.</li>
      </ol>`, info);
  });

  /* ---------- Engraving with a live preview on the product ---------- */
  if (canEngrave) {
    const toggle = $('#engraveToggle'), input = $('#engraveInput'), preview = $('#engravePreview');
    const sync = () => {
      state.engraving = toggle.checked ? input.value : '';
      preview.textContent = state.engraving.trim();
      preview.classList.toggle('show', !!state.engraving.trim());
      $('#engraveCount').textContent = `${18 - input.value.length} characters left`;
      renderConfig();
    };
    toggle.addEventListener('change', () => {
      $('#engraveField').hidden = !toggle.checked;
      if (toggle.checked) input.focus();
      sync();
    });
    input.addEventListener('input', sync);
  }

  /* ---------- Delivery & pickup check ---------- */
  const CITIES = { 11: 'Delhi', 12: 'Gurugram', 40: 'Mumbai', 41: 'Pune', 56: 'Bengaluru', 60: 'Chennai', 50: 'Hyderabad', 70: 'Kolkata', 38: 'Ahmedabad' };
  function checkPin(pin) {
    const out = $('#pinResult');
    if (!/^[1-9]\d{5}$/.test(pin)) {
      out.innerHTML = `<p class="pin-error">Enter a valid 6‑digit PIN code.</p>`;
      return;
    }
    try { localStorage.setItem('halo.pin', pin); } catch {}
    const city = CITIES[pin.slice(0, 2)];
    const day = n => new Date(Date.now() + n * 864e5).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    out.innerHTML = `
      <div class="pin-row">${Icons.truck}<p><strong>Delivery to ${pin}</strong>${city ? `Today, within 2 hours — Free<br><span class="muted">Order by 6 pm.</span>` : `${day(3)} — Free`}</p></div>
      <div class="pin-row">${Icons.store}<p><strong>Pickup</strong>${city ? `Available today at Halo ${city}` : 'No Halo Store near this PIN code. Delivery is free.'}</p></div>`;
  }
  $('#pinForm').addEventListener('submit', e => { e.preventDefault(); checkPin($('#pinInput').value.trim()); });
  $('#pinInput').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6); });
  try {
    const saved = localStorage.getItem('halo.pin');
    if (saved) { $('#pinInput').value = saved; checkPin(saved); }
  } catch {}

  /* ---------- Sticky buy bar: shown while configuring, hidden when the summary is on screen ---------- */
  const bar = $('#buybar');
  if ('IntersectionObserver' in window) {
    const seen = { buy: false, summary: false };
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { seen[en.target === $('#summaryBox') ? 'summary' : 'buy'] = en.isIntersecting; });
      const show = seen.buy && !seen.summary && window.scrollY > 200;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', String(!show));
      $('#bbAdd').tabIndex = show ? 0 : -1;
    });
    io.observe($('#buy'));
    io.observe($('#summaryBox'));
  }

  renderSlides(false);
  renderConfig();

  /* ---------- Gallery: 1:1 drag, momentum projection, rubber-banded edges ---------- */
  const frame = $('#frame'), track = $('#track');
  const count = slides.length;
  let index = 0, x = 0, anim = null, startX = 0, startIndex = 0;
  const width = () => frame.clientWidth;
  const setX = v => { x = v; track.style.transform = `translate3d(${v}px,0,0)`; };

  function goTo(i, velocity = 0, damping = 1) {
    index = Math.max(0, Math.min(count - 1, i));
    $$('#pager button', root).forEach((b, n) => b.setAttribute('aria-current', String(n === index)));
    $$('.slide', root).forEach((s, n) => s.setAttribute('aria-hidden', String(n !== index)));
    anim && anim.stop();
    anim = Motion.spring({ from: x, to: -index * width(), velocity, damping, response: 0.45, onUpdate: setX });
  }

  if (count > 1) {
    Motion.hDrag(frame, {
      ignore: null,
      onStart() { anim && anim.stop(); startX = x; startIndex = index; },
      onMove(dx) {
        const min = -(count - 1) * width();
        let nx = startX + dx;
        if (nx > 0) nx = Motion.rubberband(nx, width());
        else if (nx < min) nx = min - Motion.rubberband(min - nx, width());
        setX(nx);
      },
      onEnd(v) {
        // Choose the target from where the flick is heading, one page at a time
        const projected = x + Motion.project(v, 0.99);
        let target = Math.round(-projected / width());
        target = Math.max(startIndex - 1, Math.min(startIndex + 1, target));
        goTo(target, v, Math.abs(v) > 300 ? 0.8 : 1);
      }
    });
    root.addEventListener('click', e => {
      const g = e.target.closest('[data-g]');
      if (g) goTo(index + Number(g.dataset.g));
      const dot = e.target.closest('#pager button');
      if (dot) goTo(Number(dot.dataset.i));
    });
    frame.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
    });
    window.addEventListener('resize', () => { anim && anim.stop(); setX(-index * width()); });
    goTo(0);
  }

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    target && requestAnimationFrame(() => target.scrollIntoView());
  }
};
