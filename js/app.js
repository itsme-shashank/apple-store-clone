/* Shared shell: navigation, bag storage, bag sheet, search, toasts, reveal-on-scroll. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const fmt = n => inr.format(n);
const emi = n => fmt(Math.ceil(n / 24));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const optionsOf = p => p.storage || p.options || null;

const Icons = {
  logo: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16M4 15h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  truck: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 9h15v12H3zM18 13h6l4 4v4h-10z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8" cy="23" r="2.5" fill="var(--bg)" stroke="currentColor" stroke-width="1.6"/><circle cx="23" cy="23" r="2.5" fill="var(--bg)" stroke="currentColor" stroke-width="1.6"/></svg>',
  store: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 12l2-6h18l2 6M5 12h22v14H5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 26v-7h6v7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  card: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="8" width="24" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 13h24" stroke="currentColor" stroke-width="1.6"/></svg>',
  swap: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 11h17l-4-4M24 21H7l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chat: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7h20v14H14l-6 5v-5H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v16l-5-3.6L7 20z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  bookmarkFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v16l-5-3.6L7 20z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  compare: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="6" width="9" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="18" y="6" width="9" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  pin: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28s-8-8.5-8-14a8 8 0 0 1 16 0c0 5.5-8 14-8 14z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="14" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  gift: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="12" width="22" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 12h24M16 12v14M16 12c-3-6-8-4-6-1 1 1 6 1 6 1zm0 0c3-6 8-4 6-1-1 1-6 1-6 1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'
};

/* ---------------- Bag storage ---------------- */
const Bag = (() => {
  const KEY = 'halo.bag.v1';
  let memory = [];
  const listeners = new Set();

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return memory; }
  }
  function write(items) {
    memory = items;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    listeners.forEach(fn => fn(items));
  }
  const keyOf = i => [i.id, i.color, i.option, i.care ? 'care' : '', i.engraving, i.tradeIn].map(v => v || '').join('|');

  function unitPrice(item) {
    const p = getProduct(item.id);
    if (!p) return 0;
    const opt = (optionsOf(p) || []).find(o => o.label === item.option);
    return p.price + (opt ? opt.add : 0) + (item.care ? CARE_PLANS[p.category] || 0 : 0);
  }
  // One trade-in per bag line, regardless of quantity
  const creditOf = item => (TRADE_IN.find(t => t.name === item.tradeIn) || { credit: 0 }).credit;

  return {
    items: () => read().filter(i => getProduct(i.id)),
    add(item) {
      const items = read();
      const existing = items.find(i => keyOf(i) === keyOf(item));
      if (existing) existing.qty = Math.min(existing.qty + 1, 10);
      else items.push({ ...item, qty: 1 });
      write(items);
      return keyOf(item);
    },
    setQty(key, qty) {
      write(read().map(i => (keyOf(i) === key ? { ...i, qty } : i)));
    },
    remove(key) {
      const items = read();
      const index = items.findIndex(i => keyOf(i) === key);
      const removed = items[index];
      write(items.filter((_, n) => n !== index));
      return { removed, index };
    },
    restore({ removed, index }) {
      const items = read();
      items.splice(index, 0, removed);
      write(items);
    },
    clear() { write([]); },
    count() { return this.items().reduce((n, i) => n + i.qty, 0); },
    subtotal() { return this.items().reduce((s, i) => s + unitPrice(i) * i.qty, 0); },
    credit() { return this.items().reduce((s, i) => s + creditOf(i), 0); },
    total() { return Math.max(0, this.subtotal() - this.credit()); },
    unitPrice, keyOf, creditOf,
    onChange(fn) { listeners.add(fn); }
  };
})();

/* ---------------- Saves (save for later) ---------------- */
const Saves = (() => {
  const KEY = 'halo.saves.v1';
  let memory = [];
  const listeners = new Set();
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return memory; } };
  const write = items => {
    memory = items;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    listeners.forEach(fn => fn(items));
  };
  const same = (a, b) => a.id === b.id && (a.color || '') === (b.color || '') && (a.option || '') === (b.option || '');
  return {
    items: () => read().filter(i => getProduct(i.id)),
    has: item => read().some(i => same(i, item)),
    toggle(item) {
      const items = read();
      const on = !items.some(i => same(i, item));
      write(on ? [{ id: item.id, color: item.color, option: item.option }, ...items] : items.filter(i => !same(i, item)));
      return on;
    },
    remove(item) { write(read().filter(i => !same(i, item))); },
    onChange(fn) { listeners.add(fn); }
  };
})();

