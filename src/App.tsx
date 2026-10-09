import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Menu, Minus, Plus, X } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BoxBuilder from "./components/BoxBuilder"
import { formatLkr, mealPhotoUrl, meals, photoCredits } from "./data/meals"

const LaunchFilm = lazy(() => import("./components/LaunchFilm"))
gsap.registerPlugin(ScrollTrigger)

const rituals = [
  { number: "01", title: "Pick your favourites.", body: "Choose a few good things for the week ahead.", photo: meals[0] },
  { number: "02", title: "We make it lovely.", body: "Fresh, flavour-first food, cooked with care.", photo: meals[1] },
  { number: "03", title: "Your time is back.", body: "Heat, eat, and get on with your day.", photo: meals[2] },
]

const faqs = [
  { question: "What is Factor76?", answer: "A private concept for chef-prepared meals in Colombo. This website is a design prototype; its sample menu and prices are illustrative." },
  { question: "Where would you deliver?", answer: "The first concept area is Colombo city limits. The map is a visual reference, not a live delivery checker." },
  { question: "Can I build a sample box?", answer: "Yes. The sample builder lets you choose meals and review a demo subtotal. It saves in this browser and does not create an order or payment." },
  { question: "Are the photos the actual menu?", answer: "No. The food photography is illustrative inspiration from Unsplash. The menu, ingredients, allergens, nutrition, and final photography have not been verified for a real launch." },
]

