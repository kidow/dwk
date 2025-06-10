import { Suspense } from 'react'

import Client from './client'

export default async function Page(): Promise<React.ReactElement> {
  return (
    <Suspense fallback={null}>
      <Client />
    </Suspense>
  )
}
