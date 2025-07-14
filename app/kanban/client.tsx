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
import { openDB } from 'idb'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const shortDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
})

export default function Client({}: Props): React.ReactElement {
  const [columns, setColumns] = useState([
    { id: faker.string.uuid(), name: 'Planned', color: '#6B7280' },
    { id: faker.string.uuid(), name: 'In Progress', color: '#F59E0B' },
    { id: faker.string.uuid(), name: 'Done', color: '#10B981' }
  ])
  const [data, setData] = useState(
    Array.from({ length: 20 })
      .fill(null)
      .map(() => ({
        id: faker.string.uuid(),
        name: capitalize(faker.company.buzzPhrase()),
        craetedAt: faker.date.past({ years: 0.5, refDate: new Date() }),
        column: faker.helpers.arrayElement(columns).id
      }))
  )

  async function get() {
    // const db = await openDB('kanban', 1, {
    //   upgrade(db) {
    //     if (!db.objectStoreNames.contains('columns')) {
    //       db.createObjectStore('columns', { keyPath: 'id' })
    //     }
    //     if (!db.objectStoreNames.contains('cards')) {
    //       db.createObjectStore('cards', { keyPath: 'id' })
    //     }
    //   }
    // })
    // console.log('db', db)
  }

  useEffect(() => {
    get()
  }, [])
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
                      setData(data.filter((f) => f.column !== column.id))
                      setColumns(columns.filter((c) => c.id !== column.id))
                    }}
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              </KanbanHeader>
              <KanbanCards<(typeof data)[number]>
                id={column.id}
                onAddCard={() => {
                  setData([
                    ...data,
                    {
                      id: faker.string.uuid(),
                      name: capitalize(faker.company.buzzPhrase()),
                      craetedAt: faker.date.past({
                        years: 0.5,
                        refDate: new Date()
                      }),
                      column: column.id
                    }
                  ])
                }}
              >
                {(item) => (
                  <KanbanCard
                    column={column.id}
                    id={item.id}
                    key={item.id}
                    name={item.name}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="flex-1 font-medium text-sm">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {shortDateFormatter.format(item.craetedAt)}
                    </p>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    </main>
  )
}
