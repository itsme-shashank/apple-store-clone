/* Catalogue. Everything the store renders comes from here — edit freely. */
const CATEGORIES = [
  { id: 'all', label: 'All products' },
  { id: 'phones', label: 'Phone' },
  { id: 'book', label: 'Book' },
  { id: 'pad', label: 'Pad' },
  { id: 'watch', label: 'Watch' },
  { id: 'vision', label: 'Vision' },
  { id: 'audio', label: 'Audio' },
  { id: 'home', label: 'Home' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'accessories', label: 'Accessories' }
];

const PHONE_HIGHLIGHTS = {
  pro: [
    { title: 'Grade 5 titanium.', text: 'Our strongest, lightest pro design yet — with a brushed finish that catches the light.' },
    { title: 'H5 Pro chip.', text: 'A 6‑core CPU and 6‑core GPU that make demanding games and pro video feel effortless.' },
    { title: 'Triple 48MP camera system.', text: 'Main, Ultra Wide and a 5x Telephoto that brings the far‑away right into frame.' },
    { title: 'All‑day battery, then some.', text: 'Up to 29 hours of video playback, and 50% charge in around 30 minutes.' }
  ],
  air: [
    { title: 'Impossibly thin.', text: 'Just 5.6 mm, carved from titanium with a polished, mirror‑like edge.' },
    { title: 'H5 chip.', text: 'Pro‑class performance inside our thinnest phone ever.' },
    { title: '48MP Fusion camera.', text: 'One lens that behaves like two, with a crisp 2x optical‑quality zoom.' },
    { title: 'Ceramic Shield 2.', text: 'Front and back glass that is 3x more scratch resistant.' }
  ],
  standard: [
    { title: 'Colour, turned all the way up.', text: 'Colour‑infused glass in five vivid finishes, framed in aerospace‑grade aluminium.' },
    { title: 'H5 chip.', text: 'Fast, efficient and ready for everything you throw at it.' },
    { title: 'Dual 48MP camera.', text: 'Main and Ultra Wide lenses, plus macro shots you can almost feel.' },
    { title: 'Camera Control.', text: 'A tactile button that opens the camera, zooms and captures in one press.' }
  ],
  se: [
    { title: 'Big performance. Small price.', text: 'The H4 chip makes everyday tasks feel instant.' },
    { title: '12MP camera.', text: 'Smart HDR and Portrait mode in a design that fits your pocket.' },
    { title: 'Built to last.', text: 'Water resistant, durable glass and years of software updates.' },
    { title: 'Battery that keeps going.', text: 'Up to 20 hours of video playback.' }
  ]
};

