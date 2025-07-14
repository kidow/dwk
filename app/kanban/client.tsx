'use client'

import { Header } from '@/components/header'
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider
} from '@/components/ui/kanban'
import { faker } from '@faker-js/faker'
import { deleteDB, openDB } from 'idb'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Column {
  id: string
  name: string
  color: string
}
interface Card {
  id: string
  name: string
  createdAt: Date
  columnId: string
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const shortDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
})

export default function Client(): React.ReactElement {
  const [columns, setColumns] = useState<Column[]>([])
  const [data, setData] = useState<Card[]>([])

  async function get() {
    try {
      const db = await openDB('kanban', 2, {
        upgrade(db, oldVersion, newVersion) {
          if (oldVersion < 1) {
            if (!db.objectStoreNames.contains('columns')) {
              db.createObjectStore('columns', { keyPath: 'id' })
            }
            if (!db.objectStoreNames.contains('cards')) {
              db.createObjectStore('cards', { keyPath: 'id' })
            }
          }

          if (oldVersion < 2) {
          }
        }
      })

      const columns = await db.getAll('columns')
      console.log('columns', columns)
      const cards = await db.getAll('cards')
      console.log('cards', cards)
      // setColumns(columns)
      // setData(cards)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setColumns([
      { id: faker.string.uuid(), name: 'Planned', color: '#6B7280' },
      { id: faker.string.uuid(), name: 'In Progress', color: '#F59E0B' },
      { id: faker.string.uuid(), name: 'Done', color: '#10B981' }
    ])
    get()
  }, [])

  useEffect(() => {
    if (columns.length)
      setData(
        Array.from({ length: 20 })
          .fill(null)
          .map(() => ({
            id: faker.string.uuid(),
            name: capitalize(faker.company.buzzPhrase()),
            createdAt: faker.date.past({ years: 0.5, refDate: new Date() }),
            columnId: faker.helpers.arrayElement(columns).id
          }))
      )
  }, [columns.length])
  return (
    <main className="flex flex-col h-screen">
      <div className="fixed top-0 h-30 pt-20 px-4 z-10 w-full left-0 right-0">
        <div className="w-full max-w-screen-sm mx-auto">
          <Header
            title="Kanban"
            description="All work is stored in local storage."
          />
        </div>
      </div>
      <div className="flex-1 mt-50 overflow-x-scroll">
        <KanbanProvider
          columns={columns}
          data={data}
          onDataChange={setData}
          onAddColumn={() => {
            setColumns([
              ...columns,
              { id: faker.string.uuid(), name: 'New Column', color: '#6B7280' }
            ])
          }}
        >
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader>
                <div className="flex items-center gap-2">
                  <button
                    className="size-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <div className="flex-1">{column.name}</div>
                  <button
                    className="sm:opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setData(data.filter((f) => f.columnId !== column.id))
                      setColumns(columns.filter((c) => c.id !== column.id))
                    }}
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              </KanbanHeader>
              <KanbanCards
                id={column.id}
                onAddCard={async (name) => {
                  const db = await openDB('kanban', 2)
                  const tx = db.transaction('cards', 'readwrite')
                  const cardStore = tx.objectStore('cards')
                  const now = new Date()
                  await cardStore.add({
                    id: faker.string.uuid(),
                    name,
                    createdAt: now,
                    columnId: column.id
                  })
                  await tx.done
                  setData([
                    ...data,
                    { id: column.id, name, createdAt: now, columnId: column.id }
                  ])
                }}
              >
                {(item) => (
                  <KanbanCard
                    columnId={column.id}
                    id={item.id}
                    key={item.id}
                    name={item.name}
                    createdAt={item.createdAt}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="flex-1 font-medium text-sm">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {shortDateFormatter.format(item.createdAt)}
                    </p>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>

      <button
        className="fixed bottom-4 right-4"
        onClick={async () => {
          try {
            await deleteDB('kanban')
            toast.success('DB reset')
          } catch (error) {
            console.error(error)
          }
        }}
      >
        Reset DB
      </button>
    </main>
  )
}
