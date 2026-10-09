import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { HyperframesPlayer } from "@hyperframes/player"
import "./LaunchFilm.css"

gsap.registerPlugin(ScrollTrigger)
type FilmLayout = "landscape" | "square" | "portrait"
const portraitQuery = "(max-aspect-ratio: 4/5)"
const squareQuery = "(min-aspect-ratio: 4/5) and (max-aspect-ratio: 6/5)"

function getFilmLayout(): FilmLayout {
  if (window.matchMedia(portraitQuery).matches) return "portrait"
  if (window.matchMedia(squareQuery).matches) return "square"
  return "landscape"
}

export default function LaunchFilm({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [layout, setLayout] = useState<FilmLayout>(getFilmLayout)
  const frame = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<HyperframesPlayer | null>(null)
  const scrollTrigger = useRef<ScrollTrigger | null>(null)
  const ready = useRef(false)
  const duration = useRef(14)
  const reduced = useRef(reducedMotion)
  const createSequence = useRef<() => void>(() => {})
  const [failed, setFailed] = useState(false)

  useEffect(() => { reduced.current = reducedMotion }, [reducedMotion])

  useEffect(() => {
    const portrait = window.matchMedia(portraitQuery)
    const square = window.matchMedia(squareQuery)
    const update = () => setLayout(getFilmLayout())
    update()
    portrait.addEventListener("change", update)
    square.addEventListener("change", update)
    return () => {
      portrait.removeEventListener("change", update)
      square.removeEventListener("change", update)
    }
  }, [])

  useEffect(() => {
    if (!host.current || !frame.current) return
    setFailed(false)
    const element = new HyperframesPlayer()
    element.setAttribute("width", layout === "landscape" ? "1600" : "1200")
    element.setAttribute("height", layout === "landscape" ? "900" : "1200")
    element.setAttribute("src", layout === "portrait" ? "/film-portrait/index.html" : layout === "square" ? "/film-square/index.html" : "/film/index.html")
    element.setAttribute("muted", "")
    element.setAttribute("audio-locked", "")
    element.setAttribute("aria-label", "Factor76 food photography film, scrubbed by page scroll")
    element.style.cssText = "display:block;width:100%;height:100%;pointer-events:none;background:#17382d;"

    const seekToProgress = (progress: number) => {
      if (!ready.current || reduced.current) return
      element.pause()
      element.seek(Math.max(0, Math.min(1, progress)) * duration.current)
    }

    const createScrollSequence = () => {
      if (!frame.current || reduced.current || scrollTrigger.current) return
      scrollTrigger.current = ScrollTrigger.create({
        trigger: frame.current,
        pin: frame.current,
        pinSpacing: true,
        start: "top top",
        end: () => "+=" + Math.max(window.innerHeight * 2.5, duration.current * 112),
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => seekToProgress(trigger.progress),
        onRefresh: (trigger) => seekToProgress(trigger.progress),
      })
      seekToProgress(scrollTrigger.current.progress)
      ScrollTrigger.refresh()
    }
    createSequence.current = createScrollSequence

    const onReady = () => {
      ready.current = true
      duration.current = element.duration || 14
      element.pause()
      if (reduced.current) element.seek(duration.current)
      else createScrollSequence()
    }
    const onError = () => setFailed(true)
    element.addEventListener("ready", onReady)
    element.addEventListener("error", onError)
    host.current.appendChild(element)
    player.current = element

    return () => {
      scrollTrigger.current?.kill(true)
      scrollTrigger.current = null
      createSequence.current = () => {}
      ready.current = false
      element.removeEventListener("ready", onReady)
      element.removeEventListener("error", onError)
      element.pause()
      element.remove()
      player.current = null
    }
  }, [layout])

  useEffect(() => {
    const element = player.current
    if (!element || !ready.current) return
    element.pause()
    if (reducedMotion) {
      scrollTrigger.current?.kill(true)
      scrollTrigger.current = null
      element.seek(duration.current)
      return
    }
    createSequence.current()
  }, [reducedMotion])

  return (
    <div ref={frame} className="launch-film" data-layout={layout} role="img" aria-label="A scroll-controlled Factor76 food photography film">
      <div className="launch-film-stage">
        <div ref={host} className="launch-film-player" />
      </div>
      {failed && <div className="launch-film-error"><strong>FACTOR76</strong><span className="mono">A LITTLE FOOD FILM / COLOMBO</span></div>}
      <span className="launch-film-scrub-hint mono" aria-hidden="true">SCROLL TO REVEAL THE NEXT COURSE ↓</span>
    </div>
  )
}
