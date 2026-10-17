/* Home page: hydrate artwork and shelves from the catalogue */
Pages.home = () => {
  $$('[data-price]').forEach(el => {
    const p = getProduct(el.dataset.price);
    el.innerHTML = `From ${fmt(p.price)} or ${emi(p.price)}/mo. for 24 mo.${fn(1)}`;
  });

  // Product tiles, two per row, alternating light and dark like a checkerboard
  const tiles = [
    { id: 'halo-book-air', sub: 'Lean. Mean. H5 machine.', hex: '#a9c1d9' },
    { id: 'halo-watch-s2', sub: 'Thin. Bright. Brilliant.', theme: 'dark', hex: '#e8c4b8' },
    { id: 'halo-pad-pro', sub: 'Thin. Powerful. Pro.', theme: 'dark', hex: '#d7d8da' },
    { id: 'halo-vision-pro', sub: 'Step into spatial computing.' },
    { id: 'halo-16-air', sub: 'Thin. Light. Unbelievable.', hex: '#c6d8e8', phone: true },
    { id: 'halo-buds-pro', sub: 'Silence, perfected.', theme: 'dark', add: true },
    { id: 'halo-sphere', sub: 'Sound that fills the room. A smart home hub inside.', theme: 'dark', hex: '#ececec' },
    { id: 'halo-tv-4k', sub: 'Cinematic in every sense.', theme: 'white' },
    { id: 'halo-pods-max', sub: 'Immersive, over‑ear sound. Five new colours.', theme: 'dark', hex: '#f0a77c' },
    { id: 'magring', title: 'MagRing', sub: 'Snap on a charger. Snap on a battery. Snap on a case.', href: link('store.html?c=accessories'), cta: 'Shop accessories' }
  ];
  $('#tileGrid').innerHTML = tiles.map(t => {
    const p = getProduct(t.id);
    const title = t.title || p.name;
    let art;
    if (t.id === 'magring') {
      art = `<div class="tile-art reveal ring-trio">
        <div>${Art.render(getProduct('silicone-case'), { hex: '#6f9a8d' })}</div>
        <div>${Art.render(getProduct('magring-charger'))}</div>
        <div>${Art.render(getProduct('powerpod'), { hex: '#d4a58b' })}</div></div>`;
    } else if (t.phone) {
      art = `<div class="tile-art reveal"><div class="single-phone">${Art.render(p, { hex: t.hex })}</div></div>`;
    } else {
      art = `<div class="tile-art reveal art-${p.art}">${Art.render(p, { hex: t.hex })}</div>`;
    }
    const buy = t.href || link(`product.html?id=${p.id}`);
    const second = t.add
      ? `<button class="pill-btn small ghost" data-add="${p.id}">Add to Bag</button>`
      : t.href ? `<a class="pill-btn small ghost" href="${link(`product.html?id=silicone-case`)}">See cases</a>`
      : `<a class="pill-btn small ghost" href="${link(`product.html?id=${p.id}#highlights`)}">Learn more</a>`;
    return `
      <section class="tile ${t.theme || ''}" aria-label="${esc(title)}">
        ${p && p.badge ? `<p class="eyebrow reveal">${esc(p.badge)}</p>` : ''}
        <h2 class="headline reveal">${esc(title)}</h2>
        <p class="subhead reveal${t.theme === 'dark' ? ' muted' : ''}">${esc(t.sub)}</p>
        <div class="ctas reveal">
          <a class="pill-btn small" href="${buy}">${t.cta || 'Buy'}</a>${second}
        </div>
        ${p && t.id !== 'magring' ? `<p class="tile-price muted reveal">From ${fmt(p.price)}</p>` : ''}
        ${art}
      </section>`;
  }).join('');

  $$('[data-duo]').forEach(el => {
    el.innerHTML = Art.duo(getProduct(el.dataset.duo), el.dataset.hex);
  });

  $$('[data-phone]').forEach(el => {
    el.innerHTML = Art.render(getProduct(el.dataset.phone), { hex: el.dataset.hex });
  });

  $$('[data-art-of]').forEach(el => {
    el.innerHTML = Art.render(getProduct(el.dataset.artOf), { hex: el.dataset.hex });
  });

  // A fan of finishes
  $$('[data-fan]').forEach(el => {
    const p = getProduct(el.dataset.fan);
    const colors = p.colors.slice(0, 5);
    el.innerHTML = `<div class="fan">${colors.map((c, i) => {
      const mid = (colors.length - 1) / 2;
      return `<div style="--i:${i - mid}">${Art.phoneBack(c.hex, p.variant)}</div>`;
    }).join('')}</div>`;
  });

  // Compare cards
  const phones = PRODUCTS.filter(p => p.category === 'phones');
  const key = (p, label) => (p.specs.find(s => s[0] === label) || [, '—'])[1];
  $('#compareTrack').innerHTML = phones.map(p => `
    <article class="compare-card">
      <a class="phone-mini" href="${link(`product.html?id=${p.id}`)}" aria-label="${esc(p.name)}">${Art.render(p)}</a>
      ${colorDots(p)}
      ${p.badge ? `<p class="eyebrow" style="margin-top:14px">${esc(p.badge)}</p>` : ''}
      <h3>${esc(p.name)}</h3>
      <p class="tag">${esc(p.tagline)}</p>
      <p class="price">From ${fmt(p.price)}</p>
      <a class="pill-btn small" href="${link(`product.html?id=${p.id}`)}">Buy</a>
      <ul>
        <li><strong>${esc(key(p, 'Display').split(',')[0])}</strong>Display</li>
        <li><strong>${esc(key(p, 'Chip').split(',')[0])}</strong>Chip</li>
        <li><strong>${esc(key(p, 'Camera'))}</strong>Camera</li>
        <li><strong>${esc(key(p, 'Battery').replace(' video playback', ''))}</strong>Video playback</li>
      </ul>
    </article>`).join('');

  // Hovering a colour dot previews that finish
  $$('#compareTrack .compare-card').forEach((card, i) => {
    card.addEventListener('pointerover', e => {
      const dot = e.target.closest('.dot');
      if (dot) $('.phone-mini', card).innerHTML = Art.render(phones[i], { hex: dot.dataset.hex });
    });
  });

  $('#accTrack').innerHTML = PRODUCTS.filter(p => ['accessories', 'audio'].includes(p.category)).map(cardHTML).join('');

  $('#whyTrack').innerHTML = whyCardsHTML();
  $('#main').insertAdjacentHTML('beforeend', footnotesHTML());

  initTV();
};

