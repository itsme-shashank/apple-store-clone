/* Product illustrations, drawn as SVG so the site ships with zero image assets. */
const Art = (() => {
  let uid = 0;

  function rgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  // amt in [-1, 1]: negative darkens toward black, positive lightens toward white
  function shade(hex, amt) {
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    const [r, g, b] = rgb(hex).map(c => Math.round((t - c) * p + c));
    return `rgb(${r},${g},${b})`;
  }
  function luminance(hex) {
    const [r, g, b] = rgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function lens(cx, cy, r, id) {
    return `
      <circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="rgba(0,0,0,.25)"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}ring)"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.74}" fill="#07070b"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="url(#${id}glass)"/>
      <circle cx="${cx - r * 0.2}" cy="${cy - r * 0.22}" r="${r * 0.14}" fill="rgba(255,255,255,.6)"/>`;
  }

  function lensDefs(id) {
    return `
      <radialGradient id="${id}ring" cx="35%" cy="30%" r="80%">
        <stop offset="0" stop-color="#6b6b70"/><stop offset=".55" stop-color="#2a2a2e"/><stop offset="1" stop-color="#121214"/>
      </radialGradient>
      <radialGradient id="${id}glass" cx="40%" cy="35%" r="70%">
        <stop offset="0" stop-color="#3b4f7a"/><stop offset=".6" stop-color="#141a2c"/><stop offset="1" stop-color="#040406"/>
      </radialGradient>`;
  }

  function logo(cx, cy, r, hex, opacity = 1) {
    const ink = luminance(hex) > 0.55 ? shade(hex, -0.28) : shade(hex, 0.28);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ink}" stroke-width="${r * 0.28}" opacity="${opacity}"/>`;
  }

  function frameDefs(id, hex, metal) {
    const edge = metal
      ? [shade(hex, -0.3), shade(hex, 0.45), shade(hex, -0.08), shade(hex, 0.35), shade(hex, -0.3)]
      : [shade(hex, -0.2), shade(hex, 0.25), hex, shade(hex, 0.2), shade(hex, -0.2)];
    return `
      <linearGradient id="${id}frame" x1="0" x2="1">
        ${edge.map((c, i) => `<stop offset="${i / (edge.length - 1)}" stop-color="${c}"/>`).join('')}
      </linearGradient>`;
  }

  /* ---------- Phones ---------- */
  function phoneBack(hex, variant = 'pro') {
    const id = 'a' + ++uid;
    const metal = variant === 'pro' || variant === 'air';
    let camera = '';
    if (variant === 'pro') {
      camera = `
        <rect x="16" y="16" width="112" height="112" rx="32" fill="${shade(hex, 0.1)}" stroke="${shade(hex, -0.12)}" stroke-width="1"/>
        ${lens(48, 50, 19, id)}${lens(48, 96, 19, id)}${lens(92, 73, 19, id)}
        <circle cx="96" cy="34" r="6" fill="#f3efe2" stroke="#bbb" stroke-width="1"/>
        <circle cx="96" cy="111" r="5" fill="#1a1a1c"/>`;
    } else if (variant === 'air') {
      camera = `
        <rect x="10" y="18" width="180" height="60" rx="30" fill="${shade(hex, 0.12)}" stroke="${shade(hex, -0.12)}" stroke-width="1"/>
        ${lens(42, 48, 18, id)}
        <circle cx="80" cy="48" r="6" fill="#f3efe2" stroke="#bbb" stroke-width="1"/>
        <circle cx="158" cy="48" r="4" fill="#1a1a1c"/>`;
    } else if (variant === 'standard') {
      camera = `
        <rect x="18" y="18" width="62" height="112" rx="31" fill="${shade(hex, 0.12)}" stroke="${shade(hex, -0.1)}" stroke-width="1"/>
        ${lens(49, 49, 19, id)}${lens(49, 99, 19, id)}
        <circle cx="96" cy="40" r="6" fill="#f3efe2" stroke="#bbb" stroke-width="1"/>`;
    } else {
      camera = `${lens(38, 38, 17, id)}<circle cx="38" cy="74" r="6" fill="#f3efe2" stroke="#bbb" stroke-width="1"/>`;
    }
    return `
<svg viewBox="-4 -2 208 414" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <defs>
    ${frameDefs(id, hex, metal)}${lensDefs(id)}
    <linearGradient id="${id}back" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${shade(hex, 0.14)}"/><stop offset=".55" stop-color="${hex}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/>
    </linearGradient>
    <linearGradient id="${id}sheen" x1="0" y1="0" x2="1" y2=".7">
      <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/>
    </linearGradient>
  </defs>
  <rect x="-3" y="104" width="4" height="30" rx="2" fill="${shade(hex, -0.2)}"/>
  <rect x="-3" y="146" width="4" height="46" rx="2" fill="${shade(hex, -0.2)}"/>
  <rect x="199" y="150" width="4" height="64" rx="2" fill="${shade(hex, -0.2)}"/>
  <rect x="0" y="0" width="200" height="410" rx="38" fill="url(#${id}frame)"/>
  <rect x="5" y="5" width="190" height="400" rx="34" fill="url(#${id}back)"/>
  ${camera}
  ${logo(100, 228, 15, hex)}
  <rect x="5" y="5" width="190" height="400" rx="34" fill="url(#${id}sheen)"/>
</svg>`;
  }

  function phoneFront(hex, variant = 'pro') {
    const id = 'a' + ++uid;
    const metal = variant === 'pro' || variant === 'air';
    const deep = shade(hex, luminance(hex) > 0.6 ? -0.55 : -0.35);
    const glow = shade(hex, 0.35);
    const bezel = variant === 'se' ? 10 : 7;
    return `
<svg viewBox="-4 -2 208 414" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <defs>
    ${frameDefs(id, hex, metal)}
    <linearGradient id="${id}wall" x1="0" y1="0" x2=".4" y2="1">
      <stop offset="0" stop-color="#05060a"/><stop offset=".45" stop-color="${deep}"/><stop offset="1" stop-color="${glow}"/>
    </linearGradient>
    <radialGradient id="${id}orb" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${shade(hex, 0.6)}" stop-opacity=".95"/><stop offset="1" stop-color="${hex}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${id}clip"><rect x="${5 + bezel}" y="${5 + bezel}" width="${190 - bezel * 2}" height="${400 - bezel * 2}" rx="${34 - bezel + 2}"/></clipPath>
  </defs>
  <rect x="-3" y="104" width="4" height="30" rx="2" fill="${shade(hex, -0.2)}"/>
  <rect x="-3" y="146" width="4" height="46" rx="2" fill="${shade(hex, -0.2)}"/>
  <rect x="199" y="150" width="4" height="64" rx="2" fill="${shade(hex, -0.2)}"/>
  <rect x="0" y="0" width="200" height="410" rx="38" fill="url(#${id}frame)"/>
  <rect x="5" y="5" width="190" height="400" rx="34" fill="#030303"/>
  <g clip-path="url(#${id}clip)">
    <rect x="0" y="0" width="200" height="410" fill="url(#${id}wall)"/>
    <circle cx="150" cy="330" r="130" fill="url(#${id}orb)"/>
    <circle cx="30" cy="250" r="90" fill="url(#${id}orb)" opacity=".55"/>
    <text x="100" y="78" text-anchor="middle" fill="rgba(255,255,255,.8)" font-family="-apple-system,system-ui,sans-serif" font-size="11" font-weight="600">Friday 17 October</text>
    <text x="100" y="132" text-anchor="middle" fill="#fff" font-family="-apple-system,system-ui,sans-serif" font-size="58" font-weight="700" letter-spacing="-1.5">9:41</text>
    <rect x="72" y="388" width="56" height="4" rx="2" fill="rgba(255,255,255,.75)"/>
  </g>
  ${variant === 'se' ? '' : '<rect x="74" y="20" width="52" height="16" rx="8" fill="#000"/>'}
  <rect x="5" y="5" width="190" height="400" rx="34" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
</svg>`;
  }

  /* ---------- Accessories ---------- */
  function buds(hex) {
    const id = 'a' + ++uid;
    const bud = (x, flip) => `
      <g transform="translate(${x} 34) scale(${flip ? -1 : 1} 1)">
        <rect x="-8" y="30" width="18" height="86" rx="9" fill="url(#${id}body)"/>
        <ellipse cx="0" cy="30" rx="30" ry="27" fill="url(#${id}body)"/>
        <ellipse cx="-14" cy="26" rx="11" ry="14" fill="${shade(hex, -0.12)}"/>
        <ellipse cx="-14" cy="26" rx="7" ry="9" fill="#9a9a9f" opacity=".55"/>
        <rect x="-4" y="108" width="10" height="6" rx="3" fill="#bdbdc1"/>
      </g>`;
    return `
<svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}body" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${shade(hex, -0.1)}"/></linearGradient>
    <linearGradient id="${id}case" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
  </defs>
  <ellipse cx="150" cy="262" rx="110" ry="10" fill="rgba(0,0,0,.12)"/>
  <rect x="62" y="120" width="176" height="138" rx="52" fill="url(#${id}case)"/>
  <path d="M64 160 H236" stroke="${shade(hex, -0.2)}" stroke-width="1.5"/>
  <circle cx="150" cy="196" r="4" fill="#46c46f"/>
  ${bud(112, false)}${bud(188, true)}
</svg>`;
  }

  function headphones(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}cup" x1="0" x2="1"><stop offset="0" stop-color="${shade(hex, -0.18)}"/><stop offset=".5" stop-color="${shade(hex, 0.18)}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
  </defs>
  <ellipse cx="150" cy="282" rx="120" ry="9" fill="rgba(0,0,0,.12)"/>
  <path d="M62 160 C 56 30, 244 30, 238 160" fill="none" stroke="#c8c8cc" stroke-width="12" stroke-linecap="round"/>
  <path d="M82 120 C 92 56, 208 56, 218 120" fill="none" stroke="${shade(hex, -0.05)}" stroke-width="20" stroke-linecap="round"/>
  <path d="M82 120 C 92 56, 208 56, 218 120" fill="none" stroke="${shade(hex, 0.3)}" stroke-width="20" stroke-dasharray="2 4" stroke-linecap="round" opacity=".5"/>
  <rect x="38" y="138" width="76" height="132" rx="34" fill="url(#${id}cup)"/>
  <rect x="186" y="138" width="76" height="132" rx="34" fill="url(#${id}cup)"/>
  <rect x="98" y="150" width="20" height="108" rx="10" fill="${shade(hex, -0.3)}"/>
  <rect x="182" y="150" width="20" height="108" rx="10" fill="${shade(hex, -0.3)}"/>
  <circle cx="244" cy="160" r="7" fill="${shade(hex, 0.25)}" stroke="${shade(hex, -0.2)}"/>
</svg>`;
  }

  function charger(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${id}face" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${shade(hex, -0.1)}"/></radialGradient>
    <linearGradient id="${id}rim" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f0f0f2"/><stop offset=".5" stop-color="#9c9ca2"/><stop offset="1" stop-color="#e2e2e6"/></linearGradient>
  </defs>
  <path d="M150 214 C150 262, 210 268, 280 292" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <path d="M150 214 C150 262, 210 268, 280 292" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="9" stroke-dasharray="1 3"/>
  <circle cx="150" cy="128" r="96" fill="url(#${id}rim)"/>
  <circle cx="150" cy="128" r="88" fill="url(#${id}face)"/>
  <circle cx="150" cy="128" r="56" fill="none" stroke="rgba(0,0,0,.07)" stroke-width="10"/>
  ${logo(150, 128, 12, '#e8e8ea', 0.8)}
</svg>`;
  }

  function brick(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}b" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
  </defs>
  <ellipse cx="150" cy="268" rx="90" ry="9" fill="rgba(0,0,0,.12)"/>
  <rect x="86" y="236" width="10" height="26" rx="3" fill="#cfcfd3"/><rect x="204" y="236" width="10" height="26" rx="3" fill="#cfcfd3"/>
  <rect x="70" y="50" width="160" height="190" rx="34" fill="url(#${id}b)"/>
  <rect x="70" y="50" width="160" height="190" rx="34" fill="none" stroke="rgba(0,0,0,.06)"/>
  <rect x="108" y="128" width="28" height="11" rx="5.5" fill="#2a2a2e"/>
  <rect x="164" y="128" width="28" height="11" rx="5.5" fill="#2a2a2e"/>
  <rect x="113" y="132" width="18" height="3" rx="1.5" fill="#6a6a70"/>
  <rect x="169" y="132" width="18" height="3" rx="1.5" fill="#6a6a70"/>
</svg>`;
  }

  function cable(hex) {
    const dark = luminance(hex) < 0.4;
    const weave = dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)';
    const path = 'M40 230 C 40 150, 260 150, 250 100 C 240 40, 80 40, 90 110 C 100 180, 250 190, 260 250';
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="${path}" fill="none" stroke="${shade(hex, -0.15)}" stroke-width="13" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="${hex}" stroke-width="10" stroke-linecap="round"/>
  <path d="${path}" fill="none" stroke="${weave}" stroke-width="10" stroke-dasharray="2 2.5"/>
  <rect x="28" y="226" width="24" height="40" rx="8" fill="#e8e8ec" stroke="#c4c4c8"/>
  <rect x="34" y="262" width="12" height="16" rx="4" fill="#b8b8bd"/>
  <rect x="248" y="246" width="24" height="40" rx="8" fill="#e8e8ec" stroke="#c4c4c8" transform="rotate(-12 260 266)"/>
</svg>`;
  }

  function battery(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}b" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${shade(hex, 0.15)}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
  </defs>
  <ellipse cx="150" cy="282" rx="96" ry="9" fill="rgba(0,0,0,.12)"/>
  <rect x="72" y="30" width="156" height="244" rx="36" fill="url(#${id}b)"/>
  <circle cx="150" cy="150" r="54" fill="none" stroke="${shade(hex, -0.12)}" stroke-width="5"/>
  ${logo(150, 150, 12, hex)}
  <circle cx="132" cy="252" r="3" fill="#fff" opacity=".9"/><circle cx="144" cy="252" r="3" fill="#fff" opacity=".9"/>
  <circle cx="156" cy="252" r="3" fill="#fff" opacity=".9"/><circle cx="168" cy="252" r="3" fill="#fff" opacity=".3"/>