function App() {
  const root = useRef<HTMLDivElement>(null)
  const [motion, setMotion] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotion = () => setMotion(!query.matches)
    query.addEventListener("change", syncMotion)
    return () => query.removeEventListener("change", syncMotion)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "full" : "reduced"
    const context = gsap.context(() => {
      if (motion) {
        gsap.fromTo(".hero-copy > *", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.11, delay: 0.12, ease: "power3.out" })
        gsap.fromTo(".hero-photo", { clipPath: "inset(12% 8% 0 8% round 45% 45% 8px 8px)", opacity: 0.4 }, { clipPath: "inset(0% 0% 0 0% round 45% 45% 8px 8px)", opacity: 1, duration: 1.25, delay: 0.18, ease: "power3.out" })
        gsap.to(".hero-photo img", { yPercent: 7, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 } })
        gsap.to(".ticker-track", { xPercent: -22, ease: "none", scrollTrigger: { trigger: ".ticker", start: "top bottom", end: "bottom top", scrub: 1 } })
        gsap.to(".story-photo img", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".story-section", start: "top bottom", end: "bottom top", scrub: 0.8 } })
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: motion ? 30 : 0, opacity: motion ? 0 : 1 }, {
          y: 0,
          opacity: 1,
          duration: 0.78,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        })
      })

      if (motion) {
        gsap.utils.toArray<HTMLElement>(".dish-photo img").forEach((image) => {
          gsap.fromTo(image, { scale: 1.09 }, { scale: 1, duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: image, start: "top 92%", once: true } })
        })
      }
    }, root)

    return () => context.revert()
  }, [motion])

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [])

  const goTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: motion ? "smooth" : "instant", block: "start" })
  }

  return (
    <div className="site-shell" ref={root}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Factor76 home">factor<span>76</span><i>✳</i></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#menu">The menu</a>
          <a href="#story">Our way</a>
          <a href="#colombo">Colombo</a>
        </nav>
        <div className="header-actions">
          <span className="demo-label"><i />PRIVATE PREVIEW</span>
          <button className="header-button" onClick={() => setBuilderOpen(true)}>Build a box <ArrowUpRight size={16} /></button>
          <button className="mobile-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
        <button onClick={() => goTo("menu")}>The menu <ArrowUpRight /></button>
        <button onClick={() => goTo("story")}>Our way <ArrowUpRight /></button>
        <button onClick={() => goTo("colombo")}>Colombo <ArrowUpRight /></button>
        <button onClick={() => { setMenuOpen(false); setBuilderOpen(true) }}>Build a box <Plus /></button>
      </nav>}

      <main id="main">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-topline mono"><span><i className="live-dot" /> GOOD FOOD FOR THE WEEK AHEAD</span><span>COLOMBO, SRI LANKA</span></div>
          <div className="hero-body">
            <div className="hero-copy">
              <p className="hero-kicker"><span>MEALS, MADE FOR REAL LIFE</span><span>NO. 01 / COLOMBO</span></p>
              <h1 id="hero-heading">Make room<br />for <em>good.</em></h1>
              <p className="hero-lede">A very good meal can change the shape of a day.</p>
              <p className="hero-description">Fresh, chef-prepared food for the days that ask a lot of you. More flavour on your plate. More time for everything else.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => goTo("menu")}>Meet this week’s menu <ArrowDown size={17} /></button>
                <button className="text-button" onClick={() => goTo("story")}>A little about us <ArrowRight size={16} /></button>
              </div>
              <div className="hero-foot"><span className="hero-foot-mark">76</span><span>BIG COLOMBO ENERGY.<br /><b>GOOD THINGS, READY WHEN YOU ARE.</b></span></div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                <img src={mealPhotoUrl(meals[0], 1600)} srcSet={mealPhotoUrl(meals[0], 900) + " 900w, " + mealPhotoUrl(meals[0], 1600) + " 1600w"} sizes="(max-width: 800px) 100vw, 54vw" alt={meals[0].photoAlt} fetchPriority="high" />
                <span className="photo-index mono">A VERY GOOD PLACE TO START / 01</span>
                <div className="hero-photo-note"><span>FRESHLY<br />MADE</span><b>✳</b></div>
              </div>
              <div className="hero-stamp"><span>FOR THE<br />LONG WEEK</span><b>✳</b></div>
              <span className="hero-vertical mono">REAL FOOD · FULL DAYS · COLOMBO</span>
            </div>
          </div>
          <div className="hero-bottom"><a className="scroll-cue" href="#menu"><span><ArrowDown size={15} /></span> SCROLL FOR THE GOOD STUFF</a><span className="hero-bottom-note mono">A PRIVATE FOOD CONCEPT / 2026</span></div>
        </section>

        <div className="ticker" aria-hidden="true"><div className="ticker-track">{Array.from({ length: 4 }, (_, index) => <span key={index}>LESS PREP <b>✳</b> MORE FLAVOUR <b>✳</b> MADE FOR COLOMBO <b>✳</b> MORE LIFE <b>✳</b></span>)}</div></div>

        <section className="promise-section">
          <div className="promise-top mono"><span>THE IDEA IS SIMPLE</span><span>GOOD FOOD SHOULD GIVE YOU SOMETHING BACK.</span></div>
          <div className="promise-main" data-reveal><p className="promise-aside">A LITTLE LESS<br />TO THINK ABOUT.</p><h2>More time<br />to <em>taste</em> the day.</h2><div className="promise-seal"><span>FRESH<br />FLAVOUR<br />FACTOR 76</span><b>✳</b></div></div>
          <div className="promise-bottom"><span className="promise-mark">✳</span><p>We’re imagining a better kind of everyday meal: generous, full of flavour, and ready to make the rest of your day feel a little lighter.</p><span className="promise-sign mono">SAMPLE MENU ONLY<br />NOT A LIVE FOOD SERVICE</span></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading" data-reveal>
            <div><p className="section-kicker mono"><span>01 / THE MENU</span><span>COLOMBO EDITION</span></p><h2>Good things<br />are <em>cooking.</em></h2></div>
            <p>Bold little favourites, dreamed up for the week ahead. Find your new go-to.</p>
          </div>
          <div className="dish-grid">
            {meals.slice(0, 3).map((meal, index) => (
              <article className="dish-card" key={meal.id} data-reveal>
                <div className="dish-photo">
                  <img src={mealPhotoUrl(meal, 1000)} alt={meal.photoAlt} loading="lazy" decoding="async" />
                  <span className="dish-number mono">0{index + 1} / 03</span>
                  <span className="dish-category">{meal.category === "Plant" ? "PLANT-BASED" : "A LITTLE PROTEIN"}</span>
                </div>
                <div className="dish-card-copy">
                  <p className="dish-note mono">{meal.note}</p>
                  <h3>{meal.name}</h3>
                  <p className="dish-description">{meal.description}</p>
                  <div className="dish-card-bottom"><span>{formatLkr(meal.price)} <small>/ sample meal</small></span><button onClick={() => setBuilderOpen(true)} aria-label={"Build a sample box with " + meal.name}><ArrowUpRight size={18} /></button></div>
                </div>
              </article>
            ))}
          </div>
          <div className="menu-note mono"><span>MENU & PRICES ARE ILLUSTRATIVE</span><span>PHOTOGRAPHY IS FOR MOOD, NOT AN EXACT DISH DEPICTION</span></div>
          <button className="menu-builder-link" onClick={() => setBuilderOpen(true)}>Build your sample box <ArrowRight size={18} /></button>
        </section>

        <section className="story-section" id="story">
          <div className="story-photo" data-reveal>
            <img src={mealPhotoUrl(meals[1], 1400)} alt={meals[1].photoAlt} loading="lazy" decoding="async" />
            <span className="story-photo-caption mono">A LITTLE ISLAND IN EVERY BITE / COLOMBO</span>
            <span className="story-photo-stamp">✳</span>
          </div>
          <div className="story-copy" data-reveal>
            <p className="section-kicker mono"><span>02 / OUR WAY</span><span>GOOD FOOD, LITTLE ADMIN</span></p>
            <h2>Make your<br />weekday taste<br /><em>like something.</em></h2>
            <p>We believe the best meal plans leave plenty of room for life. So we’re dreaming up food with a little island soul, all the good bits already done, and nothing between you and a proper lunch.</p>
            <button className="story-link" onClick={() => goTo("routine")}>How the good week works <ArrowRight size={17} /></button>
          </div>
        </section>

        <section className="film-section" id="routine">
          <div className="film-intro">
            <p className="section-kicker mono"><span>03 / A LITTLE FOOD FILM</span><span>SCROLL TO LET IT UNFOLD</span></p>
            <h2>From our table<br />to <em>your Tuesday.</em></h2>
            <p>A few good ingredients. A little care. The beginning of a very good day.</p>
          </div>
          <Suspense fallback={<div className="film-loader">FACTOR76 / A LITTLE FOOD FILM</div>}>
            <LaunchFilm reducedMotion={!motion} />
          </Suspense>
        </section>

        <section className="ritual-section">
          <div className="section-heading" data-reveal>
            <div><p className="section-kicker mono"><span>04 / THE GOOD ROUTINE</span><span>LESS TO PLAN, MORE TO ENJOY</span></p><h2>Your week,<br />well <em>fed.</em></h2></div>
            <p>Good food can fit into the life you already have.</p>
          </div>
          <div className="ritual-grid">
            {rituals.map((step) => (
              <article className="ritual-card" key={step.number} data-reveal>
                <div className="ritual-photo"><img src={mealPhotoUrl(step.photo, 800)} alt="" loading="lazy" decoding="async" /><span>{step.number}</span></div>
                <div className="ritual-card-index mono"><span>THE SHORT VERSION</span><ArrowUpRight size={15} /></div>
                <h3>{step.title}</h3><p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="colombo-section" id="colombo">
          <div className="colombo-copy">
            <p className="section-kicker mono"><span>05 / ROOTED HERE</span><span>COLOMBO, SRI LANKA</span></p>
            <h2>A good<br />thing for<br /><em>our city.</em></h2>
            <p>From the first coffee to the last train home, Colombo keeps its own pace. We’re imagining food that can keep up with yours.</p>
            <div className="colombo-tag"><MapPin size={16} /><span>COLOMBO CITY LIMITS</span><b>PHASE 01</b></div>
            <span className="colombo-note mono">PROPOSED SERVICE AREA / PRIVATE CONCEPT</span>
          </div>
          <div className="city-map">
            <img src="/maps/colombo-japanese-ink.webp" alt="Illustrative map of Colombo, Sri Lanka" loading="lazy" decoding="async" />
            <span className="map-caption mono">A LITTLE CLOSER TO HOME / 06°55′38″N 79°50′48″E</span>
          </div>
        </section>

        <section className="faq-section">
          <div className="faq-heading" data-reveal><p className="section-kicker mono"><span>06 / GOOD QUESTIONS</span><span>THE SHORT VERSION</span></p><h2>Curious?<br /><em>Good.</em></h2><p>A few things about this little preview.</p></div>
          <div className="faq-list">
            {faqs.map((item, index) => <article className={"faq-item " + (openFaq === index ? "is-open" : "")} key={item.question}>
              <h3><button aria-expanded={openFaq === index} aria-controls={"faq-answer-" + index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="mono">0{index + 1}</span><strong>{item.question}</strong>{openFaq === index ? <Minus size={17} /> : <Plus size={17} />}</button></h3>
              <div className="faq-answer" id={"faq-answer-" + index} hidden={openFaq !== index}><p>{item.answer}</p></div>
            </article>)}
          </div>
        </section>

        <section className="closing">
          <div className="closing-top mono"><span>YOU HAVE PLACES TO BE.</span><span>WE HAVE A VERY GOOD IDEA.</span></div>
          <div className="closing-main"><div><span className="closing-kicker mono">FACTOR76 / COLOMBO</span><h2>Eat well.<br /><em>Go on.</em></h2></div><button className="closing-cta" onClick={() => setBuilderOpen(true)} aria-label="Open the sample box builder"><span>LET’S<br />BUILD</span><ArrowUpRight size={25} /></button></div>
          <div className="closing-scribble">GOOD FOOD / MORE LIFE / GOOD FOOD / MORE LIFE /</div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#" aria-label="Factor76 home">factor<span>76</span><i>✳</i></a>
        <p className="mono">A COLOMBO FOOD CONCEPT<br />PRIVATE DESIGN PREVIEW / 2026</p>
        <div className="footer-credits"><span className="mono">FOOD PHOTOS</span>{photoCredits.map((credit) => <a href={credit.page} key={credit.name} target="_blank" rel="noreferrer">{credit.name}</a>)}<span>via Unsplash</span></div>
        <button className="back-top mono" onClick={() => window.scrollTo({ top: 0, behavior: motion ? "smooth" : "instant" })}>BACK TO THE TOP ↑</button>
        <span className="footer-disclaimer mono">SAMPLE MENU ONLY · NO ORDERS OR PAYMENTS</span>
      </footer>
      <button className="motion-toggle" aria-pressed={motion} onClick={() => setMotion(!motion)}><span>{motion ? "✳" : "Ⅱ"}</span>{motion ? "MOTION ON" : "MOTION PAUSED"}</button>
      <BoxBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} />
    </div>
  )
}

export default App