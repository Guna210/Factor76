/* Portrait cut: a separate 9:16 timeline composed for phone screens. */
(() => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
  tl.set('#next-scene, #city-scene, #brand-scene', { autoAlpha: 0 }, 0);

  tl.fromTo('.fuel-word span', { y: 500, rotate: 7, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.05, stagger: 0.12, ease: 'power4.out' }, 0);
  tl.fromTo('.fuel-orbit', { scale: 0.62, rotate: -38, x: 45 }, { scale: 1, rotate: 22, x: 0, duration: 3.65, ease: 'none' }, 0);
  tl.fromTo('.fuel-kicker', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 0.35);
  tl.to('.fuel-word', { y: -50, duration: 0.55 }, 2.9);

  tl.set('#next-scene', { autoAlpha: 1 }, 3.2);
  tl.fromTo('#next-scene', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.65, ease: 'power4.inOut' }, 3.2);
  tl.fromTo('.next-word span', { y: 110, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, stagger: 0.1, ease: 'power4.out' }, 3.4);
  tl.fromTo('.next-orbit', { scale: 0.58, rotate: -35 }, { scale: 1, rotate: 20, duration: 3.6, ease: 'power2.out' }, 3.2);
  tl.fromTo('.sphere-76', { scale: 0.42, rotate: -32, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: 'back.out(1.4)' }, 3.95);
  tl.set('#fuel-scene', { autoAlpha: 0 }, 3.65);

  tl.set('#city-scene', { autoAlpha: 1 }, 6.4);
  tl.fromTo('#city-scene', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power4.inOut' }, 6.4);
  tl.fromTo('.city-title span', { y: 130, opacity: 0 }, { y: 0, opacity: 1, duration: 0.82, stagger: 0.12, ease: 'power4.out' }, 6.75);
  tl.fromTo('.city-grid', { scale: 1.15, rotate: -3 }, { scale: 1, rotate: 0, duration: 4, ease: 'none' }, 6.4);
  tl.fromTo('.location-pin', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' }, 7.7);
  tl.fromTo('.pin-ring-two', { scale: 0.7, opacity: 1 }, { scale: 1.4, opacity: 0, repeat: 2, duration: 0.7, ease: 'power1.out' }, 8.0);
  tl.set('#next-scene', { autoAlpha: 0 }, 6.8);

  tl.set('#brand-scene', { autoAlpha: 1 }, 10);
  tl.fromTo('#brand-scene', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'power4.inOut' }, 10);
  tl.fromTo('.brand-word', { y: 150, scale: 1.08, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }, 10.35);
  tl.fromTo('.brand-copy', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 11.2);
  tl.fromTo('.brand-orbits', { rotate: 12 }, { rotate: 38, duration: 4, ease: 'none' }, 10);
  tl.set('#city-scene', { autoAlpha: 0 }, 10.75);
  tl.to({}, { duration: 0.001 }, 13.999);

  window.__timelines = window.__timelines || {};
  window.__timelines.factor76 = tl;
})();
