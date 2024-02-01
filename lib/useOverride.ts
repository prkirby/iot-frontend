import { useEffect } from 'react'
import { OVERRIDE_STATE } from '../components/ControllerPanel/types'

export default function useOverride(
  turnOnFn: () => void,
  turnOffFn: () => void,
  override: OVERRIDE_STATE
) {
  useEffect(() => {
    switch (override) {
      case OVERRIDE_STATE.INIT:
        return
      case OVERRIDE_STATE.ON:
        turnOnFn()
        return
      case OVERRIDE_STATE.OFF:
        turnOffFn()
        return
      default:
        return
    }
  }, [override])
}