/* Halo TV+ carousel: auto-advances with a progress dot, pauses on hover, focus, off-screen and on request.
   Drag or flick to move — springs carry the gesture's velocity. */
function initTV() {
  const section = $('#tv'), vp = $('#tvViewport'), track = $('#tvTrack');
  const n = SHOWS.length, gap = 16;
  track.innerHTML = SHOWS.map((s, k) => `
    <article class="tv-slide f-${s.font}" style="--a:${s.a};--b:${s.b}" role="group" aria-roledescription="slide" aria-label="${k + 1} of ${n}: ${esc(s.title)}">
      <div class="tv-art" aria-hidden="true">${s.img ? `<img src="${asset(s.img)}" alt="" ${k ? 'loading="lazy" ' : ''}decoding="async">` : ''}<span class="orb"></span><span class="orb two"></span><span class="grain"></span></div>
      <div class="tv-copy">
        <p class="tv-title">${esc(s.title)}</p>
        <div class="tv-meta">
          <button class="pill-btn small light" data-stream="${esc(s.title)}">Stream now</button>
          <p><strong>${esc(s.genre)}</strong> · ${esc(s.line)}</p>
        </div>
      </div>
    </article>`).join('');
  $('#tvDots').innerHTML = SHOWS.map((s, k) => `<button class="tv-dot" data-k="${k}" aria-label="Show ${esc(s.title)}"><span class="fill"></span></button>`).join('');

  const slides = $$('.tv-slide', track), dots = $$('.tv-dot');
  let i = 0, x = 0, anim = null, start = 0, startI = 0;
  let playing = !Motion.reducedMotion(), hover = false, focus = false, onscreen = true, dragging = false;

  const step = () => slides[0].offsetWidth + gap;
  const target = k => (vp.clientWidth - slides[0].offsetWidth) / 2 - k * step();
  const setX = v => { x = v; track.style.transform = `translate3d(${v}px,0,0)`; };

  function syncState() {
    const running = playing && !hover && !focus && onscreen && !dragging;
    section.classList.toggle('is-paused', !running);
    const btn = $('#tvPlay');
    btn.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor"/><rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
    btn.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Play autoplay');
  }

  function goTo(k, velocity = 0, damping = 1) {
    i = (k + n) % n;
    slides.forEach((s, m) => { s.classList.toggle('active', m === i); s.setAttribute('aria-hidden', String(m !== i)); });
    // Restart the progress fill on the active dot
    dots.forEach((d, m) => { d.classList.remove('active'); d.setAttribute('aria-current', String(m === i)); });
    void dots[i].offsetWidth;
    dots[i].classList.add('active');
    anim && anim.stop();
    anim = Motion.spring({ from: x, to: target(i), velocity, damping, response: 0.45, onUpdate: setX });
  }

  dots.forEach(d => {
    $('.fill', d).addEventListener('animationend', () => { if (d.classList.contains('active')) goTo(i + 1); });
  });
  $('#tvDots').addEventListener('click', e => { const d = e.target.closest('.tv-dot'); if (d) goTo(Number(d.dataset.k)); });
  $('#tvPlay').addEventListener('click', () => { playing = !playing; syncState(); });
  track.addEventListener('click', e => {
    if (e.target.closest('[data-stream]')) { toast(`${e.target.closest('[data-stream]').dataset.stream} — streaming isn’t part of this demo.`); return; }
    const s = e.target.closest('.tv-slide');
    if (s && !s.classList.contains('active')) goTo(slides.indexOf(s));
  });

  vp.addEventListener('mouseenter', () => { hover = true; syncState(); });
  vp.addEventListener('mouseleave', () => { hover = false; syncState(); });
  section.addEventListener('focusin', () => { focus = true; syncState(); });
  section.addEventListener('focusout', () => { focus = section.contains(document.activeElement); syncState(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { onscreen = en.isIntersecting; syncState(); }, { threshold: 0.3 }).observe(vp);
  }
  document.addEventListener('visibilitychange', () => { onscreen = !document.hidden; syncState(); });

  Motion.hDrag(vp, {
    onStart() { dragging = true; syncState(); anim && anim.stop(); start = x; startI = i; },
    onMove(dx) {
      const min = target(n - 1), max = target(0);
      let nx = start + dx;
      if (nx > max) nx = max + Motion.rubberband(nx - max, vp.clientWidth);
      else if (nx < min) nx = min - Motion.rubberband(min - nx, vp.clientWidth);
      setX(nx);
    },
    onEnd(v) {
      dragging = false;
      const projected = x + Motion.project(v, 0.99);
      let k = Math.round((target(0) - projected) / step());
      k = Math.max(0, Math.min(n - 1, Math.max(startI - 1, Math.min(startI + 1, k))));
      goTo(k, v, Math.abs(v) > 300 ? 0.8 : 1);
      syncState();
    }
  });
  vp.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(i + 1);
    if (e.key === 'ArrowLeft') goTo(i - 1);
  });
  window.addEventListener('resize', () => { anim && anim.stop(); setX(target(i)); });

  setX(target(0));
  goTo(0);
  syncState();
}