const PRODUCTS = [
  {
    id: 'halo-16-pro', name: 'Halo 16 Pro', category: 'phones', art: 'phone', variant: 'pro', badge: 'New',
    tagline: 'Titanium. Forged in light.',
    blurb: 'The most powerful Halo ever, with a 6.3‑inch LumaVision display and a triple 48MP camera system.',
    price: 119900,
    colors: [
      { name: 'Desert Titanium', hex: '#bfa48f' },
      { name: 'Natural Titanium', hex: '#c2bcb2' },
      { name: 'White Titanium', hex: '#ecebe7' },
      { name: 'Black Titanium', hex: '#3d3d3f' }
    ],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 40000 }],
    specs: [
      ['Display', '6.3″ LumaVision OLED, 120Hz, Always‑On'],
      ['Chip', 'H5 Pro, 6‑core CPU, 6‑core GPU'],
      ['Camera', '48MP Main · 48MP Ultra Wide · 12MP 5x Telephoto'],
      ['Video', '4K 120 fps Dolby Vision'],
      ['Battery', 'Up to 29 hours video playback'],
      ['Build', 'Grade 5 titanium, Ceramic Shield 2'],
      ['Weight', '199 g']
    ]
  },
  {
    id: 'halo-16-pro-max', name: 'Halo 16 Pro Max', category: 'phones', art: 'phone', variant: 'pro', badge: 'New',
    tagline: 'The biggest Halo display. Ever.',
    blurb: 'Everything in Halo 16 Pro, stretched across a 6.9‑inch display with our longest battery life.',
    price: 144900,
    colors: [
      { name: 'Desert Titanium', hex: '#bfa48f' },
      { name: 'Natural Titanium', hex: '#c2bcb2' },
      { name: 'White Titanium', hex: '#ecebe7' },
      { name: 'Black Titanium', hex: '#3d3d3f' }
    ],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 40000 }],
    specs: [
      ['Display', '6.9″ LumaVision OLED, 120Hz, Always‑On'],
      ['Chip', 'H5 Pro, 6‑core CPU, 6‑core GPU'],
      ['Camera', '48MP Main · 48MP Ultra Wide · 12MP 5x Telephoto'],
      ['Video', '4K 120 fps Dolby Vision'],
      ['Battery', 'Up to 33 hours video playback'],
      ['Build', 'Grade 5 titanium, Ceramic Shield 2'],
      ['Weight', '227 g']
    ]
  },
  {
    id: 'halo-16-air', name: 'Halo 16 Air', category: 'phones', art: 'phone', variant: 'air', badge: 'New',
    tagline: 'Thin. Light. Unbelievable.',
    blurb: 'Our thinnest phone ever at 5.6 mm, with pro performance and a 6.5‑inch display.',
    price: 99900,
    colors: [
      { name: 'Sky Blue', hex: '#c6d8e8' },
      { name: 'Light Gold', hex: '#eadcbf' },
      { name: 'Cloud White', hex: '#f1f1ee' },
      { name: 'Space Black', hex: '#2f2f31' }
    ],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 40000 }],
    specs: [
      ['Display', '6.5″ LumaVision OLED, 120Hz'],
      ['Chip', 'H5, 6‑core CPU, 5‑core GPU'],
      ['Camera', '48MP Fusion with 2x optical‑quality zoom'],
      ['Thickness', '5.6 mm'],
      ['Battery', 'Up to 27 hours video playback'],
      ['Build', 'Polished titanium frame'],
      ['Weight', '165 g']
    ]
  },
  {
    id: 'halo-16', name: 'Halo 16', category: 'phones', art: 'phone', variant: 'standard',
    tagline: 'Colour. Bright as ever.',
    blurb: 'Five gorgeous finishes, the H5 chip and a dual 48MP camera system.',
    price: 79900,
    colors: [
      { name: 'Ultramarine', hex: '#7c8cf0' },
      { name: 'Teal', hex: '#8fc7bf' },
      { name: 'Pink', hex: '#f1bfd6' },
      { name: 'White', hex: '#f4f4f2' },
      { name: 'Black', hex: '#323234' }
    ],
    storage: [{ label: '128GB', add: 0 }, { label: '256GB', add: 10000 }, { label: '512GB', add: 30000 }],
    specs: [
      ['Display', '6.1″ LumaVision OLED'],
      ['Chip', 'H5, 6‑core CPU, 5‑core GPU'],
      ['Camera', '48MP Main · 12MP Ultra Wide'],
      ['Video', '4K 60 fps Dolby Vision'],
      ['Battery', 'Up to 22 hours video playback'],
      ['Build', 'Aluminium, colour‑infused glass'],
      ['Weight', '170 g']
    ]
  },
  {
    id: 'halo-se', name: 'Halo SE', category: 'phones', art: 'phone', variant: 'se',
    tagline: 'Serious power. Seriously affordable.',
    blurb: 'The H4 chip, a great camera and a compact design — at our most accessible price.',
    price: 49900,
    colors: [
      { name: 'Midnight', hex: '#2a2d36' },
      { name: 'Starlight', hex: '#efe9dd' },
      { name: 'Red', hex: '#c8232e' }
    ],
    storage: [{ label: '128GB', add: 0 }, { label: '256GB', add: 10000 }],
    specs: [
      ['Display', '6.1″ OLED'],
      ['Chip', 'H4, 6‑core CPU'],
      ['Camera', '12MP Main with Smart HDR'],
      ['Battery', 'Up to 20 hours video playback'],
      ['Build', 'Aluminium and glass'],
      ['Weight', '166 g']
    ]
  },


  /* ---- Book ---- */
  {
    id: 'halo-book-air', name: 'Halo Book Air 13″', category: 'book', art: 'laptop', variant: 'air', badge: 'New',
    tagline: 'Lean. Mean. H5 machine.',
    blurb: 'Strikingly thin, silent and fanless, with up to 18 hours of battery life.',
    price: 114900,
    colors: [
      { name: 'Sky Blue', hex: '#a9c1d9' },
      { name: 'Silver', hex: '#d7d8da' },
      { name: 'Starlight', hex: '#e3dccd' },
      { name: 'Midnight', hex: '#2f3540' }
    ],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 40000 }],
    highlights: [
      { title: 'Just 1.24 kg.', text: 'Light enough to take anywhere, strong enough to do anything.' },
      { title: 'Up to 18 hours.', text: 'Battery life that lasts all day, and then some.' },
      { title: 'Fanless and silent.', text: 'The H5 chip stays cool, so there is nothing to hear.' },
      { title: '13.6″ Liquid display.', text: '500 nits of brightness and a billion colours.' }
    ],
    specs: [['Chip', 'H5, 10‑core CPU, 8‑core GPU'], ['Display', '13.6″ LumaVision LCD, 500 nits'], ['Memory', '16GB unified memory'], ['Battery', 'Up to 18 hours'], ['Ports', '2 × Thunderbolt, MagRing charging, headphone jack'], ['Weight', '1.24 kg']]
  },
  {
    id: 'halo-book-pro', name: 'Halo Book Pro 14″', category: 'book', art: 'laptop', variant: 'pro', badge: 'New',
    tagline: 'A work of power.',
    blurb: 'The H5 Pro chip, a stunning XDR display and up to 24 hours of battery life.',
    price: 169900,
    colors: [{ name: 'Space Black', hex: '#2b2b2e' }, { name: 'Silver', hex: '#d7d8da' }],
    storage: [{ label: '512GB', add: 0 }, { label: '1TB', add: 20000 }, { label: '2TB', add: 60000 }],
    highlights: [
      { title: 'H5 Pro.', text: 'Up to 14 CPU cores and 20 GPU cores for pro workflows.' },
      { title: 'XDR display.', text: '1,600 nits peak HDR brightness and an adaptive 120Hz refresh rate.' },
      { title: 'Up to 24 hours.', text: 'The longest battery life ever in a Halo Book.' },
      { title: 'Every port you need.', text: 'Thunderbolt, HDMI, SDXC and MagRing.' }
    ],
    specs: [['Chip', 'H5 Pro, 14‑core CPU, 20‑core GPU'], ['Display', '14.2″ XDR, 120Hz'], ['Memory', '24GB unified memory'], ['Battery', 'Up to 24 hours'], ['Ports', '3 × Thunderbolt, HDMI, SDXC, MagRing'], ['Weight', '1.55 kg']]
  },
  {
    id: 'halo-studio', name: 'Halo Studio 24″', category: 'book', art: 'desktop',
    tagline: 'Colour, front and centre.',
    blurb: 'An all‑in‑one desktop with a 4.5K display, in seven vibrant colours.',
    price: 134900,
    colors: [
      { name: 'Blue', hex: '#8fb3d9' }, { name: 'Green', hex: '#9fd1b0' }, { name: 'Pink', hex: '#f0b8c6' },
      { name: 'Silver', hex: '#dcdde0' }, { name: 'Yellow', hex: '#f3d77a' }, { name: 'Orange', hex: '#f3a07a' }, { name: 'Purple', hex: '#b9a6dc' }
    ],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 40000 }],
    specs: [['Chip', 'H5, 10‑core CPU'], ['Display', '24″ 4.5K LumaVision'], ['Camera', '12MP auto‑framing'], ['Audio', 'Six‑speaker system'], ['In the box', 'Matching keyboard and mouse']]
  },

  /* ---- Pad ---- */
  {
    id: 'halo-pad-pro', name: 'Halo Pad Pro', category: 'pad', art: 'tablet', variant: 'pro', badge: 'New',
    tagline: 'Thin. Powerful. Pro.',
    blurb: 'Impossibly thin at 5.1 mm, with an Ultra XDR OLED display and the H5 Pro chip.',
    price: 99900,
    colors: [{ name: 'Space Black', hex: '#2d2d30' }, { name: 'Silver', hex: '#d7d8da' }],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 60000 }],
    highlights: [
      { title: 'Ultra XDR OLED.', text: 'Tandem OLED for extreme brightness and perfect blacks.' },
      { title: '5.1 mm thin.', text: 'Our thinnest product ever.' },
      { title: 'Works with Halo Pencil Pro.', text: 'Squeeze, barrel‑roll and hover for a whole new way to create.' },
      { title: 'H5 Pro chip.', text: 'Desktop‑class performance in your hands.' }
    ],
    specs: [['Display', '11″ Ultra XDR tandem OLED'], ['Chip', 'H5 Pro'], ['Camera', '12MP Wide with LiDAR'], ['Thickness', '5.1 mm'], ['Connector', 'Thunderbolt / USB 4'], ['Weight', '444 g']]
  },
  {
    id: 'halo-pad-air', name: 'Halo Pad Air', category: 'pad', art: 'tablet', variant: 'air',
    tagline: 'Two sizes. Fresh air.',
    blurb: 'Serious performance in a thin, light design — in four beautiful finishes.',
    price: 59900,
    colors: [{ name: 'Blue', hex: '#a9c3df' }, { name: 'Purple', hex: '#c7b8de' }, { name: 'Starlight', hex: '#e8e1d2' }, { name: 'Space Grey', hex: '#5a5b60' }],
    storage: [{ label: '128GB', add: 0 }, { label: '256GB', add: 10000 }, { label: '512GB', add: 30000 }],
    specs: [['Display', '11″ LumaVision LCD'], ['Chip', 'H4'], ['Camera', '12MP Wide'], ['Pencil', 'Halo Pencil Pro'], ['Weight', '462 g']]
  },
  {
    id: 'halo-pad-mini', name: 'Halo Pad mini', category: 'pad', art: 'tablet', variant: 'mini',
    tagline: 'Big power. Small size.',
    blurb: 'An 8.3‑inch display that fits in one hand — and in almost any bag.',
    price: 49900,
    colors: [{ name: 'Blue', hex: '#a9c3df' }, { name: 'Purple', hex: '#c7b8de' }, { name: 'Starlight', hex: '#e8e1d2' }, { name: 'Space Grey', hex: '#5a5b60' }],
    storage: [{ label: '128GB', add: 0 }, { label: '256GB', add: 10000 }],
    specs: [['Display', '8.3″ LumaVision LCD'], ['Chip', 'H4'], ['Camera', '12MP Wide'], ['Weight', '293 g']]
  },

  /* ---- Watch ---- */
  {
    id: 'halo-watch-s2', name: 'Halo Watch Series 2', category: 'watch', art: 'watch', badge: 'New',
    tagline: 'Thin. Bright. Brilliant.',
    blurb: 'Our thinnest watch with our biggest display, plus sleep apnoea notifications.',
    price: 46900,
    colors: [{ name: 'Jet Black', hex: '#2a2a2c' }, { name: 'Rose Gold', hex: '#e8c4b8' }, { name: 'Silver', hex: '#d9d9de' }],
    options: [{ label: '42mm', add: 0 }, { label: '46mm', add: 3000 }],
    optTitle: 'Case size. <span>Which fits your wrist?</span>',
    highlights: [
      { title: 'Biggest display yet.', text: 'A wide‑angle OLED that is easier to read at a glance.' },
      { title: 'Thinnest Halo Watch.', text: 'Just 9.7 mm, and comfortable all day and night.' },
      { title: 'Health insights.', text: 'ECG, blood oxygen, sleep apnoea and Vitals tracking.' },
      { title: 'Fast charging.', text: '80% in about 30 minutes.' }
    ],
    specs: [['Display', 'Always‑On wide‑angle OLED'], ['Case', 'Aluminium'], ['Health', 'ECG, blood oxygen, temperature, sleep'], ['Battery', 'Up to 18 hours'], ['Water', 'Water resistant 50 m']]
  },
  {
    id: 'halo-watch-ultra', name: 'Halo Watch Ultra', category: 'watch', art: 'watch', variant: 'ultra',
    tagline: 'Built for the extremes.',
    blurb: 'A 49 mm titanium case, precision dual‑frequency GPS and up to 36 hours of battery.',
    price: 89900,
    colors: [{ name: 'Natural Titanium', hex: '#c8c3ba' }, { name: 'Black Titanium', hex: '#3a3a3c' }],
    specs: [['Case', '49 mm titanium'], ['Display', 'Up to 3,000 nits'], ['GPS', 'Precision dual‑frequency'], ['Battery', 'Up to 36 hours'], ['Water', 'Rated to 100 m, dive to 40 m']]
  },
  {
    id: 'halo-watch-se', name: 'Halo Watch SE', category: 'watch', art: 'watch', variant: 'se',
    tagline: 'A great deal to love.',
    blurb: 'All the essentials to stay active, healthy and connected.',
    price: 25900,
    colors: [{ name: 'Midnight', hex: '#2f333d' }, { name: 'Starlight', hex: '#e6dfd0' }, { name: 'Silver', hex: '#d9d9de' }],
    options: [{ label: '40mm', add: 0 }, { label: '44mm', add: 3000 }],
    optTitle: 'Case size. <span>Which fits your wrist?</span>',
    specs: [['Display', 'LumaVision OLED'], ['Safety', 'Crash and fall detection'], ['Battery', 'Up to 18 hours'], ['Water', 'Water resistant 50 m']]
  },

  /* ---- Vision ---- */
  {
    id: 'halo-vision-pro', name: 'Halo Vision Pro', category: 'vision', art: 'headset', badge: 'New',
    tagline: 'Step into spatial computing.',
    blurb: 'Blend digital content with your physical space, and navigate with your eyes, hands and voice.',
    price: 349900,
    colors: [{ name: 'Silver', hex: '#c9cacd' }],
    storage: [{ label: '256GB', add: 0 }, { label: '512GB', add: 20000 }, { label: '1TB', add: 40000 }],
    highlights: [
      { title: 'An infinite canvas.', text: 'Apps live in your space, at any size you like.' },
      { title: '23 million pixels.', text: 'Micro‑OLED displays with more pixels than a 4K TV for each eye.' },
      { title: 'Spatial photos and videos.', text: 'Relive memories as if you were there.' },
      { title: 'Eyes, hands and voice.', text: 'No controllers. Just look, tap your fingers and speak.' }
    ],
    specs: [['Displays', 'Dual micro‑OLED, 23 million pixels'], ['Chips', 'H5 + R1'], ['Input', 'Eyes, hands and voice'], ['Battery', 'Up to 2.5 hours'], ['Weight', '600–650 g']]
  },

  /* ---- Audio ---- */
  {
    id: 'halo-buds-pro', name: 'Halo Buds Pro 3', category: 'audio', art: 'buds', badge: 'New',
    tagline: 'Silence, perfected.',
    blurb: 'Up to 2x more Active Noise Cancellation, heart‑rate sensing and Adaptive Audio.',
    price: 24900, colors: [{ name: 'White', hex: '#f5f5f3' }],
    specs: [['Noise cancellation', 'Active, with Adaptive Audio'], ['Battery', 'Up to 8 hrs (30 hrs with case)'], ['Charging', 'USB‑C and MagRing'], ['Resistance', 'IP57 dust, sweat and water']]
  },
  {
    id: 'halo-buds-4', name: 'Halo Buds 4', category: 'audio', art: 'buds',
    tagline: 'Open fit. Big sound.',
    blurb: 'A redesigned open fit, personalised spatial audio and a 30‑hour battery.',
    price: 12900, colors: [{ name: 'White', hex: '#f5f5f3' }],
    specs: [['Fit', 'Open‑ear, redesigned'], ['Battery', 'Up to 5 hrs (30 hrs with case)'], ['Charging', 'USB‑C'], ['Resistance', 'IP54']]
  },
  {
    id: 'halo-pods-max', name: 'Halo Pods Max', category: 'audio', art: 'headphones',
    tagline: 'Immersive, over‑ear sound.',
    blurb: 'High‑fidelity audio, computational noise cancellation and a breathable knit canopy.',
    price: 59900,
    colors: [
      { name: 'Midnight', hex: '#3a3d47' },
      { name: 'Starlight', hex: '#e9e3d6' },
      { name: 'Blue', hex: '#8ea9c9' },
      { name: 'Orange', hex: '#f0a77c' },
      { name: 'Purple', hex: '#b9a7d6' }
    ],
    specs: [['Drivers', '40 mm dynamic'], ['Battery', 'Up to 20 hours'], ['Charging', 'USB‑C'], ['Weight', '385 g']]
  },
  /* ---- Home ---- */
  {
    id: 'halo-sphere', name: 'Halo Sphere', category: 'home', art: 'speaker',
    tagline: 'Sound that fills the room.',
    blurb: 'Room‑filling computational audio and a smart home hub, all in one.',
    price: 32900,
    colors: [{ name: 'Midnight', hex: '#3b3d45' }, { name: 'White', hex: '#ececec' }],
    specs: [['Audio', 'High‑excursion woofer, 5 tweeters'], ['Smart home', 'Built‑in hub, Matter and Thread'], ['Sensors', 'Temperature and humidity'], ['Height', '168 mm']]
  },
  {
    id: 'halo-sphere-mini', name: 'Halo Sphere mini', category: 'home', art: 'speaker', variant: 'mini',
    tagline: 'Surprising sound for its size.',
    blurb: '360‑degree audio in a compact design, in five bold colours.',
    price: 10900,
    colors: [{ name: 'White', hex: '#efefef' }, { name: 'Yellow', hex: '#f4d36b' }, { name: 'Orange', hex: '#f39a5b' }, { name: 'Blue', hex: '#6d8ec9' }, { name: 'Space Grey', hex: '#4a4b50' }],
    specs: [['Audio', 'Full‑range driver, 360° sound'], ['Smart home', 'Built‑in hub'], ['Height', '84 mm']]
  },

  /* ---- Entertainment ---- */
  {
    id: 'halo-tv-4k', name: 'Halo TV 4K', category: 'entertainment', art: 'tvbox',
    tagline: 'The Halo experience. Cinematic in every sense.',
    blurb: 'Stream in 4K HDR with Dolby Atmos sound, and control it all with the new new voice remote.',
    price: 14900, colors: [{ name: 'Black', hex: '#1c1c1e' }],
    options: [{ label: 'Wi‑Fi · 64GB', add: 0 }, { label: 'Wi‑Fi + Ethernet · 128GB', add: 2000 }],
    optTitle: 'Model. <span>Which one is right for you?</span>',
    specs: [['Video', '4K HDR, Dolby Vision, HDR10+'], ['Audio', 'Dolby Atmos'], ['Chip', 'H4'], ['Remote', 'Touch clickpad, USB‑C']]
  },
  {
    id: 'halo-gamepad', name: 'Halo Gamepad', category: 'entertainment', art: 'gamepad',
    tagline: 'Play on every screen.',
    blurb: 'A wireless controller for Halo TV, Halo Pad, Halo Book and your phone.',
    price: 6900,
    colors: [{ name: 'Midnight', hex: '#2f3138' }, { name: 'Coral', hex: '#f08a7a' }, { name: 'Mint', hex: '#9ed6c0' }],
    specs: [['Connectivity', 'Bluetooth 5.3'], ['Battery', 'Up to 40 hours'], ['Charging', 'USB‑C']]
  },

  /* ---- Accessories ---- */
  {
    id: 'halo-pencil-pro', name: 'Halo Pencil Pro', category: 'accessories', art: 'pencil', badge: 'New',
    tagline: 'Squeeze, roll and create.',
    blurb: 'Pixel‑perfect precision with squeeze, barrel roll and haptic feedback.',
    price: 11900, colors: [{ name: 'White', hex: '#f4f4f4' }],
    specs: [['Works with', 'Halo Pad Pro, Halo Pad Air, Halo Pad mini'], ['Features', 'Squeeze, barrel roll, hover, haptics'], ['Pairing', 'Magnetic attach and charge']]
  },
  {
    id: 'halo-keyboard', name: 'Halo Keyboard', category: 'accessories', art: 'keyboard',
    tagline: 'Unlock with a touch.',
    blurb: 'A wireless, rechargeable keyboard with a built‑in fingerprint sensor.',
    price: 9900, colors: [{ name: 'White', hex: '#e9e9ec' }, { name: 'Black', hex: '#2b2b2e' }],
    specs: [['Connectivity', 'Bluetooth, USB‑C'], ['Battery', 'About a month per charge'], ['Works with', 'Halo Book, Halo Studio, Halo Pad']]
  },
  {
    id: 'sport-loop', name: 'Sport Loop Band', category: 'accessories', art: 'band',
    tagline: 'Soft, breathable, adjustable.',
    blurb: 'A double‑layer nylon weave with a hook‑and‑loop fastener. Fits all Halo Watch models.',
    price: 4900,
    colors: [{ name: 'Lake Green', hex: '#6f9a8d' }, { name: 'Plum', hex: '#8a4f74' }, { name: 'Ultramarine', hex: '#5367c9' }, { name: 'Orange', hex: '#f08a4b' }, { name: 'Black', hex: '#2b2b2e' }],
    options: [{ label: '42mm', add: 0 }, { label: '46mm', add: 0 }],
    optTitle: 'Band size. <span>Match your case.</span>',
    specs: [['Material', 'Double‑layer nylon weave'], ['Fits', 'Halo Watch 40–46 mm']]
  },
  {
    id: 'magring-charger', name: 'MagRing Charger', category: 'accessories', art: 'charger',
    tagline: 'Snap. Charge. Go.',
    blurb: 'Perfectly aligned magnets deliver up to 25W of fast wireless charging.',
    price: 4500, colors: [{ name: 'White', hex: '#f4f4f4' }],
    specs: [['Output', 'Up to 25W'], ['Cable', '1 m woven USB‑C'], ['Compatibility', 'All Halo 13 and later']]
  },
  {
    id: 'dual-charger-35w', name: '35W Dual USB‑C Adapter', category: 'accessories', art: 'brick',
    tagline: 'Two devices. One plug.',
    blurb: 'Charge your phone and buds at the same time with intelligent power sharing.',
    price: 5800, colors: [{ name: 'White', hex: '#f4f4f4' }],
    specs: [['Output', '35W total'], ['Ports', '2 × USB‑C'], ['Plug', 'Type D (India)']]
  },
  {
    id: 'woven-cable', name: 'USB‑C Woven Cable (1 m)', category: 'accessories', art: 'cable',
    tagline: 'Braided to last.',
    blurb: 'A woven design that resists tangles and supports up to 60W charging.',
    price: 1900,
    colors: [
      { name: 'White', hex: '#efefed' },
      { name: 'Black', hex: '#2c2c2e' },
      { name: 'Ultramarine', hex: '#7c8cf0' },
      { name: 'Orange', hex: '#f39a5b' }
    ],
    specs: [['Length', '1 m'], ['Power', 'Up to 60W'], ['Data', 'USB 2 speeds']]
  },
  {
    id: 'powerpod', name: 'PowerPod Battery', category: 'accessories', art: 'battery',
    tagline: 'More battery. Zero cables.',
    blurb: 'A slim magnetic battery that snaps onto the back of your Halo.',
    price: 9900,
    colors: [
      { name: 'Sage', hex: '#b3c2a8' },
      { name: 'Clay', hex: '#d4a58b' },
      { name: 'Graphite', hex: '#3a3a3c' }
    ],
    specs: [['Capacity', '5,000 mAh'], ['Output', '15W wireless'], ['Thickness', '9.8 mm']]
  },
  {
    id: 'silicone-case', name: 'Silicone Case with MagRing', category: 'accessories', art: 'case', badge: 'New',
    tagline: 'Soft to the touch. Built to protect.',
    blurb: 'A silky, soft‑touch finish with a microfibre lining. Fits Halo 16 Pro.',
    price: 4900,
    colors: [
      { name: 'Lake Green', hex: '#6f9a8d' },
      { name: 'Plum', hex: '#7a4a68' },
      { name: 'Star Fruit', hex: '#e8d36a' },
      { name: 'Denim', hex: '#4c6b97' },
      { name: 'Black', hex: '#2b2b2d' }
    ],
    specs: [['Fits', 'Halo 16 Pro'], ['Material', 'Silicone, microfibre lining'], ['MagRing', 'Yes']]
  },
  {
    id: 'clear-case', name: 'Clear Case with MagRing', category: 'accessories', art: 'case', variant: 'clear',
    tagline: 'Show off the finish.',
    blurb: 'Optically clear polycarbonate that will not yellow, with a MagRing alignment ring.',
    price: 4900, colors: [{ name: 'Clear', hex: '#dfe6ee' }],
    specs: [['Fits', 'Halo 16 Pro'], ['Material', 'Polycarbonate & TPU'], ['MagRing', 'Yes']]
  },
  {
    id: 'halo-tag', name: 'Halo Tag', category: 'accessories', art: 'tag',
    tagline: 'Lose your knack for losing things.',
    blurb: 'Attach it to your keys or bag and find them with Precision Finding.',
    price: 3490,
    colors: [{ name: 'Silver', hex: '#e6e6e8' }],
    options: [{ label: '1 pack', add: 0 }, { label: '4 pack', add: 8410 }],
    optTitle: 'Pack size. <span>One for your keys, or four for everything.</span>',
    specs: [['Battery', 'Replaceable, 1 year+'], ['Resistance', 'IP67'], ['Finding', 'Ultra Wideband Precision Finding']]
  }
];

