/* Legal page: the site map is built from the same data as the nav, so it never goes stale */
Pages.legal = () => {
  const sections = [
    { label: 'Shop', links: [['store.html', 'Store'], ...CATEGORIES.filter(c => c.id !== 'all').map(c => [`store.html?c=${c.id}`, c.label])] },
    { label: 'Products', links: PRODUCTS.map(p => [`product.html?id=${p.id}`, p.name]) },
    { label: 'Halo Store', links: [['index.html', 'Home'], ['compare.html', 'Compare models'], ['bag.html', 'Bag'], ['saves.html', 'Your Saves'], ['entertainment.html', 'Entertainment']] },
    { label: 'Support', links: [['support.html', 'Support home'], ['support.html#orders', 'Orders & Delivery'], ['support.html#returns', 'Returns & Refunds'], ['support.html#payments', 'Payments & EMI'], ['support.html#contact', 'Contact Us']] },
    { label: 'Legal', links: [['#privacy', 'Privacy Policy'], ['#terms', 'Terms of Use'], ['#sales', 'Sales Policy'], ['#legal', 'Legal']] }
  ];
  $('#sitemapGrid').innerHTML = sections.map(s => `
    <div><h3>${esc(s.label)}</h3><ul>${s.links.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('');

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    target && requestAnimationFrame(() => target.scrollIntoView());
  }
};
