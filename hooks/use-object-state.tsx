import { useCallback, useEffect, useRef, useState } from 'react'

export function useObjectState<T>(
  initialState: T
): [
  T,
  (obj: Partial<T>, callback?: (state: T) => void) => void,
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  (keys?: Array<keyof T>) => void
] {
  const [state, setState] = useState<T>(initialState)
  const callbackRef = useRef<(state: T) => void | null>(null)
  const isFirstCallbackCall = useRef<boolean>(true)

  const onChange = useCallback(
    (obj: Partial<T>, callback?: (state: T) => void) => {
      callbackRef.current = callback || null
      setState((prevState) => ({ ...prevState, ...obj }))
    },
    []
  )

  const onEventChange = useCallback(
    ({
      target: { name, value }
    }: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >): void => setState((prevState) => ({ ...prevState, [name]: value })),
    []
  )

  const arrayToObject = (keys: Array<keyof T>): T => {
    if (!keys.length) return initialState
    const initial: any = {}
    keys.reduce((acc, cur) => (initial[cur] = initialState[cur]), initial)
    return initial
  }
  const resetState = (keys?: Array<keyof T>) =>
    keys
      ? setState((prevState) => ({ ...prevState, ...arrayToObject(keys) }))
      : setState({ ...initialState })

  useEffect(() => {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false
      return
    }
    callbackRef.current?.(state)
  }, [state])

  return [state, onChange, onEventChange, resetState]
}