const getProduct = id => PRODUCTS.find(p => p.id === id);

// The product that represents each category in category strips
const CATEGORY_ICON = {
  phones: 'halo-16-pro', book: 'halo-book-air', pad: 'halo-pad-air', watch: 'halo-watch-s2', vision: 'halo-vision-pro',
  audio: 'halo-buds-pro', home: 'halo-sphere-mini', entertainment: 'halo-tv-4k', accessories: 'magring-charger'
};

/* ---------------- Buy-flow extras ---------------- */
// Halo Care+ (accident cover) price by category; categories not listed don't offer it
const CARE_PLANS = { phones: 14900, book: 19900, pad: 8900, watch: 6900, vision: 29900, audio: 2900, home: 1900, entertainment: 1500 };

// Categories that can take a trade-in, and what we pay for each device
const TRADE_IN_CATEGORIES = ['phones', 'pad', 'watch', 'book'];
const TRADE_IN = [
  { name: 'Halo 15 Pro / Pro Max', credit: 52000 },
  { name: 'Halo 15', credit: 34000 },
  { name: 'Halo 14 Pro', credit: 36000 },
  { name: 'Halo 14', credit: 24000 },
  { name: 'Halo 13 or earlier', credit: 12000 },
  { name: 'Other smartphone', credit: 6000 }
];

