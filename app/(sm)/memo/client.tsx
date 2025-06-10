'use client'

import { Header } from '@/components/header'
import { BASE_URL } from '@/data'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboad'
import { useDebounceCallback } from '@/hooks/use-debounce-callback'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useObjectState } from '@/hooks/use-object-state'
import type { Editor } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import './editor.css'

interface Props {}
interface State {
  saveStatus: string
  hydrated: boolean
}

const INITIAL_CONTENT: Content = {
  type: 'doc',
  content: [{ type: 'paragraph' }]
}

export default function Client({}: Props): React.ReactElement {
  const [content, setContent] = useLocalStorage<Content>(
    'content',
    INITIAL_CONTENT
  )
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [hydrated, setHydrated] = useState(false)
  const copy = useCopyToClipboard()

  const onUpdate = useDebounceCallback((editor: Editor) => {
    setSaveStatus('Saving...')
    if (editor) setContent(editor.getJSON())
    setTimeout(() => {
      setSaveStatus('Saved')
    }, 500)
  }, 750)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Type anything...' })
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert focus:outline-none placeholder:italic'
      }
    },
    onCreate: ({ editor }) => {
      const content = window.localStorage.getItem('content')
      if (content) editor.commands.setContent(JSON.parse(content))
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('Typing...')
      onUpdate(editor)
    },
    autofocus: 'end'
  })

  const onShareLink = async () => {
    const param = btoa(encodeURIComponent(JSON.stringify(content)))
    await copy(`${BASE_URL}/memo?c=${param}`)
  }

  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content)
      setHydrated(true)
    }
  }, [editor, content, hydrated])
  return (
    <>
      <Header
        title="Memo"
        description="The content is stored in the local storage"
      />
      <motion.div
        className="min-h-96 pb-80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <EditorContent editor={editor} spellCheck={false} />
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="rounded-lg bg-zinc-100 px-2 py-1 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            {saveStatus}
          </span>
          <button
            onClick={onShareLink}
            className="rounded-lg ring px-2 py-1 dark:ring-zinc-700 dark:text-zinc-400"
            aria-label="Share link"
          >
            Share link
          </button>
          <button
            onClick={() => {
              editor?.commands.clearContent()
              setContent(INITIAL_CONTENT)
            }}
            className="rounded-lg ring px-2 py-1 dark:ring-zinc-700 dark:text-zinc-400"
            aria-label="Clear content"
          >
            Clear
          </button>
        </div>
      </motion.div>
    </>
  )
}