</svg>`;
  }

  function phoneCase(hex, variant) {
    const id = 'a' + ++uid;
    const clear = variant === 'clear';
    const body = clear ? 'rgba(220,230,240,.35)' : hex;
    return `
<svg viewBox="-4 -2 208 414" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}c" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${clear ? 'rgba(255,255,255,.55)' : shade(hex, 0.12)}"/>
      <stop offset="1" stop-color="${clear ? 'rgba(200,210,225,.35)' : shade(hex, -0.1)}"/>
    </linearGradient>
  </defs>
  ${clear ? phoneBack('#c2bcb2', 'pro').replace(/<svg[^>]*>|<\/svg>/g, '') : ''}
  <rect x="-2" y="-1" width="204" height="412" rx="40" fill="url(#${id}c)" stroke="${clear ? 'rgba(255,255,255,.8)' : shade(hex, -0.2)}" stroke-width="2"/>
  <rect x="12" y="12" width="120" height="120" rx="34" fill="${clear ? 'rgba(0,0,0,.0)' : '#151517'}" stroke="${clear ? 'rgba(255,255,255,.7)' : shade(hex, -0.25)}" stroke-width="2"/>
  ${clear ? '' : `<circle cx="48" cy="50" r="15" fill="#2b2b30"/><circle cx="48" cy="96" r="15" fill="#2b2b30"/><circle cx="92" cy="73" r="15" fill="#2b2b30"/>`}
  <circle cx="100" cy="228" r="62" fill="none" stroke="${clear ? 'rgba(255,255,255,.75)' : shade(hex, -0.12)}" stroke-width="5"/>
  <rect x="200" y="148" width="6" height="66" rx="3" fill="${clear ? 'rgba(255,255,255,.6)' : shade(hex, -0.2)}"/>
  ${clear ? '' : logo(100, 228, 15, body)}
