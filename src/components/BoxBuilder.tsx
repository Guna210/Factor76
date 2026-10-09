import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { formatLkr, mealPhotoUrl, meals, type Meal, type MealCategory } from '../data/meals'
import './BoxBuilder.css'

interface BoxBuilderProps {
  open: boolean
  onClose: () => void
}

type BoxSize = 4 | 6 | 8
type Quantities = Record<string, number>
interface Draft { size: BoxSize; quantities: Quantities }
const STORAGE_KEY = 'factor76-demo-box-v1'
const BOX_SIZES: BoxSize[] = [4, 6, 8]

function readDraft(): Draft {
  const empty: Draft = { size: 6, quantities: {} }
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!stored || typeof stored !== 'object') return empty
    const candidate = stored as Partial<Draft>
    const size = BOX_SIZES.includes(candidate.size as BoxSize) ? candidate.size as BoxSize : 6
    const quantities: Quantities = {}
    let room = size
    for (const meal of meals) {
      const count = candidate.quantities?.[meal.id]
      if (typeof count === 'number' && Number.isInteger(count) && count > 0) {
        quantities[meal.id] = Math.min(count, room)
        room -= quantities[meal.id]
      }
    }
    return { size, quantities }
  } catch {
    return empty
  }
}

function MealArt({ meal, small = false }: { meal: Meal; small?: boolean }) {
  return (
    <div className={`f76-box-art ${small ? 'f76-box-art--small' : ''}`} aria-hidden="true">
      <img src={mealPhotoUrl(meal, small ? 360 : 720)} alt="" loading="lazy" decoding="async" />
    </div>
  )
}

