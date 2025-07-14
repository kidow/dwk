type ReactProps = Readonly<{
  children: React.ReactNode
}>

namespace Kanban {
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
}