</svg>`;
  }

  function tag(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}rim" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fafafa"/><stop offset=".45" stop-color="#8e8e94"/><stop offset=".6" stop-color="#d9d9de"/><stop offset="1" stop-color="#7a7a80"/></linearGradient>
    <radialGradient id="${id}face" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${shade(hex, -0.06)}"/></radialGradient>
  </defs>
  <ellipse cx="150" cy="262" rx="90" ry="10" fill="rgba(0,0,0,.12)"/>
  <circle cx="150" cy="146" r="104" fill="url(#${id}rim)"/>
  <circle cx="150" cy="146" r="92" fill="url(#${id}face)"/>
  ${logo(150, 146, 22, '#d8d8dc')}
</svg>`;
  }

  /* ---------- Shared: a lock-screen style wallpaper ---------- */
  function wallpaperDefs(id, hex) {
    return `
      <linearGradient id="${id}wall" x1="0" y1="0" x2=".5" y2="1">
        <stop offset="0" stop-color="#05060a"/><stop offset=".5" stop-color="${shade(hex, luminance(hex) > 0.6 ? -0.5 : -0.3)}"/><stop offset="1" stop-color="${shade(hex, 0.35)}"/>
      </linearGradient>
      <radialGradient id="${id}orb" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="${shade(hex, 0.6)}" stop-opacity=".95"/><stop offset="1" stop-color="${hex}" stop-opacity="0"/>
      </radialGradient>`;
  }

  /* ---------- Laptop ---------- */
  function laptop(hex, variant) {
    const id = 'a' + ++uid;
    const pro = variant === 'pro';
    return `
<svg viewBox="0 0 400 262" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    ${wallpaperDefs(id, pro ? '#7c8cf0' : hex)}
    <linearGradient id="${id}base" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${shade(hex, 0.25)}"/><stop offset="1" stop-color="${shade(hex, -0.25)}"/></linearGradient>
    <clipPath id="${id}c"><rect x="56" y="16" width="288" height="184" rx="6"/></clipPath>
  </defs>
  <ellipse cx="200" cy="250" rx="180" ry="8" fill="rgba(0,0,0,.18)"/>
  <rect x="44" y="4" width="312" height="208" rx="14" fill="${shade(hex, -0.15)}"/>
  <rect x="47" y="7" width="306" height="202" rx="12" fill="#050505"/>
  <g clip-path="url(#${id}c)">
    <rect x="56" y="16" width="288" height="184" fill="url(#${id}wall)"/>
    <circle cx="280" cy="190" r="120" fill="url(#${id}orb)"/>
    <circle cx="90" cy="150" r="80" fill="url(#${id}orb)" opacity=".5"/>
    <rect x="56" y="16" width="288" height="10" fill="rgba(0,0,0,.35)"/>
    <rect x="150" y="176" width="100" height="16" rx="6" fill="rgba(255,255,255,.18)"/>
  </g>
  <rect x="184" y="7" width="32" height="9" rx="4" fill="#050505"/>
  <path d="M14 212 H386 L380 232 Q378 238 370 238 H30 Q22 238 20 232 Z" fill="url(#${id}base)"/>
  <rect x="170" y="212" width="60" height="6" rx="3" fill="${shade(hex, -0.3)}"/>
</svg>`;
  }

  /* ---------- All-in-one desktop ---------- */
  function desktop(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    ${wallpaperDefs(id, hex)}
    <linearGradient id="${id}chin" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${shade(hex, 0.1)}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
    <linearGradient id="${id}stand" x1="0" x2="1"><stop offset="0" stop-color="${shade(hex, -0.25)}"/><stop offset=".5" stop-color="${shade(hex, 0.15)}"/><stop offset="1" stop-color="${shade(hex, -0.25)}"/></linearGradient>
    <clipPath id="${id}c"><rect x="24" y="14" width="272" height="154" rx="3"/></clipPath>
  </defs>
  <ellipse cx="160" cy="290" rx="70" ry="6" fill="rgba(0,0,0,.18)"/>
  <path d="M128 206 L118 284 H202 L192 206 Z" fill="url(#${id}stand)"/>
  <rect x="10" y="4" width="300" height="208" rx="12" fill="url(#${id}chin)"/>
  <rect x="18" y="10" width="284" height="164" rx="4" fill="#f5f5f5"/>
  <g clip-path="url(#${id}c)">
    <rect x="24" y="14" width="272" height="154" fill="url(#${id}wall)"/>
    <circle cx="230" cy="170" r="110" fill="url(#${id}orb)"/>
    <circle cx="60" cy="120" r="70" fill="url(#${id}orb)" opacity=".5"/>
  </g>
</svg>`;
  }

  /* ---------- Tablet ---------- */
  function tablet(hex, variant, view) {
    const id = 'a' + ++uid;
    const w = variant === 'mini' ? 230 : 280, h = variant === 'mini' ? 340 : 390;
    const metal = [shade(hex, -0.25), shade(hex, 0.35), shade(hex, -0.05), shade(hex, 0.3), shade(hex, -0.25)];
    const frame = `<linearGradient id="${id}frame" x1="0" x2="1">${metal.map((c, i) => `<stop offset="${i / 4}" stop-color="${c}"/>`).join('')}</linearGradient>`;
    if (view === 'front') {
      const b = variant === 'pro' ? 10 : 13;
      return `
<svg viewBox="-2 -2 ${w + 4} ${h + 4}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${frame}${wallpaperDefs(id, hex)}<clipPath id="${id}c"><rect x="${b + 3}" y="${b + 3}" width="${w - (b + 3) * 2}" height="${h - (b + 3) * 2}" rx="14"/></clipPath></defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="26" fill="url(#${id}frame)"/>
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="23" fill="#040404"/>
  <g clip-path="url(#${id}c)">
    <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${id}wall)"/>
    <circle cx="${w * 0.75}" cy="${h * 0.8}" r="${w * 0.6}" fill="url(#${id}orb)"/>
    <circle cx="${w * 0.1}" cy="${h * 0.55}" r="${w * 0.4}" fill="url(#${id}orb)" opacity=".5"/>
    <text x="${w / 2}" y="${h * 0.27}" text-anchor="middle" fill="#fff" font-family="-apple-system,system-ui,sans-serif" font-size="${w * 0.2}" font-weight="700" letter-spacing="-2">9:41</text>
  </g>
  <circle cx="${w / 2}" cy="${b / 2 + 2}" r="2.5" fill="#1d1d24"/>
</svg>`;
    }
    return `
<svg viewBox="-2 -2 ${w + 4} ${h + 4}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${frame}${lensDefs(id)}
    <linearGradient id="${id}back" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(hex, 0.12)}"/><stop offset=".6" stop-color="${hex}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="26" fill="url(#${id}frame)"/>
  <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="23" fill="url(#${id}back)"/>
  ${variant === 'pro'
    ? `<rect x="14" y="14" width="56" height="78" rx="18" fill="${shade(hex, 0.08)}" stroke="${shade(hex, -0.15)}"/>${lens(42, 38, 12, id)}${lens(42, 70, 9, id)}`
    : lens(30, 30, 12, id)}
  ${logo(w / 2, h / 2, 18, hex)}
  ${variant === 'pro' ? `<rect x="${w / 2 - 24}" y="${h - 14}" width="48" height="4" rx="2" fill="${shade(hex, -0.2)}"/>` : ''}
