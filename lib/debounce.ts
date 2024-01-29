import { useCallback } from 'react'
import { throttle } from 'lodash'

export default function debounce(fn: any, wait: number) {
  return useCallback(throttle(fn, wait, { leading: true, trailing: true }), [])
}
