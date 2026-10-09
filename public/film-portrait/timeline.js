/* Portrait composition: the same food story is designed to fill a narrow screen. */
(() => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } })
  tl.set("#scene-two, #scene-three, #scene-four", { autoAlpha: 0 }, 0)

  tl.fromTo(".scene-one .film-copy", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "power4.out" }, .12)
  tl.fromTo(".scene-one .scene-photo", { scale: 1.15, yPercent: 1 }, { scale: 1.02, yPercent: -1, duration: 3.5, ease: "none" }, 0)
  tl.fromTo(".orbit-one", { rotation: -35, scale: .82, opacity: 0 }, { rotation: 12, scale: 1, opacity: .75, duration: 2.8, ease: "none" }, .2)

  tl.set("#scene-two", { autoAlpha: 1 }, 3.18)
  tl.fromTo("#scene-two", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: .75, ease: "power4.inOut" }, 3.18)
  tl.fromTo(".scene-two .scene-photo", { scale: 1.15, yPercent: -1 }, { scale: 1.02, yPercent: 1, duration: 3.55, ease: "none" }, 3.2)
  tl.fromTo(".scene-two .film-copy", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .75, ease: "power4.out" }, 3.48)
  tl.fromTo(".orbit-two", { rotation: 38, scale: .75, opacity: 0 }, { rotation: -13, scale: 1, opacity: .72, duration: 3.25, ease: "none" }, 3.3)
  tl.to("#scene-one", { autoAlpha: 0, duration: .22 }, 3.6)

  tl.set("#scene-three", { autoAlpha: 1 }, 6.38)
  tl.fromTo("#scene-three", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .72, ease: "power4.inOut" }, 6.38)
  tl.fromTo(".scene-three .scene-photo", { scale: 1.14, yPercent: 1 }, { scale: 1.02, yPercent: -1, duration: 3.95, ease: "none" }, 6.4)
  tl.fromTo(".scene-three .film-copy", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "power4.out" }, 6.73)
  tl.fromTo(".orbit-three", { rotation: -42, scale: .72, opacity: 0 }, { rotation: 15, scale: 1, opacity: .75, duration: 3.4, ease: "none" }, 6.5)
  tl.to("#scene-two", { autoAlpha: 0, duration: .24 }, 6.85)

  tl.set("#scene-four", { autoAlpha: 1 }, 10.18)
  tl.fromTo("#scene-four", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: .78, ease: "power4.inOut" }, 10.18)
  tl.fromTo(".scene-four .scene-photo", { scale: 1.14, yPercent: -1 }, { scale: 1.02, yPercent: 1, duration: 3.7, ease: "none" }, 10.2)
  tl.fromTo(".closing-brand", { y: 35, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: .85, ease: "power4.out" }, 10.5)
  tl.fromTo(".closing-copy", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: "power3.out" }, 11.35)
  tl.fromTo(".orbit-four", { rotation: -25, scale: .78, opacity: 0 }, { rotation: 18, scale: 1, opacity: .72, duration: 3.5, ease: "none" }, 10.25)
  tl.to("#scene-three", { autoAlpha: 0, duration: .22 }, 10.67)
  tl.to({}, { duration: .001 }, 13.999)

  window.__timelines = window.__timelines || {}
  window.__timelines["factor76-food-film-portrait"] = tl
})();
