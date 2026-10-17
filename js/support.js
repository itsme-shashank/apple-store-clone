/* Support page: topic shortcuts, searchable FAQ with animated disclosure */
Pages.support = () => {
  const groups = [
    { id: 'phones', title: 'Phone', icon: 'halo-16-pro', faqs: [
      ['How do I move my data to a new Halo phone?', 'Place your old phone next to the new one during setup and choose “Transfer from nearby phone”. Apps, photos and settings move across wirelessly, usually in under an hour.'],
      ['My battery drains faster than expected.', 'Open Settings › Battery to see which apps use the most power. Updating to the latest software and turning on Optimised Charging helps too. If battery health is below 80%, we can replace it.'],
      ['How do I take a screenshot?', 'Press the side button and volume up at the same time, then release both.']
    ] },
    { id: 'book', title: 'Book', icon: 'halo-book-air', faqs: [
      ['How do I check my Halo Book’s battery cycle count?', 'Hold Option and choose System Information from the menu, then select Power. Your cycle count and condition are listed there.'],
      ['Can I connect an external display?', 'Yes. Halo Book Air supports up to two external displays with the lid closed; Halo Book Pro supports up to three.']
    ] },
    { id: 'pad', title: 'Pad', icon: 'halo-pad-air', faqs: [
      ['Which Halo Pencil works with my Halo Pad?', 'Halo Pencil Pro works with Halo Pad Pro, Halo Pad Air and Halo Pad mini. Attach it magnetically to the side to pair and charge.'],
      ['How do I use Split View?', 'Tap the three dots at the top of an app, choose Split View, then pick a second app.']
    ] },
    { id: 'watch', title: 'Watch', icon: 'halo-watch-s2', faqs: [
      ['How do I pair Halo Watch with my phone?', 'Turn on your watch, hold it near your phone, and follow the animation that appears. Keep both devices close until pairing finishes.'],
      ['Is Halo Watch water resistant?', 'Series 2 and SE are water resistant to 50 metres and suitable for swimming. Ultra is rated to 100 metres and recreational diving to 40 metres.']
    ] },
    { id: 'vision', title: 'Vision', icon: 'halo-vision-pro', faqs: [
      ['Can I use Halo Vision Pro with glasses?', 'Halo Vision Pro does not fit over glasses. Order prescription optical inserts that attach magnetically to the lenses.'],
      ['How long does the battery last?', 'Up to 2.5 hours of general use, or all day while connected to power.'],
      ['How do I book a Halo Vision Pro demo?', 'Free 30‑minute demos run at every Halo Store. Use “Chat with us” below to choose a store and time; we’ll fit the headband and set up your vision prescription before you start.']
    ] },
    { id: 'audio', title: 'Audio & Home', icon: 'halo-buds-pro', faqs: [
      ['How do I reset Halo Buds?', 'Put both buds in the case, open the lid, then hold the button on the back for 15 seconds until the light flashes amber, then white.'],
      ['How do I set up Halo Sphere as a home hub?', 'Plug it in, then hold your phone near it and follow the prompts in the Home app. It becomes your hub automatically.'],
      ['How do I add smart home accessories?', 'Open the Home app, tap Add Accessory and scan the setup code on the accessory or its box. Assign it to a room and it’s ready to control by voice or from Control Centre.']
    ] },
    { id: 'entertainment', title: 'Entertainment', icon: 'halo-tv-4k', faqs: [
      ['How do I subscribe to Halo TV+, Music or Arcade?', 'Open the TV, Music or Arcade app on any Halo device and tap Try it free. Your trial converts to a monthly plan unless you cancel at least a day before it ends.'],
      ['How do I cancel a subscription?', 'Go to Settings › your name › Subscriptions, choose the service and tap Cancel. You keep access until the end of the current billing period.'],
      ['Can my family share my subscriptions?', 'Yes. With Family Sharing, up to five other people can use Halo TV+, Halo Music Family and Halo Arcade at no extra cost.'],
      ['How do I pair Halo Gamepad with Halo TV 4K?', 'Hold the Share and Home buttons on the gamepad until the light flashes, then open Settings › Remotes and Devices › Bluetooth on Halo TV and choose it.']
    ] },
    { id: 'care', title: 'Halo Care+', icon: null, faqs: [
      ['What does Halo Care+ cover?', 'Unlimited repairs for accidental damage, each with a small service fee, plus battery service and priority access to Specialists. Coverage begins on the date of purchase.'],
      ['Can I add Halo Care+ after I buy?', 'Yes. You can add Halo Care+ within 60 days of buying a Halo phone, Book, Pad, Watch, Audio or Home product. You can also choose it on the product page before adding to your bag.'],
      ['How do I make a claim?', 'Start a repair from “Book a repair” below, or visit a service provider. Bring your device and proof of purchase.']
    ] },
    { id: 'tradein', title: 'Trade In', icon: null, faqs: [
      ['How does Halo Trade In work?', 'Choose “Select a device” on any phone’s page, pick the phone you’re trading in and see your estimated credit instantly. The credit is taken off your order, and we collect the old phone when we deliver the new one.'],
      ['How much credit will I get?', 'Up to ₹52,000 for a recent Pro phone, and up to ₹6,000 for other smartphones. Final values depend on the condition, year and configuration of the device.'],
      ['What happens to my data?', 'Back up and erase your phone before handover. Any data that remains is securely wiped before the device is refurbished or recycled.']
    ] },
    { id: 'education', title: 'Education', icon: 'halo-book-air', faqs: [
      ['Who qualifies for education pricing?', 'Students at a university or college, their parents, and teachers or staff at any school. Verify once with your institution email at checkout.'],
      ['How much do students save?', 'Up to ₹10,000 on Halo Book and up to ₹6,000 on Halo Pad, plus 20% off Halo Care+ and a free Halo Music Student plan for six months.'],
      ['Can I use Halo Pad in the classroom?', 'Yes. Halo Pad works with Halo Pencil Pro for notes and drawing, and with Split View to keep reading and writing side by side.']
    ] },
    { id: 'accessories', title: 'Accessories', icon: 'magring-charger', faqs: [
      ['Which MagRing accessories work with my phone?', 'Every Halo 14 or later works with MagRing chargers, cases and batteries. They snap on magnetically and align automatically.'],
      ['Which items can I get engraved?', 'Halo Buds Pro, Halo Buds 4, Halo Tag and Halo Pencil Pro come with free engraving. Add it on the product page, and preview it live before you buy.'],
      ['Can I return an engraved item?', 'Engraved items can be returned only if they arrive damaged or faulty, because they are made just for you.']
    ] },
    { id: 'gifts', title: 'Gift Cards', icon: null, faqs: [
      ['How do I send a Halo Gift Card?', 'Choose an amount from ₹500 to ₹50,000, add a message and the recipient’s email. It arrives instantly, or on a date you choose.'],
      ['Where can a gift card be used?', 'For any product in the Halo Store, or for Halo TV+, Halo Music and Halo Arcade subscriptions.'],
      ['Do gift cards expire?', 'No. Halo Gift Cards never expire, and the balance carries over until it’s used up.']
    ] },
    { id: 'orders', title: 'Orders & Delivery', icon: null, faqs: [
      ['When will my order arrive?', 'Most orders arrive in 1–3 business days. Two‑hour delivery is available in select cities. You’ll get an email with tracking once your order ships.'],
      ['Can I change my delivery address?', 'You can change it any time before your order ships from Your Orders. After it ships, contact us and we’ll do our best to redirect it.'],
      ['Is delivery free?', 'Yes. Delivery is free on every order, with no minimum.']
    ] },
    { id: 'returns', title: 'Returns & Refunds', icon: null, faqs: [
      ['What is the return policy?', 'You can return most items within 14 days of delivery for a full refund. Items must be in the condition you received them, with all accessories.'],
      ['When will I get my refund?', 'Refunds are issued to your original payment method within 5–7 business days of us receiving your return.']
    ] },
    { id: 'payments', title: 'Payments & EMI', icon: null, faqs: [
      ['How does no‑cost EMI work?', 'Choose EMI at checkout with an eligible card. The interest is covered by a discount, so you pay only the product price, split over up to 24 months.'],
      ['Which payment methods do you accept?', 'Cards, UPI, net banking and pay on delivery. In this demo store, no payment is ever collected.']
    ] }
  ];
  const topicIcon = {
    orders: Icons.truck, returns: Icons.swap, payments: Icons.card,
    care: Icons.chat, tradein: Icons.swap, gifts: Icons.gift
  };

  $('#topics').innerHTML = groups.map(g => `
    <a class="topic" href="#${g.id}">
      <span class="cat-art">${g.icon ? Art.render(getProduct(g.icon)) : topicIcon[g.id]}</span>${esc(g.title)}
    </a>`).join('');

  $('#faqs').innerHTML = groups.map(g => `
    <section class="faq-group" id="${g.id}" aria-labelledby="h-${g.id}">
      <h2 id="h-${g.id}">${esc(g.title)}</h2>
      ${g.faqs.map(([q, a]) => `
        <details class="faq">
          <summary>${esc(q)}${Icons.plus}</summary>
          <div class="faq-body"><p>${esc(a)}</p></div>
        </details>`).join('')}
    </section>`).join('');

  /* Disclosure: animate height from its current value, so a second tap mid-animation reverses smoothly */
  $$('.faq').forEach(d => {
    const body = $('.faq-body', d);
    let anim = null;
    $('summary', d).addEventListener('click', e => {
      if (Motion.reducedMotion()) return;
      e.preventDefault();
      const from = body.getBoundingClientRect().height;
      const closing = d.open && !d.classList.contains('closing');
      if (!d.open) d.open = true;
      d.classList.toggle('closing', closing);
      const to = closing ? 0 : body.scrollHeight;
      anim && anim.cancel();
      anim = body.animate({ height: [`${from}px`, `${to}px`] }, { duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      anim.onfinish = () => {
        anim = null;
        if (closing) { d.open = false; d.classList.remove('closing'); }
      };
    });
  });

  /* Search filters questions and opens matches */
  const input = $('#supportSearch');
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    let hits = 0;
    $$('.faq-group').forEach(group => {
      let groupHits = 0;
      $$('.faq', group).forEach(d => {
        const match = !term || d.textContent.toLowerCase().includes(term);
        d.hidden = !match;
        d.open = !!term && match;
        if (match) groupHits++;
      });
      group.hidden = groupHits === 0;
      hits += groupHits;
    });
    $('#topics').hidden = !!term;
    $('#noResults').hidden = hits > 0;
    $('#noResults').textContent = `No answers found for “${input.value.trim()}”. Try different words, or contact us below.`;
  });

  $('#contactGrid').innerHTML = [
    [Icons.chat, 'Chat with us', 'Get answers from a Specialist in minutes.', 'Start a chat', 'chat'],
    [Icons.store, 'Book a repair', 'Send in your device, or visit a service provider near you.', 'Find a time', 'repair'],
    [Icons.truck, 'Track an order', 'See where your delivery is, or change its address.', 'Check status', 'track']
  ].map(([icon, h, t, cta, id]) => `
    <article class="contact">${icon}<h3>${h}</h3><p>${t}</p>
      <button class="pill-link" data-contact="${id}" style="justify-self:start">${cta} ${Icons.chevron}</button>
    </article>`).join('');
  $('#contactGrid').addEventListener('click', e => {
    if (e.target.closest('[data-contact]')) toast('This is a demo store — support requests aren’t sent anywhere.');
  });

  // ?q= opens the page already filtered, e.g. from the nav's "Helpful Topics"
  const preset = new URLSearchParams(location.search).get('q');
  if (preset) { input.value = preset; input.dispatchEvent(new Event('input')); }

  // Sections are rendered here, after the browser's own jump to the #hash, so scroll to it now
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    target && requestAnimationFrame(() => target.scrollIntoView());
  }
};