</svg>`;
  }

  /* ---------- Watch ---------- */
  function watch(hex, variant, band) {
    const id = 'a' + ++uid;
    const ultra = variant === 'ultra';
    const caseHex = band ? '#d9d9de' : hex;
    const bandHex = band ? hex : (ultra ? '#e46d2f' : shade(hex, luminance(hex) > 0.6 ? -0.15 : 0.12));
    const cx = ultra ? 18 : 30;
    return `
<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}case" x1="0" x2="1"><stop offset="0" stop-color="${shade(caseHex, -0.25)}"/><stop offset=".3" stop-color="${shade(caseHex, 0.4)}"/><stop offset=".7" stop-color="${caseHex}"/><stop offset="1" stop-color="${shade(caseHex, -0.3)}"/></linearGradient>
    <linearGradient id="${id}band" x1="0" x2="1"><stop offset="0" stop-color="${shade(bandHex, -0.18)}"/><stop offset=".5" stop-color="${shade(bandHex, 0.1)}"/><stop offset="1" stop-color="${shade(bandHex, -0.18)}"/></linearGradient>
  </defs>
  <path d="M100 0 H200 L194 100 H106 Z" fill="url(#${id}band)"/>
  <path d="M106 260 H194 L200 360 H100 Z" fill="url(#${id}band)"/>
  ${band ? `<rect x="104" y="300" width="92" height="10" rx="5" fill="${shade(bandHex, -0.25)}"/>` : ''}
  <rect x="78" y="82" width="144" height="196" rx="${cx + 12}" fill="url(#${id}case)"/>
  <rect x="220" y="140" width="12" height="36" rx="5" fill="${shade(caseHex, -0.1)}" stroke="${shade(caseHex, -0.3)}"/>
  ${ultra ? `<rect x="66" y="128" width="12" height="50" rx="4" fill="#e46d2f"/>` : ''}
  <rect x="86" y="90" width="128" height="180" rx="${cx + 4}" fill="#000"/>
  <text x="150" y="168" text-anchor="middle" fill="#fff" font-family="-apple-system,system-ui,sans-serif" font-size="46" font-weight="600" letter-spacing="-1">10:09</text>
  <text x="150" y="122" text-anchor="middle" fill="${ultra ? '#ff9f4a' : '#ff6b6b'}" font-family="-apple-system,system-ui,sans-serif" font-size="12" font-weight="600">FRI 17</text>
  <circle cx="122" cy="220" r="16" fill="none" stroke="#2a2a2e" stroke-width="5"/>
  <circle cx="122" cy="220" r="16" fill="none" stroke="#ff375f" stroke-width="5" stroke-dasharray="70 101" transform="rotate(-90 122 220)" stroke-linecap="round"/>
  <circle cx="178" cy="220" r="16" fill="none" stroke="#2a2a2e" stroke-width="5"/>
  <circle cx="178" cy="220" r="16" fill="none" stroke="#30d158" stroke-width="5" stroke-dasharray="52 101" transform="rotate(-90 178 220)" stroke-linecap="round"/>
