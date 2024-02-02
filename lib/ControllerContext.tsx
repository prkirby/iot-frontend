import { PropsWithChildren, createContext } from 'react'

export interface ControllerContext {
  [id: string]: {
    turnOnFn: () => void
    turnOffFn: () => void
  }
}

export const ControllerContext = createContext<ControllerContext>({})

export default function ControllerProvider({ children }: PropsWithChildren) {
  return (
    <ControllerContext.Provider value={{}}>
      {children}
    </ControllerContext.Provider>
  )
}