// Free engraving is offered on these
const ENGRAVABLE = ['halo-buds-pro', 'halo-buds-4', 'halo-tag', 'halo-pencil-pro'];

/* ---------------- Global nav flyouts: "More from …" links, each with its own destination ---------------- */
const NAV_MORE = {
  phones: [['support.html#phones', 'Phone Support'], ['support.html#care', 'Halo Care+ for Phone'], ['support.html#tradein', 'Trade in your phone']],
  book: [['support.html#book', 'Book Support'], ['support.html#care', 'Halo Care+ for Book'], ['support.html#education', 'Book for students']],
  pad: [['support.html#pad', 'Pad Support'], ['support.html#care', 'Halo Care+ for Pad'], ['support.html#education', 'Pad for education']],
  watch: [['support.html#watch', 'Watch Support'], ['support.html#care', 'Halo Care+ for Watch'], ['product.html?id=halo-watch-s2#highlights', 'Health on Watch']],
  vision: [['support.html#vision', 'Vision Support'], ['support.html#vision', 'Book a demo'], ['product.html?id=halo-vision-pro#highlights', 'Spatial apps']],
  audio: [['support.html#audio', 'Audio Support'], ['support.html#care', 'Halo Care+ for Audio'], ['product.html?id=halo-buds-pro#buy', 'Free engraving']],
  home: [['support.html#audio', 'Home Support'], ['support.html#audio', 'Smart home setup'], ['support.html#care', 'Halo Care+ for Home']],
  entertainment: [['entertainment.html#tv', 'Halo TV+'], ['entertainment.html#music', 'Halo Music'], ['entertainment.html#arcade', 'Halo Arcade'], ['support.html#entertainment', 'Entertainment Support']],
  accessories: [['support.html#accessories', 'Accessories Support'], ['product.html?id=halo-pencil-pro#buy', 'Free engraving'], ['support.html#gifts', 'Gift cards']]
};

