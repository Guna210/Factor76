import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, Crosshair, Maximize2, Minus, Pause, Play, Plus, RotateCcw, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import BoxBuilder from './components/BoxBuilder'

const HeroScene = lazy(() => import('./components/HeroScene'))
const LaunchFilm = lazy(() => import('./components/LaunchFilm'))
gsap.registerPlugin(ScrollTrigger)

const concepts = [
  { number: '01', name: 'THE FIRESTARTER', subtitle: 'Black pepper chicken · red rice · roasted greens', category: 'HIGH PROTEIN', type: 'Protein', energy: '580', protein: '42', color: '#f34e20', shape: 'ribbon' },
  { number: '02', name: 'GREEN FREQUENCY', subtitle: 'Roast pumpkin · chickpeas · herby rice', category: 'PLANT POWERED', type: 'Plant', energy: '490', protein: '22', color: '#c1cd71', shape: 'sphere' },
  { number: '03', name: 'ISLAND CURRENT', subtitle: 'Curry-leaf fish · lime rice · sautéed beans', category: 'HIGH PROTEIN', type: 'Protein', energy: '520', protein: '36', color: '#beb2de', shape: 'wave' },
]

const faqs = [
  ['What exactly is Factor76?', 'A concept for chef-prepared meals delivered to your door in Colombo. This is a private design prototype: the meals, prices, and nutrition figures are illustrative, and no orders are being accepted.'],
  ['Where would you deliver?', 'The initial service area is Colombo city limits. The map is an artistic representation of that proposed area, not a live delivery eligibility checker.'],
  ['Can I try building a box?', 'Absolutely. Choose 4, 6, or 8 meals, mix your favourites, and review your sample box. Your selection is saved only in this browser. No payment, subscription, or order is created.'],
  ['What about allergies and dietary needs?', 'The sample menu helps demonstrate how dietary preferences could work. Ingredients, nutritional values, and allergen information will need to be verified before a real launch. Please do not use this prototype to make dietary decisions.'],
]