export default function BoxBuilder({ open, onClose }: BoxBuilderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const headingId = useId()
  const [draft, setDraft] = useState<Draft>(readDraft)
  const [filter, setFilter] = useState<'All' | MealCategory>('All')
  const [reviewing, setReviewing] = useState(false)
  const [storageWorks, setStorageWorks] = useState(true)
  const selectedCount = Object.values(draft.quantities).reduce((sum, count) => sum + count, 0)
  const selectedMeals = meals.filter((meal) => (draft.quantities[meal.id] ?? 0) > 0)
  const total = selectedMeals.reduce((sum, meal) => sum + meal.price * draft.quantities[meal.id], 0)
  const isFull = selectedCount === draft.size
  const remaining = draft.size - selectedCount

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      setStorageWorks(true)
    } catch {
      setStorageWorks(false)
    }
  }, [draft])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = previousOverflow }
    }
    if (dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (open) titleRef.current?.focus({ preventScroll: true })
  }, [open, reviewing])

  const changeQuantity = (id: string, delta: number) => {
    setDraft((current) => {
      const count = Object.values(current.quantities).reduce((sum, quantity) => sum + quantity, 0)
      const existing = current.quantities[id] ?? 0
      if ((delta > 0 && count >= current.size) || (delta < 0 && existing === 0)) return current
      return { ...current, quantities: { ...current.quantities, [id]: Math.max(0, existing + delta) } }
    })
  }

  const close = () => {
    dialogRef.current?.close()
    setReviewing(false)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="f76-box-dialog"
      data-lenis-prevent
      aria-labelledby={headingId}
      onCancel={(event) => { event.preventDefault(); close() }}
      onClick={(event) => { if (event.target === event.currentTarget) close() }}
    >
      <div className="f76-box-shell">
        <header className="f76-box-header">
          <div>
            <p className="f76-box-eyebrow"><span /> FACTOR76 / YOUR WEEK, UPGRADED</p>
            <h2 ref={titleRef} tabIndex={-1} id={headingId}>
              {reviewing ? 'LOOKING LIKE A GOOD WEEK.' : 'BUILD YOUR GOOD WEEK.'}
            </h2>
          </div>
          <button className="f76-box-close" onClick={close} aria-label="Close box builder"><X size={23} /></button>
        </header>

        <div className="f76-box-demo-note">
          <span className="f76-box-demo-badge">PRIVATE DEMO</span>
          <span>Colombo city limits. Sample meals & prices. No payment. No order placed.</span>
        </div>

        {reviewing ? (
          <div className="f76-box-review">
            <button className="f76-box-back" onClick={() => setReviewing(false)}><ArrowLeft size={17} /> Back to your meals</button>
            <div className="f76-box-review-intro">
              <div className="f76-box-review-check"><Check size={28} strokeWidth={1.5} /></div>
              <p>Your box is ready.<br /><span>Your real-life week can wait.</span></p>
            </div>
            <div className="f76-box-review-list">
              {selectedMeals.map((meal) => (
                <div className="f76-box-review-row" key={meal.id}>
                  <MealArt meal={meal} small />
                  <div><strong>{meal.name}</strong><span>{draft.quantities[meal.id]} × {formatLkr(meal.price)}</span></div>
                  <strong>{formatLkr(meal.price * draft.quantities[meal.id])}</strong>
                </div>
              ))}
            </div>
            <div className="f76-box-review-total"><span>{draft.size} meals / demo subtotal</span><strong>{formatLkr(total)}</strong></div>
            <p className="f76-box-review-disclaimer">This is a preview, so nothing has been ordered. Delivery pricing and real checkout will come later. {storageWorks ? 'Your meal choices are saved on this device.' : 'Your meal choices are available for this visit only.'}</p>
            <button className="f76-box-primary f76-box-review-done" onClick={close}>Back to the good stuff <ArrowUpRight size={20} /></button>
          </div>
        ) : (
          <div className="f76-box-layout">
            <main className="f76-box-main">
              <section className="f76-box-size" aria-label="Choose your box size">
                <div className="f76-box-section-label"><span>01 / THE SIZE</span><span>{formatLkr(1490)} / MEAL</span></div>
                <div className="f76-box-size-options">
                  {BOX_SIZES.map((size) => (
                    <button
                      key={size}
                      className={draft.size === size ? 'is-selected' : ''}
                      onClick={() => setDraft((current) => ({ ...current, size }))}
                      aria-pressed={draft.size === size}
                      disabled={selectedCount > size}
                      title={selectedCount > size ? `Remove ${selectedCount - size} meals to choose this size` : `${size} meals per box`}
                    >
                      <strong>{size}<span> meals</span></strong>
                      <span>{size === 4 ? 'A little head start' : size === 6 ? 'Your weekday rhythm' : 'Fully in your corner'}</span>
                      {draft.size === size && <Check size={16} />}
                    </button>
                  ))}
                </div>
                {selectedCount > 4 && <p className="f76-box-size-help">Remove meals to switch to a smaller box.</p>}
              </section>
              <section className="f76-box-meals" aria-label="Choose your meals">
                <div className="f76-box-meal-heading">
                  <span className="f76-box-section-label">02 / THE GOOD STUFF</span>
                  <div className="f76-box-filters" aria-label="Filter meals">
                    {(['All', 'Protein', 'Plant'] as const).map((category) => (
                      <button key={category} onClick={() => setFilter(category)} aria-pressed={filter === category} className={filter === category ? 'is-selected' : ''}>{category}</button>
                    ))}
                  </div>
                </div>
                <div className="f76-box-meal-grid">
                  {meals.filter((meal) => filter === 'All' || meal.category === filter).map((meal) => {
                    const quantity = draft.quantities[meal.id] ?? 0
                    return (
                      <article className={`f76-box-meal-card ${quantity > 0 ? 'has-selection' : ''}`} key={meal.id}>
                        <MealArt meal={meal} />
                        <div className="f76-box-meal-card-info">
                          <span className="f76-box-meal-category">{meal.category} / {meal.note}</span>
                          <h3>{meal.name}</h3>
                          <p>{meal.description}</p>
                          <div className="f76-box-meal-card-bottom">
                            <span>{formatLkr(meal.price)}</span>
                            {quantity > 0 ? (
                              <div className="f76-box-stepper" aria-label={`${meal.name} quantity`}>
                                <button onClick={() => changeQuantity(meal.id, -1)} aria-label={`Remove one ${meal.name}`}><Minus size={14} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => changeQuantity(meal.id, 1)} disabled={isFull} aria-label={`Add one ${meal.name}`}><Plus size={14} /></button>
                              </div>
                            ) : (
                              <button className="f76-box-add" onClick={() => changeQuantity(meal.id, 1)} disabled={isFull} aria-label={`Add ${meal.name}`}>Add <Plus size={14} /></button>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
                <p className="f76-box-menu-note">Illustrative menu. Ingredients and dietary suitability will be confirmed before launch.</p>
              </section>
            </main>

            <aside className="f76-box-summary" aria-label="Your box summary">
              <div className="f76-box-summary-top"><span className="f76-box-section-label">YOUR LITTLE LIFE UPGRADE</span><span className="f76-box-summary-number">76</span></div>
              <h3>GOOD FOOD.<br />ON YOUR TERMS.</h3>
              <div className="f76-box-progress" aria-label={`${selectedCount} of ${draft.size} meals selected`}>
                {Array.from({ length: draft.size }, (_, index) => <span key={index} className={index < selectedCount ? 'is-filled' : ''}>{index < selectedCount && <Check size={17} />}</span>)}
              </div>
              <p className="f76-box-progress-label" role="status" aria-live="polite">{isFull ? 'All packed. Nice choices.' : `${selectedCount} of ${draft.size} meals. ${remaining} more to make it yours.`}</p>
              {selectedCount === 0 ? <p className="f76-box-empty">A little less cooking.<br />A lot more living.<br />Start with something you love.</p> : (
                <ul className="f76-box-mini-list">{selectedMeals.map((meal) => <li key={meal.id}><span>{meal.name}</span><strong>×{draft.quantities[meal.id]}</strong></li>)}</ul>
              )}
              <div className="f76-box-subtotal"><span>Demo subtotal</span><strong>{formatLkr(total)}</strong></div>
              <button className="f76-box-primary" onClick={() => setReviewing(true)} disabled={!isFull}>{isFull ? 'Review your box' : `Choose ${remaining} more`}<ArrowUpRight size={20} /></button>
              <button className="f76-box-reset" onClick={() => setDraft((current) => ({ ...current, quantities: {} }))} disabled={selectedCount === 0}><RotateCcw size={13} /> Start fresh</button>
              <p className="f76-box-storage-note">{storageWorks ? 'Draft saved on this device.' : 'Draft available for this visit only.'}<br />Just a demo. All the possibility.</p>
            </aside>
          </div>
        )}
      </div>
    </dialog>
  )
}