/* ---------------- Entertainment carousel (made-up shows) ---------------- */
const SHOWS = [
  { title: 'Low Orbit', genre: 'Sci‑Fi', line: 'Six astronauts. One way home.', a: '#0b1e3f', b: '#e86a33', font: 'display' },
  { title: 'The Lantern Room', genre: 'Thriller', line: 'Every light hides a secret.', a: '#1a1208', b: '#f2b84b', font: 'serif' },
  { title: 'Monsoon Season', genre: 'Drama', line: 'A family. A storm. A reckoning.', a: '#0e2a2a', b: '#5fc3b0', font: 'serif' },
  { title: 'Ninth Inning', genre: 'Comedy', line: 'The worst team in the league is back.', a: '#2a0f2e', b: '#ff6f91', font: 'display' },
  { title: 'Glasshouse', genre: 'Mystery', line: 'Nothing stays hidden for long.', a: '#101418', b: '#9fb4c7', font: 'serif' },
  { title: 'Saltwater Kings', genre: 'Documentary', line: 'Life at the edge of the ocean.', a: '#06222e', b: '#3aa0d8', font: 'display' }
];

/* ---------------- Store: "The latest" shelf ---------------- */
const LATEST = [
  { id: 'halo-16-pro', eyebrow: 'New', title: 'Halo 16 Pro', text: 'Titanium. Forged in light.', theme: 'dark', hex: '#bfa48f' },
  { id: 'halo-book-air', eyebrow: 'New', title: 'Halo Book Air', text: 'Lean. Mean. H5 machine.', hex: '#a9c1d9' },
  { id: 'halo-watch-s2', eyebrow: 'New', title: 'Halo Watch Series 2', text: 'Thin. Bright. Brilliant.', theme: 'dark', hex: '#e8c4b8' },
  { id: 'halo-pad-pro', eyebrow: 'New', title: 'Halo Pad Pro', text: 'Thin. Powerful. Pro.', hex: '#2d2d30' },
  { id: 'halo-vision-pro', eyebrow: 'New', title: 'Halo Vision Pro', text: 'Book an in‑store demo.', theme: 'dark' },
  { id: 'halo-buds-pro', eyebrow: 'Free engraving', title: 'Halo Buds Pro 3', text: 'Make them yours with a name or emoji.' }
];

