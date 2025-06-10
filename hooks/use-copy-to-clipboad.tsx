import { useCallback } from 'react'
import { toast } from 'sonner'

export function useCopyToClipboard() {
  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      toast.success('Successfully copied.')
      return true
    } catch (_error) {
      toast.error('Failed to copy.')
      return false
    }
  }, [])

  return copy
}
