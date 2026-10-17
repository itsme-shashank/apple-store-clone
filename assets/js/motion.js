/*
 * Motion primitives, after Apple's "Designing Fluid Interfaces".
 * - Springs are described by dampingRatio + response (seconds), not mass/stiffness.
 * - Every spring starts from the current value and accepts an initial velocity,
 *   so animations are interruptible and inherit the gesture's momentum.
 */
const Motion = (() => {
  const mq = q => window.matchMedia && window.matchMedia(q).matches;
  const reducedMotion = () => mq('(prefers-reduced-motion: reduce)');

  function spring({ from, to, velocity = 0, damping = 1, response = 0.4, onUpdate, onComplete }) {
    const stiffness = Math.pow((2 * Math.PI) / response, 2);
    const friction = (4 * Math.PI * damping) / response;
    let x = from, v = velocity, raf = 0, last = performance.now(), running = true;

    if (reducedMotion()) {
      onUpdate(to);
      onComplete && onComplete();
      return { stop() {}, get value() { return to; }, get velocity() { return 0; }, get running() { return false; } };
    }

    function step(now) {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;
      const n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n;
      for (let i = 0; i < n; i++) {
        const a = -stiffness * (x - to) - friction * v;
        v += a * h;
        x += v * h;
      }
      if (Math.abs(v) < 2 && Math.abs(x - to) < 0.3) {
        x = to; v = 0; running = false;
        onUpdate(x);
        onComplete && onComplete();
        return;
      }
      onUpdate(x);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    return {
      stop() { cancelAnimationFrame(raf); running = false; },
      get value() { return x; },
      get velocity() { return v; },
      get running() { return running; }
    };
  }

  // Apple's projection: where would momentum carry this if left alone?
  function project(velocity, decelerationRate = 0.998) {
    return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
  }

  // Progressive resistance past a boundary
  function rubberband(overshoot, dimension, constant = 0.55) {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  }

  // Short position history -> release velocity in px/s
  function tracker() {
    let samples = [];
    return {
      reset() { samples = []; },
      push(x) {
        const t = performance.now();
        samples.push({ x, t });
        while (samples.length > 2 && t - samples[0].t > 100) samples.shift();
      },
      velocity() {
        if (samples.length < 2) return 0;
        const a = samples[0], b = samples[samples.length - 1];
        const dt = (b.t - a.t) / 1000;
        return dt > 0 ? (b.x - a.x) / dt : 0;
      }
    };
  }

  /*
   * Horizontal drag helper with ~10px hysteresis so vertical scrolling still works.
   * Calls onStart() once the gesture is clearly horizontal, onMove(dx) 1:1 with the pointer,
   * onEnd(velocity) on release.
   */
  function hDrag(el, { onStart, onMove, onEnd, ignore = 'a,button,input,select,textarea,label' }) {
    let id = null, x0 = 0, y0 = 0, state = 'idle';
    const track = tracker();

    el.addEventListener('pointerdown', e => {
      if (e.button !== 0 || (ignore && e.target.closest(ignore))) return;
      id = e.pointerId; x0 = e.clientX; y0 = e.clientY; state = 'pending';
      track.reset(); track.push(e.clientX);
    });
    el.addEventListener('pointermove', e => {
      if (e.pointerId !== id || state === 'idle') return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (state === 'pending') {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { state = 'idle'; return; }
        if (Math.abs(dx) < 10) return;
        state = 'dragging';
        x0 = e.clientX; // start tracking from here so there's no jump past the threshold
        el.setPointerCapture(id);
        el.classList.add('is-dragging');
        onStart && onStart();
      }
      track.push(e.clientX);
      onMove(e.clientX - x0);
    });
    const end = e => {
      if (e.pointerId !== id) return;
      if (state === 'dragging') {
        el.classList.remove('is-dragging');
        el.classList.add('was-dragged');
        setTimeout(() => el.classList.remove('was-dragged'), 0);
        onEnd(e.type === 'pointercancel' ? 0 : track.velocity());
      }
      state = 'idle'; id = null;
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    // Swallow the click that follows a real drag
    el.addEventListener('click', e => { if (el.classList.contains('was-dragged')) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  return { spring, project, rubberband, tracker, hDrag, reducedMotion };
})();
