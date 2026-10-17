/* Entertainment page: Halo TV+ carousel (shared with home), Music and Arcade shelves */
Pages.entertainment = () => {
  initTV();

  $('#musicTrack').innerHTML = ALBUMS.map(al => `
    <article class="album" style="--a:${al.a};--b:${al.b}">
      <button class="album-cover" data-play="${esc(al.title)}" aria-label="Play ${esc(al.title)} by ${esc(al.artist)}">
        ${al.img ? `<img src="${al.img}" alt="" loading="lazy" decoding="async">` : '<span class="orb" aria-hidden="true"></span>'}
        <span class="album-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>
      </button>
      <p class="album-kind">${esc(al.kind)}</p>
      <h3>${esc(al.title)}</h3>
      <p class="muted">${esc(al.artist)}</p>
    </article>`).join('');

  $('#arcadeTrack').innerHTML = GAMES.map(g => `
    <article class="game" style="--a:${g.a};--b:${g.b}">
      <div class="game-art" aria-hidden="true">${g.img ? `<img src="${g.img}" alt="" loading="lazy" decoding="async">` : '<span class="orb"></span><span class="orb two"></span>'}</div>
      <div class="game-copy">
        <p class="album-kind">${esc(g.genre)}</p>
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.line)}</p>
        <button class="pill-btn small light" data-play="${esc(g.title)}">Get</button>
      </div>
    </article>`).join('');

  $('#entDevices').innerHTML = PRODUCTS.filter(p => p.category === 'entertainment').map(cardHTML).join('');

  $('#main').addEventListener('click', e => {
    const play = e.target.closest('[data-play]');
    if (play) toast(`${play.dataset.play} — playback isn’t part of this demo.`);
    const sub = e.target.closest('[data-sub]');
    if (sub) toast(`${sub.dataset.sub} trial — this demo store doesn’t start subscriptions.`);
  });

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    target && requestAnimationFrame(() => target.scrollIntoView());
  }
};
