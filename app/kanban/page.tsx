import type { Metadata } from 'next'

import Client from './client'

export const metadata: Metadata = {
  title: 'Kanban',
  description: 'All work is stored in local storage.'
}

export default function Page(): React.ReactElement {
  return <Client />
}