function App() {
  const [boxOpen, setBoxOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [exploded, setExploded] = useState(false)
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [filter, setFilter] = useState('All')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [selectedMeal, setSelectedMeal] = useState<(typeof concepts)[number] | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const detailDialog = useRef<HTMLDialogElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const filmSection = useRef<HTMLElement>(null)
  const [filmVisible, setFilmVisible] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotion(!media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'full' : 'reduced'
    if (!motion) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -90 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    const context = gsap.context(() => {
      gsap.fromTo('.hero-title .line-inner', { yPercent: 110, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.2, stagger: .12, ease: 'power4.out', delay: .15 })
      gsap.fromTo('.hero-intro, .hero-description, .hero-actions, .hero-footer', { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: .09, duration: .9, delay: .6, ease: 'power2.out' })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: .12, y: 60 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 91%', once: true } })
      })
      gsap.to('.manifesto-word', { backgroundPositionX: '0%', stagger: .15, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 65%', scrub: 1 } })
      gsap.to('.manifesto-asterisk', { rotation: 180, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      gsap.to('.flow-line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.ritual-grid', start: 'top 80%', end: 'bottom 60%', scrub: 1 } })
      gsap.to('.closing-word', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom top', scrub: 1 } })
    }, root)
    return () => { context.revert(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [motion])

  useEffect(() => {
    const node = filmSection.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setFilmVisible(true); observer.disconnect() }
    }, { rootMargin: '500px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [filter, filmVisible])

  useEffect(() => {
    if (!motion || window.matchMedia('(pointer: coarse)').matches) return
    const move = (event: PointerEvent) => {
      if (!cursor.current) return
      cursor.current.style.opacity = '1'
      cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      const target = event.target as HTMLElement
      cursor.current.classList.toggle('is-interactive', !!target.closest('button, a, summary, input'))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [motion])

  useEffect(() => {
    if (selectedMeal) detailDialog.current?.showModal()
    else detailDialog.current?.close()
  }, [selectedMeal])

  const openBox = () => { detailDialog.current?.close(); setSelectedMeal(null); setMenuOpen(false); setBoxOpen(true) }
  const goTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: motion ? 'smooth' : 'instant' })
  }

  return <div ref={root} className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="custom-cursor" ref={cursor} aria-hidden="true" />
    <header className="site-header">
      <a href="#" className="wordmark" aria-label="Factor76 home">factor<span>76</span><span className="wordmark-dot">✳</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#philosophy">The philosophy</a><a href="#menu">The menu <span>↗</span></a><a href="#ritual">The ritual</a>
      </nav>
      <div className="header-actions">
        <span className="demo-badge"><i /> PRIVATE DEMO</span>
        <button className="header-cta" onClick={openBox}>Build your box <ArrowUpRight size={16} /></button>
        <button className="mobile-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <><span /><span /></>}</button>
      </div>
    </header>
    {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><button onClick={() => goTo('philosophy')}>The philosophy <ArrowUpRight /></button><button onClick={() => goTo('menu')}>The menu <ArrowUpRight /></button><button onClick={() => goTo('ritual')}>The ritual <ArrowUpRight /></button><button onClick={openBox}>Build your box <Plus /></button></nav>}
    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-topline mono"><span><i className="status-dot" /> A NEW FREQUENCY OF FOOD</span><span className="hero-coordinates">COLOMBO, LK &nbsp; 6.9271° N / 79.8612° E</span></div>
        <div className="hero-body">
          <div className="hero-copy">
            <div className="hero-intro mono"><span className="tiny-cross">+</span> PREPARED MEALS. REIMAGINED.</div>
            <h1 className="hero-title" id="hero-heading"><span className="line"><span className="line-inner">FUEL YOUR</span></span><span className="line"><span className="line-inner">NEXT<span className="title-period">.</span><span className="title-star" aria-hidden="true">✳</span></span></span></h1>
            <p className="hero-description">Big days need better fuel.<br />Extraordinary meals. Zero kitchen time.<br /><span>Made for the way Colombo moves.</span></p>
            <div className="hero-actions"><button className="button button-dark" onClick={openBox}>Find your factor <ArrowUpRight size={20} /></button><button className="film-link" onClick={() => goTo('transmission')}>Enter the motion lab <ArrowDownRight size={16} /></button></div>
          </div>
          <div className="hero-visual">
            <div className="orbital-guide orbital-guide-one" aria-hidden="true" /><div className="orbital-guide orbital-guide-two" aria-hidden="true" />
            <div className="scene-coordinate coordinate-top mono">FIG. 076 — DAILY FUEL SYSTEM</div>
            <div className="hero-scene"><Suspense fallback={<div className="scene-loader"><span />CALIBRATING YOUR NEXT</div>}><HeroScene reducedMotion={!motion} exploded={exploded} /></Suspense></div>
            <div className="visual-label visual-label-top"><span className="label-connector" /><span className="mono">DESIGNED FOR<br /><b>REAL LIFE.</b></span></div>
            <button className={`explode-button ${exploded ? 'active' : ''}`} onClick={() => setExploded(!exploded)} aria-pressed={exploded}>{exploded ? <RotateCcw size={15} /> : <Maximize2 size={15} />}<span>{exploded ? 'REASSEMBLE' : 'EXPLORE THE FORM'}</span></button>
            <span className="scene-coordinate coordinate-bottom mono">MOVE TO EXPLORE <span>↗</span></span>
            <div className="hero-stamp"><span>NOT YOUR</span><strong>USUAL</strong><span>MEAL PREP.</span></div>
          </div>
        </div>
        <div className="hero-footer"><a href="#philosophy" className="scroll-cue mono"><span><ArrowDown size={17} /></span> SCROLL TO BREAK THE ROUTINE</a><div className="hero-foot-note mono">GOOD FOOD. MORE LIFE.<br /><span>THE NEXT CHAPTER STARTS HERE.</span></div><span className="edition mono">EDITION 001 / COLOMBO</span></div>
      </section>
      <div className="ticker" aria-label="Real food, no friction, made for Colombo"><div className="ticker-track" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>REAL FOOD <b>✳</b> NO FRICTION <b>✳</b> MORE LIVING <b>✳</b> COLOMBO FIRST <b>✳</b></span>)}</div></div>

      <section className="manifesto section-pad" id="philosophy">
        <div className="section-eyebrow mono"><span>01 / THE PHILOSOPHY</span><span>YOUR TIME IS THE MAIN INGREDIENT.</span></div>
        <div className="manifesto-content"><h2 aria-label="Life moves fast. Your food should keep up.">{['LIFE MOVES FAST.', 'YOUR FOOD SHOULD', 'KEEP UP.'].map((line) => <span className="manifesto-word" key={line}>{line}</span>)}</h2><span className="manifesto-asterisk" aria-hidden="true">✳</span></div>
        <div className="manifesto-bottom"><div className="manifesto-symbol" aria-hidden="true"><ArrowDownRight strokeWidth={1} /></div><p data-reveal>Between the early starts and the late finishes, there’s a better way to eat. We’re imagining fresh, fully prepared meals that give you one less thing to think about.<br /><strong>Less planning. More possibilities.</strong></p><span className="vertical-note mono">RETHINK THE EVERYDAY / F76</span></div>
      </section>

      <section className="menu-section section-pad" id="menu">
        <div className="section-eyebrow mono"><span>02 / THE FUEL LINEUP</span><span>CONCEPT MENU — VOL. 01</span></div>
        <div className="section-heading" data-reveal><h2>GOOD TASTE.<br /><span>GREAT ENERGY.</span></h2><div><p>Island roots. A new attitude.<br />Find the fuel that feels like you.</p><div className="filter-tabs" role="group" aria-label="Filter sample meals">{['All', 'Protein', 'Plant'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item === 'All' ? 'All fuel' : item === 'Protein' ? 'High protein' : 'Plant powered'}</button>)}</div></div></div>
        <div className="meal-grid">{concepts.filter((meal) => filter === 'All' || meal.type === filter).map((meal) => <article className="meal-card" key={meal.number}>
          <button className="meal-art" style={{ '--card-color': meal.color } as React.CSSProperties} onClick={() => setSelectedMeal(meal)} aria-label={`Explore ${meal.name}`}>
            <div className="meal-art-label mono"><span>F76 / {meal.number}</span><span>{meal.category}</span></div>
            <div className={`abstract-object abstract-${meal.shape}`} aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
            <span className="art-watermark" aria-hidden="true">{meal.type === 'Plant' ? 'PLANT' : meal.number === '01' ? 'FIRE' : 'FLOW'}</span>
            <span className="meal-art-bottom mono">YOUR DAILY UPGRADE <span className="round-arrow"><ArrowUpRight size={19} /></span></span>
          </button>
          <div className="meal-card-info"><div><h3>{meal.name}</h3><p>{meal.subtitle}</p></div><button aria-label={`Open sample box builder for ${meal.name}`} onClick={openBox}><Plus size={23} /></button></div>
          <div className="meal-macros mono"><span>{meal.energy} KCAL</span><span>{meal.protein}G PROTEIN</span><span>LKR 1,490</span></div>
        </article>)}</div>
        <div className="menu-bottom"><span className="mono">A TASTE OF WHAT’S NEXT. ALL DISHES & VALUES ARE ILLUSTRATIVE.</span><button className="text-link" onClick={openBox}>Explore the full demo menu <ArrowUpRight size={19} /></button></div>
      </section>

      <section className="transmission section-pad" id="transmission" ref={filmSection}>
        <div className="section-eyebrow mono"><span>03 / A TRANSMISSION FROM TOMORROW</span><span><i className="status-dot" /> F76 MOTION LAB</span></div>
          <div className="film-heading" data-reveal><h2>THIS IS YOUR<br /><span>NEXT ERA.</span></h2><p>A little less ordinary.<br />A whole lot more you.<br /><span className="mono">SCROLL TO LET IT UNFOLD.</span></p></div>
        <div className="film-frame">{filmVisible ? <Suspense fallback={<div className="film-placeholder">F76<span className="mono">CALIBRATING MOTION</span></div>}><LaunchFilm reducedMotion={!motion} /></Suspense> : <div className="film-placeholder">F76<span className="mono">SCROLL TO LET IT UNFOLD</span></div>}</div>
      </section>

      <section className="ritual section-pad" id="ritual">
        <div className="section-eyebrow mono"><span>04 / THE NEW RITUAL</span><span>LESS TO DO. MORE TO BE.</span></div>
        <div className="section-heading" data-reveal><h2>THREE STEPS.<br /><span>INFINITE POTENTIAL.</span></h2><p>One simple routine.<br />Room for everything else.</p></div>
        <div className="ritual-grid"><span className="flow-line" aria-hidden="true" />
          <article data-reveal><div className="ritual-art ritual-select"><div /><div /><div /><span><Check size={28} /></span></div><div className="ritual-step"><span className="mono">/01</span><ArrowUpRight /></div><h3>MAKE IT YOURS.</h3><p>Build your weekly box. Mix up your meals. Find your own rhythm.</p></article>
          <article data-reveal><div className="ritual-art ritual-box"><div className="mini-package"><span>factor76</span><i>FUEL YOUR NEXT.</i></div><div className="delivery-dash" /></div><div className="ritual-step"><span className="mono">/02</span><ArrowUpRight /></div><h3>WE TAKE IT FROM HERE.</h3><p>Prepared with care. Delivered to your corner of Colombo.</p></article>
          <article data-reveal><div className="ritual-art ritual-time"><span>02</span><div className="time-orbit" /><i className="mono">MINUTES*</i></div><div className="ritual-step"><span className="mono">/03</span><ArrowUpRight /></div><h3>HEAT. EAT. REPEAT.</h3><p>Your next good meal is moments away. The rest of the day is yours.</p></article>
        </div><p className="ritual-disclaimer mono">*CONCEPT PREPARATION TIME. FOLLOW VERIFIED PACKAGING INSTRUCTIONS AT LAUNCH.</p>
      </section>

      <section className="coverage" id="colombo">
        <div className="coverage-copy" data-reveal><div className="mono"><i className="status-dot" /> ROOTED HERE. READY FOR WHAT’S NEXT.</div><h2>COLOMBO.<br />YOU’RE UP<span>↗</span></h2><p>From the first meeting to the last set.<br />From the city rush to the ocean hush.<br />A new everyday, starting right here.</p><div className="coverage-tag mono"><Crosshair size={17} /> COLOMBO CITY LIMITS <span>PHASE 01</span></div><span className="coverage-note mono">PROPOSED SERVICE AREA / PRIVATE CONCEPT</span></div>
        <div className="city-map" role="img" aria-label="Japanese Ink-style map poster of Colombo, Sri Lanka, using OpenStreetMap data. Illustrative only; it does not show delivery eligibility.">
          <img src="/maps/colombo-japanese-ink.webp" alt="" loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="faq-section section-pad"><div data-reveal><span className="mono">05 / GOOD QUESTIONS</span><h2>A LITTLE<br />MORE INTEL<span>.</span></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item ${activeFaq === index ? 'is-open' : ''}`} key={question}><h3><button aria-expanded={activeFaq === index} aria-controls={`faq-${index}`} onClick={() => setActiveFaq(activeFaq === index ? null : index)}><span className="mono">0{index + 1}</span>{question}{activeFaq === index ? <Minus size={18} /> : <Plus size={18} />}</button></h3><div id={`faq-${index}`} className="faq-answer" hidden={activeFaq !== index}><p>{answer}</p></div></article>)}</div></section>

      <section className="closing"><div className="closing-top mono"><span>YOU’VE GOT PLACES TO BE.</span><span>WE’VE GOT A BOX FOR THAT.</span></div><div className="closing-main"><h2>MEET YOUR<br />NEXT FACTOR<span>.</span></h2><button className="closing-cta" onClick={openBox} aria-label="Build your sample box"><ArrowUpRight /><span className="mono">LET’S BUILD<br />YOUR BOX</span></button></div><div className="closing-word" aria-hidden="true">GOOD FOOD. MORE LIFE. GOOD FOOD.</div></section>
    </main>
    <footer className="footer"><a className="wordmark" href="#">factor<span>76</span><span className="wordmark-dot">✳</span></a><div className="footer-note mono">A BETTER EVERYDAY, IN THE MAKING.<br /><span>COLOMBO, SRI LANKA.</span></div><div className="footer-meta mono"><span>© 2026 FACTOR76 CONCEPT</span><span>PRIVATE DEMO · NO ORDERS OR PAYMENTS</span></div><a href="#" className="back-top" aria-label="Back to top"><ArrowUpRight size={22} /></a></footer>
    <button className="motion-toggle mono" onClick={() => setMotion(!motion)} aria-pressed={motion} aria-label={motion ? 'Pause decorative animations' : 'Enable decorative animations'}>{motion ? <Pause size={11} /> : <Play size={11} />} MOTION {motion ? 'ON' : 'OFF'}</button>
    <BoxBuilder open={boxOpen} onClose={() => setBoxOpen(false)} />
    <dialog className="meal-detail-dialog" ref={detailDialog} aria-labelledby="meal-detail-title" data-lenis-prevent onCancel={() => setSelectedMeal(null)} onClick={(e) => { if (e.target === detailDialog.current) setSelectedMeal(null) }}>
      {selectedMeal && <div><button className="detail-close" aria-label="Close meal details" onClick={() => setSelectedMeal(null)}><X /></button><span className="mono">F76 / CONCEPT {selectedMeal.number}</span><h2 id="meal-detail-title">{selectedMeal.name}</h2><p>{selectedMeal.subtitle}</p><div className="detail-stats"><span><strong>{selectedMeal.energy}</strong>KCAL</span><span><strong>{selectedMeal.protein}g</strong>PROTEIN</span><span><strong>1,490</strong>LKR / MEAL</span></div><p className="detail-note">An illustrative meal concept. Ingredients, allergens, pricing, and nutrition are not verified. This private demo does not accept orders.</p><button className="button button-dark" onClick={openBox}>Explore the sample box <ArrowRight size={18} /></button></div>}
    </dialog>
  </div>
}

export default App