/* ---------------- Entertainment page: Halo Music and Halo Arcade (made-up titles) ---------------- */
const ALBUMS = [
  { title: 'Night Bus Home', artist: 'Mira Vale', kind: 'Album', a: '#2b1055', b: '#d53369' },
  { title: 'Chai & Rain', artist: 'Lofi Room', kind: 'Playlist', a: '#3a2618', b: '#e0a96d' },
  { title: 'Monsoon Season (Score)', artist: 'Arun Dev', kind: 'Soundtrack', a: '#0e2a2a', b: '#5fc3b0' },
  { title: 'Glass Cities', artist: 'Northlight', kind: 'Album', a: '#101418', b: '#9fb4c7' },
  { title: 'Morning Run', artist: 'Halo Music', kind: 'Playlist', a: '#1f3b08', b: '#b6e35a' },
  { title: 'Golden Hour', artist: 'Sana & the Tides', kind: 'Album', a: '#40210f', b: '#f2b84b' }
];
const GAMES = [
  { title: 'Paper Comets', genre: 'Arcade', line: 'Fold, fling and chase the stars.', a: '#0b1e3f', b: '#e86a33' },
  { title: 'Tidepool', genre: 'Puzzle', line: 'Calm puzzles that ebb and flow.', a: '#06222e', b: '#3aa0d8' },
  { title: 'Rickshaw Rally', genre: 'Racing', line: 'Race through monsoon streets.', a: '#2a0f2e', b: '#ff6f91' },
  { title: 'Lantern Keep', genre: 'Adventure', line: 'Light the way through a sleeping castle.', a: '#1a1208', b: '#f2b84b' }
];
