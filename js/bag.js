/* Bag page: line items, summary and a client-side checkout with inline validation */
Pages.bag = () => {
  function render() {
    const items = Bag.items();
    $('#bagEmpty').hidden = items.length > 0;
    $('#bagFilled').hidden = items.length === 0;
    if (!items.length) {
      $('#bagHeadline').textContent = 'Your bag is empty.';
      $('#bagSub').textContent = 'Free delivery and free returns on everything.';
      return;
    }
    const sub = Bag.subtotal(), credit = Bag.credit(), total = Bag.total();
    $('#bagHeadline').textContent = `Your bag total is ${fmt(total)}.`;
    $('#bagSub').textContent = 'Free delivery and free returns.';
    $('#lines').innerHTML = items.map(i => bagLineHTML(i, false)).join('');
    $('#summary').innerHTML = `
      <h2>Summary</h2>
      <div class="sum-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
      ${credit ? `<div class="sum-row"><span>Trade‑in credit${fn(2)}</span><span>−${fmt(credit)}</span></div>` : ''}
      <div class="sum-row"><span>Delivery</span><span>FREE</span></div>
      <div class="sum-row total"><span>Total</span><strong>${fmt(total)}</strong></div>
      <p class="fine">Includes GST. Or ${emi(total)}/mo. for 24 mo. with no‑cost EMI${fn(1)}.</p>
      <a class="pill-btn block" href="#checkout">Check Out</a>
      <p class="fine summary-help">Need help? <button class="link-btn" data-help>Chat now</button> or call 1800‑000‑0000.</p>`;
  }

  /* ---------- Validation: inline, as people go — not only on submit ---------- */
  const rules = {
    name: v => v.trim().length >= 2,
    phone: v => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, '')),
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    address: v => v.trim().length >= 6,
    city: v => v.trim().length >= 2,
    pin: v => /^\d{6}$/.test(v.trim())
  };
  const form = $('#checkoutForm');

  function check(input) {
    const ok = rules[input.name](input.value);
    input.closest('.field').classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    input.addEventListener('blur', () => { if (input.value) check(input); });
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) check(input); });
  });
  form.elements.pin.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = Object.keys(rules).map(n => form.elements[n]).filter(i => !check(i));
    if (bad.length) {
      bad[0].focus();
      toast(`Please check ${bad.length} field${bad.length > 1 ? 's' : ''}.`);
      return;
    }
    const orderNo = 'HL' + String(Math.floor(1e7 + Math.random() * 9e7));
    const first = form.elements.name.value.trim().split(/\s+/)[0];
    const pickup = form.elements.pay.value === 'pickup';
    $('#confirmText').textContent = pickup
      ? `${first}, order ${orderNo} will be ready for pickup in about two hours.`
      : `${first}, order ${orderNo} is on its way. We’ll send updates to ${form.elements.email.value.trim()}.`;
    const dialog = $('#confirm');
    dialog.classList.add('show');
    dialog.setAttribute('aria-hidden', 'false');
    $('#main').inert = true;
    $('a', dialog).focus();
    Bag.clear();
    form.reset();
  });

  Bag.onChange(render);
  render();
  $('#main').insertAdjacentHTML('beforeend', footnotesHTML());

  if (location.hash === '#checkout' && Bag.items().length) {
    requestAnimationFrame(() => $('#checkout').scrollIntoView());
  }
};
