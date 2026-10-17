/* Your Saves: configured products kept for later */
Pages.saves = () => {
  function render() {
    const items = Saves.items();
    $('#savesSub').textContent = items.length
      ? `${items.length} saved item${items.length > 1 ? 's' : ''}, ready when you are.`
      : 'Nothing saved yet. Tap “Save for later” on any product to keep it here.';
    $('#savesList').innerHTML = items.length ? items.map(i => {
      const p = getProduct(i.id);
      const color = p.colors.find(c => c.name === i.color) || p.colors[0];
      const opt = (optionsOf(p) || []).find(o => o.label === i.option);
      const meta = [p.colors.length > 1 ? color.name : null, i.option].filter(Boolean).join(' · ');
      return `
      <li class="save-item" data-id="${p.id}" data-color="${esc(i.color || '')}" data-option="${esc(i.option || '')}">
        <a class="line-art" href="${link(`product.html?id=${p.id}`)}">${Art.render(p, { hex: color.hex })}</a>
        <div>
          <a class="line-name" href="${link(`product.html?id=${p.id}`)}">${esc(p.name)}</a>
          ${meta ? `<p class="line-meta">${esc(meta)}</p>` : ''}
          <p class="save-price">${fmt(p.price + (opt ? opt.add : 0))}</p>
        </div>
        <div class="save-actions">
          <button class="pill-btn small" data-save-add>Add to Bag</button>
          <button class="link-btn" data-save-remove>Remove</button>
        </div>
      </li>`;
    }).join('') : `<li class="empty"><div class="empty-ring">${Icons.bookmark}</div><a class="pill-btn" href="${link(`store.html`)}">Browse the Store</a></li>`;
  }

  $('#savesList').addEventListener('click', e => {
    const li = e.target.closest('.save-item');
    if (!li) return;
    const item = { id: li.dataset.id, color: li.dataset.color || null, option: li.dataset.option || null };
    if (e.target.closest('[data-save-add]')) { addToBag(item); }
    if (e.target.closest('[data-save-remove]')) {
      Saves.remove(item);
      toast(`${getProduct(item.id).name} removed from Your Saves.`, 'Undo', () => Saves.toggle(item));
    }
  });
  Saves.onChange(render);
  render();
};