</svg>`;
  }

  /* ---------- Headset ---------- */
  function headset(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}glass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a3d48"/><stop offset=".45" stop-color="#0a0b10"/><stop offset="1" stop-color="#1a1b22"/></linearGradient>
    <linearGradient id="${id}sheen" x1="0" x2="1" y1="0" y2=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}frame" x1="0" x2="1"><stop offset="0" stop-color="${shade(hex, -0.3)}"/><stop offset=".5" stop-color="${shade(hex, 0.3)}"/><stop offset="1" stop-color="${shade(hex, -0.3)}"/></linearGradient>
  </defs>
  <ellipse cx="200" cy="236" rx="170" ry="9" fill="rgba(0,0,0,.18)"/>
  <path d="M30 120 C 10 190, 80 222, 120 210" fill="none" stroke="#8e8e93" stroke-width="26" stroke-linecap="round"/>
  <path d="M370 120 C 390 190, 320 222, 280 210" fill="none" stroke="#8e8e93" stroke-width="26" stroke-linecap="round"/>
  <path d="M30 120 C 10 190, 80 222, 120 210" fill="none" stroke="#b3b3b8" stroke-width="26" stroke-dasharray="2 3" opacity=".6"/>
  <path d="M370 120 C 390 190, 320 222, 280 210" fill="none" stroke="#b3b3b8" stroke-width="26" stroke-dasharray="2 3" opacity=".6"/>
  <rect x="44" y="70" width="312" height="138" rx="66" fill="#58585e"/>
  <rect x="40" y="48" width="320" height="140" rx="70" fill="url(#${id}frame)"/>
  <rect x="48" y="54" width="304" height="128" rx="64" fill="url(#${id}glass)"/>
  <rect x="48" y="54" width="304" height="128" rx="64" fill="url(#${id}sheen)"/>
  <ellipse cx="140" cy="118" rx="40" ry="18" fill="#7c8cf0" opacity=".18"/>
  <ellipse cx="260" cy="118" rx="40" ry="18" fill="#bf5af2" opacity=".18"/>
  <rect x="330" y="36" width="20" height="12" rx="6" fill="${shade(hex, -0.1)}"/>
</svg>`;
  }

  /* ---------- Smart speaker ---------- */
  function speaker(hex, variant) {
    const id = 'a' + ++uid;
    const mini = variant === 'mini';
    const mesh = `<pattern id="${id}mesh" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="${shade(hex, -0.18)}"/></pattern>`;
    const body = `<linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="${shade(hex, -0.2)}"/><stop offset=".4" stop-color="${shade(hex, 0.18)}"/><stop offset="1" stop-color="${shade(hex, -0.22)}"/></linearGradient>`;
    const glow = `<radialGradient id="${id}g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="#bf5af2" stop-opacity=".8"/><stop offset=".7" stop-color="#0a84ff" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>`;
    if (mini) {
      return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${mesh}${body}${glow}</defs>
  <ellipse cx="150" cy="268" rx="100" ry="10" fill="rgba(0,0,0,.15)"/>
  <path d="M40 120 A110 110 0 0 0 260 120 Z" fill="url(#${id}b)"/>
  <path d="M40 120 A110 110 0 0 0 260 120 Z" fill="url(#${id}mesh)"/>
  <ellipse cx="150" cy="120" rx="110" ry="28" fill="${shade(hex, 0.05)}"/>
  <ellipse cx="150" cy="120" rx="58" ry="14" fill="url(#${id}g)"/>
</svg>`;
    }
    return `
<svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${mesh}${body}${glow}</defs>
  <ellipse cx="150" cy="300" rx="100" ry="10" fill="rgba(0,0,0,.15)"/>
  <path d="M60 60 Q60 40 80 36 H220 Q240 40 240 60 V250 Q240 296 150 296 Q60 296 60 250 Z" fill="url(#${id}b)"/>
  <path d="M60 60 Q60 40 80 36 H220 Q240 40 240 60 V250 Q240 296 150 296 Q60 296 60 250 Z" fill="url(#${id}mesh)"/>
  <ellipse cx="150" cy="44" rx="88" ry="20" fill="${shade(hex, 0.04)}"/>
  <ellipse cx="150" cy="44" rx="52" ry="11" fill="url(#${id}g)"/>
</svg>`;
  }

  /* ---------- TV box + remote ---------- */
  function tvbox() {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}top" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3a3a3e"/><stop offset="1" stop-color="#0c0c0e"/></linearGradient>
    <linearGradient id="${id}r" x1="0" x2="1"><stop offset="0" stop-color="#b9b9be"/><stop offset=".5" stop-color="#f2f2f4"/><stop offset="1" stop-color="#a6a6ab"/></linearGradient>
  </defs>
  <ellipse cx="150" cy="250" rx="140" ry="12" fill="rgba(0,0,0,.18)"/>
  <rect x="20" y="150" width="230" height="90" rx="26" fill="#0b0b0d"/>
  <rect x="20" y="132" width="230" height="96" rx="26" fill="url(#${id}top)"/>
  ${logo(122, 180, 11, '#3a3a3e')}
  <text x="140" y="187" fill="#8e8e93" font-family="-apple-system,system-ui,sans-serif" font-size="20" font-weight="600">tv</text>
  <rect x="236" y="30" width="54" height="214" rx="24" fill="url(#${id}r)"/>
  <circle cx="263" cy="76" r="22" fill="#d8d8dc" stroke="#9a9aa0"/>
  <circle cx="263" cy="76" r="9" fill="#ececef"/>
  <circle cx="250" cy="126" r="7" fill="#2a2a2e"/><circle cx="276" cy="126" r="7" fill="#2a2a2e"/>
  <circle cx="250" cy="150" r="7" fill="#2a2a2e"/><rect x="269" y="143" width="14" height="40" rx="7" fill="#2a2a2e"/>
</svg>`;
  }

  /* ---------- Game controller ---------- */
  function gamepad(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${id}b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${shade(hex, 0.2)}"/><stop offset="1" stop-color="${shade(hex, -0.2)}"/></linearGradient></defs>
  <ellipse cx="170" cy="226" rx="140" ry="9" fill="rgba(0,0,0,.15)"/>
  <path d="M90 40 H250 C300 40 320 90 332 160 C340 210 300 228 276 200 L246 164 H94 L64 200 C40 228 0 210 8 160 C20 90 40 40 90 40 Z" fill="url(#${id}b)"/>
  <rect x="68" y="86" width="16" height="48" rx="3" fill="${shade(hex, -0.45)}"/><rect x="52" y="102" width="48" height="16" rx="3" fill="${shade(hex, -0.45)}"/>
  <circle cx="260" cy="88" r="10" fill="#ff453a"/><circle cx="284" cy="110" r="10" fill="#0a84ff"/>
  <circle cx="236" cy="110" r="10" fill="#ffd60a"/><circle cx="260" cy="132" r="10" fill="#30d158"/>
  <circle cx="128" cy="144" r="22" fill="${shade(hex, -0.5)}"/><circle cx="212" cy="144" r="22" fill="${shade(hex, -0.5)}"/>
  <circle cx="128" cy="144" r="14" fill="${shade(hex, -0.3)}"/><circle cx="212" cy="144" r="14" fill="${shade(hex, -0.3)}"/>
</svg>`;
  }

  /* ---------- Keyboard ---------- */
  function keyboard(hex) {
    const id = 'a' + ++uid;
    const keyHex = luminance(hex) > 0.5 ? '#fbfbfd' : '#1c1c1e';
    let keys = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 13; c++) keys += `<rect x="${24 + c * 27.4}" y="${30 + r * 27}" width="23" height="22" rx="4" fill="${keyHex}" stroke="rgba(0,0,0,.08)"/>`;
    }
    keys += `<rect x="106" y="165" width="160" height="22" rx="4" fill="${keyHex}" stroke="rgba(0,0,0,.08)"/>`;
    return `
<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${id}b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${shade(hex, 0.1)}"/><stop offset="1" stop-color="${shade(hex, -0.12)}"/></linearGradient></defs>
  <ellipse cx="200" cy="208" rx="190" ry="8" fill="rgba(0,0,0,.15)"/>
  <rect x="10" y="16" width="380" height="184" rx="16" fill="url(#${id}b)"/>
  ${keys}
</svg>`;
  }

  /* ---------- Pencil ---------- */
  function pencil(hex) {
    const id = 'a' + ++uid;
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${id}b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="${hex}"/><stop offset="1" stop-color="${shade(hex, -0.18)}"/></linearGradient></defs>
  <ellipse cx="150" cy="262" rx="120" ry="8" fill="rgba(0,0,0,.12)"/>
  <g transform="rotate(-38 150 150)">
    <rect x="20" y="138" width="230" height="24" rx="6" fill="url(#${id}b)"/>
    <path d="M250 138 L284 150 L250 162 Z" fill="${shade(hex, -0.05)}"/>
    <path d="M276 147 L284 150 L276 153 Z" fill="#8e8e93"/>
    <rect x="30" y="138" width="40" height="24" fill="${shade(hex, -0.06)}" opacity=".5"/>
  </g>
</svg>`;
  }

  /* Public API */
  function render(product, opts = {}) {
    const hex = opts.hex || (product.colors && product.colors[0].hex) || '#ccc';
    switch (product.art) {
      case 'laptop': return laptop(hex, product.variant);
      case 'desktop': return desktop(hex);
      case 'tablet': return tablet(hex, product.variant, opts.view === 'back' ? 'back' : 'front');
      case 'watch': return watch(hex, product.variant);
      case 'band': return watch(hex, null, true);
      case 'headset': return headset(hex);
      case 'speaker': return speaker(hex, product.variant);
      case 'tvbox': return tvbox();
      case 'gamepad': return gamepad(hex);
      case 'keyboard': return keyboard(hex);
      case 'pencil': return pencil(hex);
      case 'phone': return opts.view === 'front' ? phoneFront(hex, product.variant) : phoneBack(hex, product.variant);
      case 'buds': return buds(hex);
      case 'headphones': return headphones(hex);
      case 'charger': return charger(hex);
      case 'brick': return brick(hex);
      case 'cable': return cable(hex);
      case 'battery': return battery(hex);
      case 'case': return phoneCase(hex, product.variant);
      case 'tag': return tag(hex);
      default: return '';
    }
  }

  // Two phones, back and front, overlapping — used for hero tiles
  function duo(product, hex) {
    hex = hex || product.colors[0].hex;
    return `<div class="duo"><div class="duo-back">${phoneBack(hex, product.variant)}</div><div class="duo-front">${phoneFront(hex, product.variant)}</div></div>`;
  }

  return { render, duo, phoneBack, phoneFront, shade };
})();
