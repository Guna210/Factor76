import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HyperframesPlayer } from '@hyperframes/player'
import './LaunchFilm.css'

gsap.registerPlugin(ScrollTrigger)

const portraitQuery = '(max-width: 760px) and (orientation: portrait)'

export default function LaunchFilm({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [portrait, setPortrait] = useState(() => window.matchMedia(portraitQuery).matches)
  const frame = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const player = useRef<HyperframesPlayer | null>(null)
  const scrollTrigger = useRef<ScrollTrigger | null>(null)
  const createSequence = useRef<() => void>(() => {})
  const ready = useRef(false)
  const duration = useRef(14)
  const reduced = useRef(reducedMotion)
  const [failed, setFailed] = useState(false)

  useEffect(() => { reduced.current = reducedMotion }, [reducedMotion])

  useEffect(() => {
    const query = window.matchMedia(portraitQuery)
    const updateLayout = () => setPortrait(query.matches)
    updateLayout()
    query.addEventListener('change', updateLayout)
    return () => query.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    if (!host.current || !frame.current) return
    setFailed(false)
    const element = new HyperframesPlayer()
    element.setAttribute('width', portrait ? '900' : '1600')
    element.setAttribute('height', portrait ? '1600' : '900')
    element.setAttribute('src', portrait ? '/film-portrait/index.html' : '/film/index.html')
    element.setAttribute('muted', '')
    element.setAttribute('audio-locked', '')
    element.setAttribute('aria-label', 'Factor76 motion sequence, scroll to move forward or backward')
    element.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;'

    const syncFrame = (progress: number) => {
      const time = Math.max(0, Math.min(1, progress)) * duration.current
      if (frame.current) {
        frame.current.style.background = time < 6.8
          ? '#f1f0e8'
          : time < 10.7
            ? '#f34e20'
            : '#1b1b18'
      }
      if (!ready.current || reduced.current) return
      element.pause()
      element.seek(time)
    }
    const createScrollSequence = () => {
      if (!frame.current || reduced.current || scrollTrigger.current) return
      scrollTrigger.current = ScrollTrigger.create({
        trigger: frame.current,
        pin: frame.current,
        pinSpacing: true,
        start: 'center center',
        end: () => `+=${Math.max(window.innerHeight * 1.5, duration.current * 80)}`,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => syncFrame(trigger.progress),
        onRefresh: (trigger) => syncFrame(trigger.progress),
      })
      syncFrame(scrollTrigger.current.progress)
      ScrollTrigger.refresh()
    }
    createSequence.current = createScrollSequence
    const onReady = () => {
      ready.current = true
      duration.current = element.duration || 14
      element.pause()
      if (reduced.current) {
        element.seek(duration.current)
        if (frame.current) frame.current.style.background = '#1b1b18'
      }
      else createScrollSequence()
    }
    const onError = () => setFailed(true)
    element.addEventListener('ready', onReady)
    element.addEventListener('error', onError)
    host.current.appendChild(element)
    player.current = element

    return () => {
      scrollTrigger.current?.kill(true)
      scrollTrigger.current = null
      createSequence.current = () => {}
      ready.current = false
      element.removeEventListener('ready', onReady)
      element.removeEventListener('error', onError)
      element.pause()
      element.remove()
      player.current = null
    }
  }, [portrait])

  useEffect(() => {
    const element = player.current
    if (!element || !ready.current) return
    element.pause()
    if (reducedMotion) {
      scrollTrigger.current?.kill(true)
      scrollTrigger.current = null
      element.seek(duration.current)
      if (frame.current) frame.current.style.background = '#1b1b18'
      return
    }
    createSequence.current()
  }, [reducedMotion])

  return <div ref={frame} className="launch-film" data-layout={portrait ? 'portrait' : 'landscape'} role="img" aria-label={`Factor76 ${portrait ? 'portrait' : 'landscape'} motion sequence for Colombo, animated as you scroll`}>
    <div ref={host} className="launch-film-stage" />
    {failed && <div className="launch-film-error"><strong>FACTOR76</strong><span className="mono">MOTION SYSTEM / COLOMBO</span></div>}
  </div>
}
