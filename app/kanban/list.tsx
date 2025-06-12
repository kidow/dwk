'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

import AddCard from './add-card'
import { useKanban } from './client'
import DropIndicator from './drop-indicator'

interface Props {
  title: string
  column: string
}

function List({ title, column }: Props): React.ReactElement {
  const [active, setActive] = useState(false)
  const { cards, setCards } = useKanban()

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    const cardId = e.dataTransfer.getData('cardId')
  }

  function clearHighlights(elements?: HTMLElement[]) {
    const indicators = elements || getIndicators()

    indicators.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.opacity = '0'
      } else {
        element.classList.add('opacity-0')
      }
    })
  }

  function getIndicators() {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`))
  }
  return (
    <div className="w-68 shrink-0">
      <div className="mb-3 flex items-center px-3 justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-zinc-400">...</span>
      </div>
      <div
        className={cn(
          'size-full transition-colors rounded-xl',
          active ? 'bg-zinc-800/50' : 'bg-zinc-800'
        )}
        onDrop={(e) => {
          const cardId = e.dataTransfer.getData('cardId')

          setActive(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()

          setActive(true)
        }}
        onDragLeave={() => setActive(false)}
      >
        {cards.map((_, key) => (
          <div key={key} className="p-3">
            cards
          </div>
        ))}
        <DropIndicator />
        <AddCard />
      </div>
    </div>
  )
}

export default List
