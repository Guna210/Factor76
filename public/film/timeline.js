/* HyperFrames owns this paused, deterministic timeline. No wall-clock animation. */
(() => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
  // Each scene spans an explicit clip window. GSAP also masks it for simple
  // timeline-only players, so random seeks and CLI rendering look identical.
  tl.set('#next-scene, #city-scene, #brand-scene', { autoAlpha: 0 }, 0);
  tl.fromTo('.fuel-word > span', { y: 570, rotate: 7 }, { y: 0, rotate: 0, duration: 1.18, stagger: 0.085, ease: 'power4.out' }, 0);
  tl.fromTo('.fuel-caption', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3);
  tl.fromTo('.fuel-word i', { scale: 0, rotate: -100 }, { scale: 1, rotate: 20, duration: 1.2, ease: 'back.out(1.2)' }, 0.6);
  tl.fromTo('.orbit-stack', { rotate: -25, x: 130 }, { rotate: 12, x: 0, duration: 3.65, ease: 'none' }, 0);
  tl.to('.fuel-word', { y: -70, duration: 0.6 }, 2.9);
  tl.set('#next-scene', { autoAlpha: 1 }, 3.2);
  // Keep the title and sphere inside the composition throughout the scroll-scrubbed entrance.
  tl.fromTo('.next-left', { xPercent: -6 }, { xPercent: 0, duration: 0.7, ease: 'power4.out' }, 3.2);
  tl.fromTo('.next-right', { xPercent: 4 }, { xPercent: 0, duration: 0.7, ease: 'power4.out' }, 3.2);
  tl.fromTo('.next-word span', { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }, 3.45);
  tl.fromTo('.sphere', { rotateY: -32, rotateZ: -20, scale: 0.6 }, { rotateY: 24, rotateZ: 10, scale: 1, duration: 3.6, ease: 'power2.out' }, 3.2);
  tl.fromTo('.sphere-label', { opacity: 0 }, { opacity: 1, duration: 0.7 }, 4.15);
  tl.set('#fuel-scene', { autoAlpha: 0 }, 3.65);
  tl.set('#city-scene', { autoAlpha: 1 }, 6.4);
  tl.fromTo('#city-scene', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power4.inOut' }, 6.4);
  tl.fromTo('.city-title span', { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power4.out' }, 6.8);
  tl.fromTo('.city-scan', { x: 0 }, { x: 1600, duration: 2.7, ease: 'none' }, 6.8);
  tl.fromTo('.city-grid', { scale: 1.15, rotate: -2 }, { scale: 1, rotate: 0, duration: 4, ease: 'none' }, 6.4);
  tl.fromTo('.location-pin', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' }, 7.7);
  tl.fromTo('.pin-ring-two', { scale: 0.7, opacity: 1 }, { scale: 1.4, opacity: 0, repeat: 2, duration: 0.7, ease: 'power1.out' }, 8.0);
  tl.set('#next-scene', { autoAlpha: 0 }, 6.8);
  tl.set('#brand-scene', { autoAlpha: 1 }, 10);
  tl.fromTo('#brand-scene', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.75, ease: 'power4.inOut' }, 10);
  tl.fromTo('.brand-word', { y: 180, scale: 1.12, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }, 10.35);
  tl.fromTo('.brand-bottom', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 11.2);
  tl.fromTo('.brand-star', { rotate: -80 }, { rotate: 80, duration: 3, ease: 'none' }, 11);
  tl.fromTo('.brand-orbits', { rotate: 15 }, { rotate: 40, duration: 4, ease: 'none' }, 10);
  tl.set('#city-scene', { autoAlpha: 0 }, 10.75);
  tl.to({}, { duration: 0.001 }, 13.999);
  window.__timelines = window.__timelines || {};
  window.__timelines.factor76 = tl;
})();
