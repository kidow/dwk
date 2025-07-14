'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/kanban/card'
import { ScrollArea, ScrollBar } from '@/components/ui/kanban/scroll-area'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from '@dnd-kit/core'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import tunnel from 'tunnel-rat'
import { z } from 'zod'

const t = tunnel()

export type { DragEndEvent } from '@dnd-kit/core'

type KanbanItemProps = {
  id: string
  name: string
  column: string
} & Record<string, unknown>

type KanbanColumnProps = {
  id: string
  name: string
} & Record<string, unknown>

type KanbanContextProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps
> = {
  columns: C[]
  data: T[]
  activeCardId: string | null
}

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null
})

export type KanbanBoardProps = {
  id: string
  children: ReactNode
  className?: string
}

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id
  })

  return (
    <div
      className={cn(
        'flex size-full sm:w-68 shrink-0 flex-col divide-y overflow-hidden rounded-md border bg-secondary text-xs shadow-sm ring-2 transition-all mb-40',
        isOver ? 'ring-primary' : 'ring-transparent',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode
  className?: string
}

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className
}: KanbanCardProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging
  } = useSortable({
    id
  })
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <>
      <div
        style={style}
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        onClick={() => {
          console.log('clicked')
        }}
      >
        <Card
          className={cn(
            'cursor-grab gap-4 rounded-md p-3 shadow-sm',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className
          )}
        >
          {children ?? <p className="font-medium text-sm">{name}</p>}
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              'cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary',
              isDragging && 'cursor-grabbing',
              className
            )}
          >
            {children ?? <p className="font-medium text-sm">{name}</p>}
          </Card>
        </t.In>
      )}
    </>
  )
}

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> & {
    children: (item: T) => ReactNode
    id: string
    onAddCard?: (name: string) => void
  }

const cardSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' })
})

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  onAddCard,
  ...props
}: KanbanCardsProps<T>) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>
  const filteredData = data.filter((item) => item.column === props.id)
  const items = filteredData.map((item) => item.id)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: ''
    }
  })

  function onSubmit(values: z.infer<typeof cardSchema>) {
    if (onAddCard) onAddCard(values.name)
    form.reset()
    setIsOpen(false)
  }
  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          className={cn(
            'flex flex-grow flex-col gap-2 p-2 overflow-y-scroll',
            className
          )}
          {...props}
        >
          {filteredData.map(children)}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="p-3 flex items-center gap-2 w-full duration-300 hover:bg-primary/5 rounded-md">
              <PlusIcon className="size-4" />
              <span className="text-sm font-medium">Add card</span>
            </DialogTrigger>
            <DialogContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <DialogHeader>
                    <DialogTitle>New card</DialogTitle>
                  </DialogHeader>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Card 1" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add card</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
  <div
    className={cn('p-2 font-semibold text-sm group', className)}
    {...props}
  />
)

export type KanbanProviderProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps
> = Omit<DndContextProps, 'children'> & {
  children: (column: C) => ReactNode
  className?: string
  columns: C[]
  data: T[]
  onDataChange?: (data: T[]) => void
  onDragStart?: (event: DragStartEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onAddColumn?: (name: string) => void
}

const columnSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' })
})

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  onAddColumn,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const card = data.find((item) => item.id === event.active.id)
    if (card) {
      setActiveCardId(event.active.id as string)
    }
    onDragStart?.(event)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) {
      return
    }

    const activeItem = data.find((item) => item.id === active.id)
    const overItem = data.find((item) => item.id === over.id)

    if (!(activeItem && overItem)) {
      return
    }

    const activeColumn = activeItem.column
    const overColumn = overItem.column

    if (activeColumn !== overColumn) {
      let newData = [...data]
      const activeIndex = newData.findIndex((item) => item.id === active.id)
      const overIndex = newData.findIndex((item) => item.id === over.id)

      newData[activeIndex].column = overColumn
      newData = arrayMove(newData, activeIndex, overIndex)

      onDataChange?.(newData)
    }

    onDragOver?.(event)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null)

    onDragEnd?.(event)

    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    let newData = [...data]

    const oldIndex = newData.findIndex((item) => item.id === active.id)
    const newIndex = newData.findIndex((item) => item.id === over.id)

    newData = arrayMove(newData, oldIndex, newIndex)

    onDataChange?.(newData)
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {}

      return `Picked up the card "${name}" from the "${column}" column`
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {}
      const newColumn = columns.find((column) => column.id === over?.id)?.name

      return `Dragged the card "${name}" over the "${newColumn}" column`
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {}
      const newColumn = columns.find((column) => column.id === over?.id)?.name

      return `Dropped the card "${name}" into the "${newColumn}" column`
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {}

      return `Cancelled dragging the card "${name}"`
    }
  }

  const form = useForm<z.infer<typeof columnSchema>>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      name: ''
    }
  })

  function onSubmit(values: z.infer<typeof columnSchema>) {
    if (onAddColumn) onAddColumn(values.name)
    form.reset()
    setIsOpen(false)
  }
  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <div className={cn('flex gap-4 items-start mx-4 mb-4', className)}>
          {columns.map((column) => children(column))}
          <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="p-2 w-full sm:w-68 shrink-0 mr-4 flex items-center gap-2 border border-transparent hover:border-zinc-200 border-dashed duration-300 hover:bg-secondary rounded-md">
                <PlusIcon className="size-4" />
                <span className="font-semibold text-sm">Add column</span>
              </DialogTrigger>
              <DialogContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <DialogHeader>
                      <DialogTitle>New column</DialogTitle>
                    </DialogHeader>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Column 1" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Add column</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  )
}
