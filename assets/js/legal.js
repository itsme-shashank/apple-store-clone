/* Legal page: the site map is built from the same data as the nav, so it never goes stale */
Pages.legal = () => {
  const sections = [
    { label: 'Shop', links: [[link('store.html'), 'Store'], ...CATEGORIES.filter(c => c.id !== 'all').map(c => [link(`store.html?c=${c.id}`), c.label])] },
    { label: 'Products', links: PRODUCTS.map(p => [link(`product.html?id=${p.id}`), p.name]) },
    { label: 'Halo Store', links: [[link('index.html'), 'Home'], [link('compare.html'), 'Compare models'], [link('bag.html'), 'Bag'], [link('saves.html'), 'Your Saves'], [link('entertainment.html'), 'Entertainment']] },
    { label: 'Support', links: [[link('support.html'), 'Support home'], [link('support.html#orders'), 'Orders & Delivery'], [link('support.html#returns'), 'Returns & Refunds'], [link('support.html#payments'), 'Payments & EMI'], [link('support.html#contact'), 'Contact Us']] },
    { label: 'Legal', links: [['#privacy', 'Privacy Policy'], ['#terms', 'Terms of Use'], ['#sales', 'Sales Policy'], ['#legal', 'Legal']] }
  ];
  $('#sitemapGrid').innerHTML = sections.map(s => `
    <div><h3>${esc(s.label)}</h3><ul>${s.links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('');

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    target && requestAnimationFrame(() => target.scrollIntoView());
  }
};
