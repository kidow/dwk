'use client'

import { Header } from '@/components/header'
import { useObjectState } from '@/hooks/use-object-state'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { createContext, useContext, useEffect, useState } from 'react'

import BurnBarrel from './burn-barrel'
import List from './list'
import NewList from './new-list'

interface Props {}
interface State {
  list: Array<{
    title: string
    id: string
    column: string
  }>
}

export default function Client({}: Props): React.ReactElement {
  const [{ list }, setState] = useObjectState<State>({
    list: [
      {
        title: 'Look into render bug in dashboard',
        id: '1',
        column: 'backlog'
      },
      { title: 'SOX compliance checklist', id: '2', column: 'backlog' },
      { title: '[SPIKE] Migrate to Azure', id: '3', column: 'backlog' },
      { title: 'Document Notifications service', id: '4', column: 'backlog' },
      {
        title: 'Research DB options for new microservice',
        id: '5',
        column: 'todo'
      },
      { title: 'Postmortem for outage', id: '6', column: 'todo' },
      { title: 'Sync with product on Q3 roadmap', id: '7', column: 'todo' },

      {
        title: 'Refactor context providers to use Zustand',
        id: '8',
        column: 'doing'
      },
      { title: 'Add logging to daily CRON', id: '9', column: 'doing' },
      {
        title: 'Set up DD dashboards for Lambda listener',
        id: '10',
        column: 'done'
      }
    ]
  })
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
      <Provider>
        <div className="flex-1 mt-50 overflow-x-scroll sm:overflow-x-visible">
          <div className="inline-flex items-start mx-5 space-x-3">
            <List title="Backlog" column="backlog" />
            <List title="In Progress" column="in-progress" />
            <List title="Doing" column="doing" />
            <List title="Done" column="done" />
            <div>
              <NewList />
              <BurnBarrel />
            </div>
          </div>
        </div>
      </Provider>
    </main>
  )
}

const Context = createContext<
  | {
      cards: Array<{ id: string; title: string; column: string }>
      setCards: (
        cards: Array<{ id: string; title: string; column: string }>
      ) => void
    }
  | undefined
>(undefined)

export function useKanban() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useKanban must be used within an KanbanProvider')
  }
  return context
}

function Provider({ children }: ReactProps) {
  const [cards, setCards] = useState<
    Array<{ id: string; title: string; column: string }>
  >([
    {
      title: 'Look into render bug in dashboard',
      id: '1',
      column: 'backlog'
    },
    { title: 'SOX compliance checklist', id: '2', column: 'backlog' },
    { title: '[SPIKE] Migrate to Azure', id: '3', column: 'backlog' },
    { title: 'Document Notifications service', id: '4', column: 'backlog' },
    {
      title: 'Research DB options for new microservice',
      id: '5',
      column: 'todo'
    },
    { title: 'Postmortem for outage', id: '6', column: 'todo' },
    { title: 'Sync with product on Q3 roadmap', id: '7', column: 'todo' },

    {
      title: 'Refactor context providers to use Zustand',
      id: '8',
      column: 'doing'
    },
    { title: 'Add logging to daily CRON', id: '9', column: 'doing' },
    {
      title: 'Set up DD dashboards for Lambda listener',
      id: '10',
      column: 'done'
    }
  ])

  useEffect(() => {
    // localStorage에서 찾아와서 넣기
  }, [])
  return (
    <Context.Provider value={{ cards, setCards }}>{children}</Context.Provider>
  )
}