/* ---------------- Modal: grows out of the element that opened it ---------------- */
const Modal = (() => {
  let opener = null;
  function open(html, from) {
    let el = $('#modal');
    if (!el) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="modal" id="modal" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="modal-card" tabindex="-1">
            <button class="icon-btn round modal-close" data-close-modal aria-label="Close">${Icons.close}</button>
            <div class="modal-body" id="modalBody"></div>
          </div>
        </div>`);
      el = $('#modal');
      el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close-modal]')) close(); });
    }
    opener = from || document.activeElement;
    $('#modalBody').innerHTML = html;
    const card = $('.modal-card', el);
    // Anchor the scale-in to the trigger so it reads as coming from there
    if (from) {
      const r = from.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      card.style.transformOrigin = `${r.left + r.width / 2 - c.left}px ${r.top + r.height / 2 - c.top}px`;
    }
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    $('#main') && ($('#main').inert = true);
    requestAnimationFrame(() => card.focus({ preventScroll: true }));
  }
  function close() {
    const el = $('#modal');
    if (!el || !el.classList.contains('show')) return;
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    $('#main') && ($('#main').inert = false);
    opener && opener.focus && opener.focus({ preventScroll: true });
  }
  return { open, close };
})();

/* A specialist-chat stand-in shared by several "need help?" links */
function helpModalHTML() {
  return `<p class="eyebrow">Shopping help</p><h2 class="title">Chat with a Specialist.</h2>
    <p class="muted" style="margin:12px 0 20px">Get personalised recommendations, compare models and find the right accessories — online or in store.</p>
    <ul class="modal-list">
      <li>${Icons.chat}<span><strong>Chat online</strong>Usually replies in under 2 minutes.</span></li>
      <li>${Icons.store}<span><strong>Visit a Halo Store</strong>Get hands‑on with every product.</span></li>
      <li>${Icons.card}<span><strong>Call 1800‑000‑0000</strong>Mon–Sun, 9 am – 9 pm.</span></li>
    </ul>
    <p class="fine" style="margin-top:20px">Demo store — chat and calls aren’t connected.</p>`;
}

/* ---------------- The Halo Store difference ---------------- */
const WHY = [
  { icon: 'truck', title: 'Free, fast delivery.', text: 'Free delivery on every order, with two‑hour delivery in select cities.',
    more: 'Order by 2 pm for same‑day dispatch. In Bengaluru, Delhi NCR and Mumbai, choose two‑hour delivery at checkout. Or pick up at a Halo Store — usually ready in about an hour.' },
  { icon: 'card', title: 'No‑cost EMI.', text: 'Pay in easy monthly instalments for up to 24 months on eligible cards.',
    more: 'Choose EMI at checkout. The interest is offered as an upfront discount, so you pay only the price of the product, split across 3 to 24 months.' },
  { icon: 'swap', title: 'Trade in and save.', text: 'Get credit toward a new Halo when you trade in an eligible device.',
    more: 'Tell us about your device while you buy and we’ll apply an estimated credit instantly. We check the device at delivery; if it’s in good shape, the credit is yours.' },
  { icon: 'chat', title: 'Personal setup.', text: 'A one‑on‑one online session to get your new Halo set up just the way you like.',
    more: 'A Specialist will help you move your data, set up Face Unlock, and learn the new features — at a time that suits you.' },
  { icon: 'gift', title: 'Free engraving.', text: 'Add a mix of emoji, names and numbers to Halo Buds, Halo Tag and Halo Pencil.',
    more: 'Make it unmistakably yours. Engraving is free, and you can preview it as you type.' },
  { icon: 'store', title: 'Easy returns.', text: 'Changed your mind? Return within 14 days, no questions asked.',
    more: 'Start a return from your orders page, or bring it to any Halo Store. Refunds go back to your original payment method in 5–7 business days.' }
];
function whyCardsHTML() {
  return WHY.map((w, i) => `
    <article class="why-card">${Icons[w.icon]}<h3>${w.title}</h3><p>${w.text}</p>
      <button class="why-more" data-why="${i}" aria-label="More about ${esc(w.title)}">${Icons.plus}</button>
    </article>`).join('');
}

/* ---------------- Footnotes, Apple-style ---------------- */
const FOOTNOTES = [
  'No‑cost EMI is available on eligible credit cards for 3 to 24 months. Monthly prices are rounded up and shown for 24 months. The interest is passed on as an upfront discount.',
  'Trade‑in values are estimates and vary with the condition, year and configuration of your device. Credit is applied to your order and confirmed when we inspect the device on delivery.',
  'Halo Care+ includes unlimited repairs for accidental damage, each subject to a service fee, plus priority support. Coverage begins on the date of purchase.',
  'Battery life varies by use and configuration. Delivery dates are estimates. Halo is a fictional brand; this demo store doesn’t place orders or take payment.'
];
function footnotesHTML() {
  return `<section class="footnotes" aria-label="Footnotes"><div class="wrap"><ol>${FOOTNOTES.map((f, i) => `<li id="fn-${i + 1}">${f}</li>`).join('')}</ol></div></section>`;
}
const fn = n => `<sup><a class="fn" href="#fn-${n}" aria-label="Footnote ${n}">${n}</a></sup>`;

/* ---------------- Shared markup ---------------- */
function colorDots(p, max = 6) {
  if (!p.colors || p.colors.length < 2) return '';
  const dots = p.colors.slice(0, max).map(c =>
    `<span class="dot" style="--c:${c.hex}" data-hex="${c.hex}" title="${esc(c.name)}"></span>`).join('');
  return `<div class="dots" aria-label="${p.colors.length} colours">${dots}</div>`;
}

function fromPrice(p) {
  return optionsOf(p) && optionsOf(p).length > 1 ? `From ${fmt(p.price)}` : fmt(p.price);
}

function cardHTML(p) {
  const isPhone = ['phones', 'book', 'pad', 'watch', 'vision'].includes(p.category); // configure before buying
  return `
  <article class="card" data-id="${p.id}">
    <a class="card-link" href="product.html?id=${p.id}">
      <div class="card-art" data-art>${Art.render(p)}</div>
      <div class="card-body">
        ${p.badge ? `<p class="eyebrow">${esc(p.badge)}</p>` : ''}
        <h3 class="card-title">${esc(p.name)}</h3>
        ${colorDots(p)}
        <p class="card-price">${fromPrice(p)}</p>
      </div>
    </a>
    ${isPhone
      ? `<a class="pill-btn small card-cta" href="product.html?id=${p.id}">Buy</a>`
      : `<button class="add-btn card-cta" data-add="${p.id}" aria-label="Add ${esc(p.name)} to bag">${Icons.plus}</button>`}
  </article>`;
}

/* ---------------- Header & footer ---------------- */
const NAV = [
  { key: 'store', label: 'Store', href: 'store.html' },
  ...CATEGORIES.filter(c => c.id !== 'all').map(c => ({ key: c.id, label: c.label, href: `store.html?c=${c.id}` })),
  { key: 'support', label: 'Support', href: 'support.html' }
];
const COMPARABLE = ['phones', 'book', 'pad', 'watch'];

// The three columns of a flyout: a big "explore" list, then "shop" and "more" lists
function flyoutCols(key) {
  if (key === 'store') {
    return [
      { label: 'Shop', big: true, links: [['store.html', 'Shop the Latest'], ...CATEGORIES.filter(c => c.id !== 'all').map(c => [`store.html?c=${c.id}`, c.label])] },
      { label: 'Quick Links', links: [['support.html#orders', 'Order Status'], ['support.html', 'Shopping Help'], ['support.html#returns', 'Returns'], ['saves.html', 'Your Saves']] },
      { label: 'Shop Special Stores', links: [['compare.html', 'Compare Models'], ['index.html#why', 'Why Buy from Halo'], ['store.html?c=accessories', 'Accessories']] }
    ];
  }
  if (key === 'support') {
    return [
      { label: 'Explore Support', big: true, links: [['support.html#phones', 'Phone'], ['support.html#book', 'Book'], ['support.html#pad', 'Pad'], ['support.html#watch', 'Watch'], ['support.html#vision', 'Vision'], ['support.html#audio', 'Audio & Home']] },
      { label: 'Get Help', links: [['support.html#orders', 'Orders & Delivery'], ['support.html#returns', 'Returns & Refunds'], ['support.html#payments', 'Payments & EMI'], ['support.html#contact', 'Contact Us']] },
      { label: 'Helpful Topics', links: [['support.html', 'Transfer your data'], ['support.html', 'Battery health'], ['support.html', 'Repairs']] }
    ];
  }
  const cat = CATEGORIES.find(c => c.id === key);
  const items = PRODUCTS.filter(p => p.category === key);
  return [
    { label: `Explore ${cat.label}`, big: true, links: [[`store.html?c=${key}`, `Explore All ${cat.label}`], ...items.slice(0, 7).map(p => [`product.html?id=${p.id}`, p.name])] },
    { label: `Shop ${cat.label}`, links: [[`store.html?c=${key}`, `Shop ${cat.label}`], ...(key !== 'accessories' ? [['store.html?c=accessories', `${cat.label} Accessories`]] : []),
      ...(COMPARABLE.includes(key) ? [[`compare.html?c=${key}`, `Compare ${cat.label} Models`]] : []), ['saves.html', 'Your Saves']] },
    { label: `More from ${cat.label}`, links: NAV_MORE[key] || [] }
  ];
}
function flyoutHTML(key) {
  return `<div class="flyout">${flyoutCols(key).map(col => `
    <div class="fly-col"><p class="panel-label">${esc(col.label)}</p>
      <ul class="${col.big ? 'fly-big' : 'fly-small'}">${col.links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul>
    </div>`).join('')}</div>`;
}

function breadcrumb() {
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const crumbs = [];
  if (page === 'store') {
    crumbs.push(['store.html', 'Store']);
    const c = CATEGORIES.find(x => x.id === params.get('c') && x.id !== 'all');
    if (c) crumbs.push([null, c.label]);
  } else if (page === 'product') {
    const p = getProduct(params.get('id'));
    crumbs.push(['store.html', 'Store']);
    if (p) {
      const c = CATEGORIES.find(x => x.id === p.category);
      crumbs.push([`store.html?c=${c.id}`, c.label], [null, p.name]);
    }
  } else if (page === 'compare') crumbs.push(['store.html', 'Store'], [null, 'Compare']);
  else if (page === 'bag') crumbs.push([null, 'Bag']);
  else if (page === 'saves') crumbs.push([null, 'Your Saves']);
  else if (page === 'support') crumbs.push([null, 'Support']);
  else if (page === 'entertainment') crumbs.push(['store.html?c=entertainment', 'Entertainment'], [null, 'Services']);
  if (!crumbs.length) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>
    <li><a href="index.html" aria-label="Halo home">${Icons.logo}</a></li>
    ${crumbs.map(([h, t], i) => `<li>${h && i < crumbs.length - 1 ? `<a href="${h}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}</li>`).join('')}
  </ol></nav>`;
}

function renderShell() {
  const header = $('#site-header');
  if (header) header.outerHTML = `
  <a class="skip" href="#main">Skip to content</a>
  <nav class="gnav" id="gnav" aria-label="Global">
    <div class="gnav-inner">
      <a class="gnav-logo" href="index.html" aria-label="Halo home">${Icons.logo}<span>Halo</span></a>
      <ul class="gnav-links">${NAV.map(n => `
        <li data-fly="${n.key}"><a href="${n.href}">${n.label}</a><button class="gnav-chev" data-fly-toggle="${n.key}" aria-expanded="false" aria-label="${n.label} menu">${Icons.chevron}</button></li>`).join('')}
      </ul>
      <div class="gnav-actions">
        <button class="icon-btn" data-panel="search" aria-label="Search" aria-expanded="false">${Icons.search}</button>
        <button class="icon-btn bag-btn" data-open-bag aria-label="Bag">${Icons.bag}<span class="bag-count" aria-hidden="true"></span></button>
        <button class="icon-btn menu-btn" data-panel="menu" aria-label="Menu" aria-expanded="false">${Icons.menu}</button>
      </div>
    </div>
    <div class="gnav-panel" id="navPanel" aria-hidden="true"><div class="gnav-panel-inner" id="navPanelInner"></div></div>
  </nav>
  <div class="scrim" id="navScrim"></div>
  <div class="sheet-scrim" id="bagScrim"></div>
  <aside class="sheet" id="bagSheet" role="dialog" aria-modal="true" aria-labelledby="bagTitle" aria-hidden="true">
    <div class="sheet-grabber" aria-hidden="true"></div>
    <header class="sheet-head">
      <h2 id="bagTitle">Bag</h2>
      <button class="icon-btn round" data-close-bag aria-label="Close bag">${Icons.close}</button>
    </header>
    <div class="sheet-body" id="bagSheetBody"></div>
    <footer class="sheet-foot" id="bagSheetFoot"></footer>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  const footer = $('#site-footer');
  const col = (title, links) => `
    <details class="fcol" open><summary><h4>${title}</h4>${Icons.plus}</summary>
      <div class="fcol-links">${links.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}</div></details>`;
  if (footer) footer.outerHTML = `
  <footer class="gfooter">
    <div class="wrap">
      <p class="fine">Halo is a fictional brand. This is a static demo storefront — no orders are placed and no payment is taken. Prices include GST.</p>
      ${breadcrumb()}
      <div class="footer-cols">
        ${col('Shop and Learn', CATEGORIES.filter(c => c.id !== 'all').map(c => [`store.html?c=${c.id}`, c.label]))}
        ${col('Popular', ['halo-16-pro', 'halo-book-air', 'halo-pad-pro', 'halo-watch-s2', 'halo-buds-pro', 'halo-vision-pro'].map(id => [`product.html?id=${id}`, getProduct(id).name]))}
        ${col('Halo Store', [['store.html', 'Shop all products'], ['compare.html', 'Compare models'], ['saves.html', 'Your Saves'], ['bag.html', 'Review Bag'], ['support.html#orders', 'Order Status']])}
        ${col('Support', [['support.html', 'Support home'], ['support.html#orders', 'Orders & delivery'], ['support.html#returns', 'Returns & refunds'], ['support.html#payments', 'Payments & EMI'], ['support.html#contact', 'Contact us']])}
      </div>
      <p class="more-ways">More ways to shop: <a href="support.html#contact">Find a Halo Store</a> or <a href="support.html#contact">other retailer</a> near you. Or call 1800‑000‑0000.</p>
      <div class="footer-legal">
        <span>Copyright © ${new Date().getFullYear()} Halo Inc. All rights reserved.</span>
        <span class="legal-links"><a href="support.html">Privacy Policy</a><a href="support.html">Terms of Use</a><a href="support.html#returns">Sales Policy</a><a href="support.html">Legal</a><a href="store.html">Site Map</a></span>
        <span class="region">India</span>
      </div>
    </div>
  </footer>`;

  // Footer groups collapse into accordions on small screens
  const small = matchMedia('(max-width: 733px)');
  const syncFooter = () => $$('.fcol').forEach(d => { d.open = !small.matches; });
  syncFooter();
  small.addEventListener ? small.addEventListener('change', syncFooter) : small.addListener(syncFooter);
  $$('.fcol summary').forEach(s => s.addEventListener('click', e => { if (!small.matches) e.preventDefault(); }));

  // Highlight the current section in the nav
  const page = document.body.dataset.page;
  const c = new URLSearchParams(location.search).get('c');
  const pid = new URLSearchParams(location.search).get('id');
  const current = page === 'support' ? 'support'
    : page === 'entertainment' ? 'entertainment'
    : page === 'product' && getProduct(pid) ? getProduct(pid).category
    : page === 'store' ? (c && c !== 'all' ? c : 'store') : null;
  $$('.gnav-links li').forEach(li => { if (li.dataset.fly === current) $('a', li).setAttribute('aria-current', 'page'); });
}

/* ---------------- Nav panel: flyouts, search, and the mobile menu ---------------- */
const NavPanel = (() => {
  let mode = null;

  function searchResults(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      return `<p class="panel-label">Quick links</p>
        <ul class="panel-links quick">
          <li><a href="store.html">${Icons.chevron}Shop all products</a></li>
          <li><a href="product.html?id=halo-16-pro">${Icons.chevron}Halo 16 Pro</a></li>
          <li><a href="product.html?id=halo-book-air">${Icons.chevron}Halo Book Air</a></li>
          <li><a href="compare.html">${Icons.chevron}Compare models</a></li>
          <li><a href="saves.html">${Icons.chevron}Your Saves</a></li>
          <li><a href="support.html">${Icons.chevron}Get support</a></li>
        </ul>`;
    }
    const hits = PRODUCTS.filter(p => [p.name, p.category, p.tagline].join(' ').toLowerCase().includes(q)).slice(0, 6);
    if (!hits.length) return `<p class="panel-label">No results for “${esc(q)}”. Try “case”, “watch” or “pro”.</p>`;
    return `<p class="panel-label">Products</p><ul class="panel-results">${hits.map(p => `
      <li><a href="product.html?id=${p.id}"><span class="thumb">${Art.render(p)}</span><span><strong>${esc(p.name)}</strong><small>${fromPrice(p)}</small></span></a></li>`).join('')}</ul>`;
  }

  function content(m) {
    if (m === 'search') {
      return `<form class="panel-search" action="store.html" role="search">
          ${Icons.search}<input type="search" name="q" id="navSearch" placeholder="Search Halo" autocomplete="off" aria-label="Search Halo">
        </form><div id="navResults">${searchResults('')}</div>`;
    }
    if (m.startsWith('fly:')) return flyoutHTML(m.slice(4));
    // Mobile menu: a root list that drills into each section's flyout
    return `<div class="mmenu" id="mmenu">
      <ul class="mm-root panel-links big">${NAV.map(n => `<li><button class="mm-item" data-drill="${n.key}">${n.label}${Icons.chevron}</button></li>`).join('')}
        <li><a class="mm-item" href="bag.html">Bag</a></li><li><a class="mm-item" href="saves.html">Your Saves</a></li></ul>
      <div class="mm-sub" id="mmSub" aria-hidden="true"></div>
    </div>`;
  }

  // Resize the open panel smoothly when its content changes
  function swap(html) {
    const panel = $('#navPanel'), inner = $('#navPanelInner');
    const from = panel.getBoundingClientRect().height;
    inner.classList.add('swap');
    inner.innerHTML = html;
    const to = panel.getBoundingClientRect().height;
    if (!Motion.reducedMotion() && from && Math.abs(to - from) > 1) {
      panel.animate({ height: [`${from}px`, `${to}px`] }, { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }
    requestAnimationFrame(() => requestAnimationFrame(() => inner.classList.remove('swap')));
  }

  function show(m) {
    if (mode === m) return;
    closeBag();
    const wasOpen = !!mode;
    mode = m;
    const panel = $('#navPanel');
    panel.classList.toggle('is-flyout', m.startsWith('fly:'));
    if (wasOpen) swap(content(m));
    else $('#navPanelInner').innerHTML = content(m);
    panel.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('panel-open');
    document.documentElement.classList.toggle('flyout-open', m.startsWith('fly:'));
    $$('[data-panel]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.panel === m)));
    $$('[data-fly-toggle]').forEach(b => b.setAttribute('aria-expanded', String(`fly:${b.dataset.flyToggle}` === m)));
    $$('.gnav-links li').forEach(li => li.classList.toggle('is-active', `fly:${li.dataset.fly}` === m));
    if (m === 'search') {
      const input = $('#navSearch');
      input.addEventListener('input', () => { $('#navResults').innerHTML = searchResults(input.value); });
      requestAnimationFrame(() => input.focus());
    }
  }
  function open(m) { mode === m ? close() : show(m); }
  function close() {
    if (!mode) return;
    mode = null;
    $('#navPanel').setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('panel-open', 'flyout-open');
    $$('[data-panel], [data-fly-toggle]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    $$('.gnav-links li').forEach(li => li.classList.remove('is-active'));
  }

  // Mobile drill-down: in from the right, back out to the right
  function drill(key) {
    const sub = $('#mmSub');
    const item = NAV.find(n => n.key === key);
    sub.innerHTML = `<button class="mm-back" data-drill-back>${Icons.chevronLeft}Back</button>
      <p class="mm-title">${esc(item.label)}</p>${flyoutHTML(key)}`;
    sub.setAttribute('aria-hidden', 'false');
    $('#mmenu').classList.add('drilled');
    requestAnimationFrame(() => $('.mm-back', sub).focus({ preventScroll: true }));
  }
  function back() {
    $('#mmenu').classList.remove('drilled');
    $('#mmSub').setAttribute('aria-hidden', 'true');
  }

  // Desktop hover: a short intent delay to open, instant switching once open
  function initHover() {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)');
    let timer;
    $$('.gnav-links li').forEach(li => {
      li.addEventListener('mouseenter', () => {
        if (!canHover.matches) return;
        clearTimeout(timer);
        const isFly = mode && mode.startsWith('fly:');
        timer = setTimeout(() => show(`fly:${li.dataset.fly}`), isFly ? 60 : 180);
      });
      li.addEventListener('mouseleave', () => clearTimeout(timer));
    });
    const nav = $('#gnav');
    nav.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      if (mode && mode.startsWith('fly:')) timer = setTimeout(close, 220);
    });
    nav.addEventListener('mouseenter', () => { if (mode && mode.startsWith('fly:')) clearTimeout(timer); });
    $('.gnav-logo').addEventListener('mouseenter', () => { clearTimeout(timer); if (mode && mode.startsWith('fly:')) timer = setTimeout(close, 220); });
    $('.gnav-actions').addEventListener('mouseenter', () => { clearTimeout(timer); if (mode && mode.startsWith('fly:')) timer = setTimeout(close, 220); });
  }

  return { open, show, close, drill, back, initHover, get mode() { return mode; } };
})();

/* ---------------- Bag sheet: a draggable, spring-driven side sheet ---------------- */
let sheetOpen = false;
const sheet = { x: 0, width: 0, anim: null };

function setSheetX(x) {
  sheet.x = x;
  const el = $('#bagSheet');
  el.style.transform = `translate3d(${x}px,0,0)`;
  $('#bagScrim').style.opacity = Math.max(0, Math.min(1, 1 - x / sheet.width));
}

function animateSheet(target, velocity = 0, damping = 1) {
  sheet.anim && sheet.anim.stop();
  sheet.anim = Motion.spring({
    from: sheet.x, to: target, velocity, damping, response: 0.42,
    onUpdate: setSheetX,
    onComplete: () => {
      sheet.anim = null;
      if (target >= sheet.width) document.documentElement.classList.remove('sheet-visible');
    }
  });
}

function openBag() {
  NavPanel.close();
  renderBagSheet();
  const el = $('#bagSheet');
  const root = document.documentElement;
  if (!root.classList.contains('sheet-visible')) {
    root.classList.add('sheet-visible');
    sheet.width = el.offsetWidth;
    setSheetX(sheet.width);
  }
  sheetOpen = true;
  root.classList.add('sheet-open');
  el.setAttribute('aria-hidden', 'false');
  $('#main') && ($('#main').inert = true);
  animateSheet(0);
  requestAnimationFrame(() => $('[data-close-bag]').focus({ preventScroll: true }));
}

function closeBag(velocity = 0, damping = 1) {
  if (!sheetOpen) return;
  sheetOpen = false;
  document.documentElement.classList.remove('sheet-open');
  $('#bagSheet').setAttribute('aria-hidden', 'true');
  $('#main') && ($('#main').inert = false);
  animateSheet(sheet.width, velocity, damping);
  $('.bag-btn') && $('.bag-btn').focus({ preventScroll: true });
}

function initSheetGestures() {
  const el = $('#bagSheet');
  let start = 0;
  Motion.hDrag(el, {
    onStart() {
      sheet.anim && sheet.anim.stop(); // grab it mid-flight: continue from the on-screen value
      sheet.width = el.offsetWidth;
      start = sheet.x;
    },
    onMove(dx) {
      let x = start + dx;
      if (x < 0) x = -Motion.rubberband(-x, sheet.width);
      setSheetX(x);
    },
    onEnd(v) {
      const projected = sheet.x + Motion.project(v);
      const flick = Math.abs(v) > 400;
      if (projected > sheet.width / 2) closeBag(v, flick ? 0.85 : 1);
      else { sheetOpen = true; animateSheet(0, v, flick ? 0.8 : 1); }
    }
  });
}

function bagLineHTML(item, compact) {
  const p = getProduct(item.id);
  const color = p.colors && p.colors.find(c => c.name === item.color);
  const key = Bag.keyOf(item);
  const meta = [p.colors && p.colors.length > 1 ? item.color : null, item.option].filter(Boolean).join(' · ');
  const extras = [
    item.care ? `Halo Care+ · ${fmt(CARE_PLANS[p.category])}` : null,
    item.engraving ? `Engraved: “${item.engraving}”` : null,
    item.tradeIn ? `Trade‑in: ${item.tradeIn} (−${fmt(Bag.creditOf(item))})` : null
  ].filter(Boolean);
  return `
  <li class="line ${compact ? 'compact' : ''}" data-key="${esc(key)}">
    <a class="line-art" href="product.html?id=${p.id}">${Art.render(p, { hex: color && color.hex })}</a>
    <div class="line-info">
      <a class="line-name" href="product.html?id=${p.id}">${esc(p.name)}</a>
      ${meta ? `<p class="line-meta">${esc(meta)}</p>` : ''}
      ${extras.map(x => `<p class="line-extra">${esc(x)}</p>`).join('')}
      <div class="line-controls">
        <div class="stepper" role="group" aria-label="Quantity">
          <button data-qty="-1" aria-label="Decrease quantity">${Icons.minus}</button>
          <output>${item.qty}</output>
          <button data-qty="1" aria-label="Increase quantity" ${item.qty >= 10 ? 'disabled' : ''}>${Icons.plus}</button>
        </div>
        <button class="link-btn" data-remove>Remove</button>
        ${compact ? '' : '<button class="link-btn" data-save-later>Save for later</button>'}
      </div>
    </div>
    <p class="line-price">${fmt(Bag.unitPrice(item) * item.qty)}</p>
  </li>`;
}

function renderBagSheet() {
  const body = $('#bagSheetBody'), foot = $('#bagSheetFoot');
  if (!body) return;
  const items = Bag.items();
  if (!items.length) {
    body.innerHTML = `<div class="empty"><div class="empty-ring">${Icons.bag}</div><h3>Your bag is empty.</h3><p>Find something you’ll love.</p></div>`;
    foot.innerHTML = `<a class="pill-btn block" href="store.html">Shop all products</a>`;
    return;
  }
  body.innerHTML = `<ul class="lines">${items.map(i => bagLineHTML(i, true)).join('')}</ul>`;
  const credit = Bag.credit(), total = Bag.total();
  foot.innerHTML = `
    ${credit ? `<div class="sum-row small"><span>Trade‑in credit</span><span>−${fmt(credit)}</span></div>` : ''}
    <div class="sum-row"><span>Total</span><strong>${fmt(total)}</strong></div>
    <p class="fine">Free delivery. Or ${emi(total)}/mo. for 24 mo. with no‑cost EMI.</p>
    <a class="pill-btn block" href="bag.html#checkout">Check Out</a>
    <a class="pill-btn block ghost" href="bag.html">Review Bag</a>
    <p class="sheet-links"><a href="saves.html">Your Saves</a><a href="support.html#orders">Orders</a><a href="support.html">Help</a></p>`;
}

/* Quantity & remove controls work the same in the sheet and on the bag page */
function handleLineControls(e) {
  const line = e.target.closest('.line');
  if (!line) return;
  const key = line.dataset.key;
  const item = Bag.items().find(i => Bag.keyOf(i) === key);
  if (!item) return;
  const step = e.target.closest('[data-qty]');
  if (step) {
    const next = item.qty + Number(step.dataset.qty);
    if (next < 1) removeLine(key);
    else Bag.setQty(key, Math.min(next, 10));
  }
  if (e.target.closest('[data-remove]')) removeLine(key);
  if (e.target.closest('[data-save-later]')) {
    const added = !Saves.has(item) && Saves.toggle(item);
    const snapshot = Bag.remove(key);
    toast(`${getProduct(item.id).name} saved for later.`, 'Undo', () => { Bag.restore(snapshot); if (added) Saves.remove(item); });
  }
}

function removeLine(key) {
  const p = getProduct(key.split('|')[0]);
  const snapshot = Bag.remove(key);
  toast(`${p.name} removed.`, 'Undo', () => Bag.restore(snapshot));
}

/* ---------------- Toast with an optional action (forgiveness: undo) ---------------- */
let toastTimer;
function toast(message, actionLabel, action) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(message)}</span>${actionLabel ? `<button class="toast-action">${esc(actionLabel)}</button>` : ''}`;
  if (actionLabel) $('.toast-action', el).onclick = () => { action(); hide(); };
  el.classList.add('show');
  clearTimeout(toastTimer);
  const hide = () => el.classList.remove('show');
  toastTimer = setTimeout(hide, 5000);
}

/* ---------------- Reveal on scroll ---------------- */
function initReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(e => io.observe(e));
}

/* Horizontal shelves: native scroll-snap (free momentum) plus paddle buttons */
function initShelves(root = document) {
  $$('.shelf', root).forEach(shelf => {
    const track = $('.shelf-track', shelf);
    const head = $('.section-head', shelf);
    if (!track || !head) return;
    if (!$('.shelf-paddles', head)) {
      head.insertAdjacentHTML('beforeend', `<div class="shelf-paddles">
        <button class="paddle" data-shelf="prev" aria-label="Previous">${Icons.chevronLeft}</button>
        <button class="paddle" data-shelf="next" aria-label="Next">${Icons.chevron}</button></div>`);
    }
    const prev = $('[data-shelf="prev"]', shelf), next = $('[data-shelf="next"]', shelf);
    const page = () => track.clientWidth * 0.8;
    prev.onclick = () => track.scrollBy({ left: -page(), behavior: Motion.reducedMotion() ? 'auto' : 'smooth' });
    next.onclick = () => track.scrollBy({ left: page(), behavior: Motion.reducedMotion() ? 'auto' : 'smooth' });
    const sync = () => {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
    };
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
}

function updateBagCount() {
  const n = Bag.count();
  $$('.bag-count').forEach(el => { el.textContent = n > 9 ? '9+' : n || ''; });
  const btn = $('.bag-btn');
  if (btn) btn.setAttribute('aria-label', n ? `Bag, ${n} item${n > 1 ? 's' : ''}` : 'Bag');
}

function addToBag(item) {
  Bag.add(item);
  const btn = $('.bag-btn');
  if (btn) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); }
  openBag();
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderShell();
  $$('[data-icon]').forEach(el => { el.outerHTML = Icons[el.dataset.icon] || ''; });
  initSheetGestures();
  updateBagCount();

  Bag.onChange(() => {
    updateBagCount();
    if (sheetOpen) renderBagSheet();
  });
  // Keep tabs in sync
  window.addEventListener('storage', e => { if (e.key === 'halo.bag.v1') { updateBagCount(); if (sheetOpen) renderBagSheet(); } });

  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-open-bag]')) { e.preventDefault(); sheetOpen ? closeBag() : openBag(); return; }
    if (t.closest('[data-close-bag]') || t.closest('#bagScrim')) { closeBag(); return; }
    const panelBtn = t.closest('[data-panel]');
    if (panelBtn) { NavPanel.open(panelBtn.dataset.panel); return; }
    if (t.closest('#navScrim')) { NavPanel.close(); return; }
    const add = t.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const p = getProduct(add.dataset.add);
      const opts = optionsOf(p);
      addToBag({ id: p.id, color: p.colors[0].name, option: opts ? opts[0].label : null });
      return;
    }
    if (t.closest('#bagSheet .line, .bag-page .line')) handleLineControls(e);
    const flyBtn = t.closest('[data-fly-toggle]');
    if (flyBtn) { NavPanel.open(`fly:${flyBtn.dataset.flyToggle}`); return; }
    const drill = t.closest('[data-drill]');
    if (drill) { NavPanel.drill(drill.dataset.drill); return; }
    if (t.closest('[data-drill-back]')) { NavPanel.back(); return; }
    const why = t.closest('[data-why]');
    if (why) {
      const w = WHY[why.dataset.why];
      Modal.open(`<div class="modal-icon">${Icons[w.icon]}</div><h2 class="title">${w.title}</h2><p class="muted" style="margin-top:12px">${w.more}</p>`, why);
      return;
    }
    const help = t.closest('[data-help]');
    if (help) { e.preventDefault(); Modal.open(helpModalHTML(), help); }
  });

  // Hovering a colour dot previews that finish on the card
  document.addEventListener('pointerover', e => {
    const dot = e.target.closest('.card .dot');
    if (!dot) return;
    const card = dot.closest('.card');
    const p = getProduct(card.dataset.id);
    $('[data-art]', card).innerHTML = Art.render(p, { hex: dot.dataset.hex });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { Modal.close(); closeBag(); NavPanel.close(); }
  });

  // Elevate the nav's scroll-edge effect only once content is underneath it
  const onScroll = () => document.documentElement.classList.toggle('scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // iOS only fires :active on touch if a touch listener exists — feedback must be on press
  document.addEventListener('touchstart', () => {}, { passive: true });

  window.addEventListener('resize', () => {
    const el = $('#bagSheet');
    sheet.width = el.offsetWidth;
    if (!sheetOpen && document.documentElement.classList.contains('sheet-visible')) setSheetX(sheet.width);
  });

  NavPanel.initHover();

  const page = document.body.dataset.page;
  if (window.Pages && Pages[page]) Pages[page]();

  initShelves();
  initReveal();
});

window.Pages = {};
