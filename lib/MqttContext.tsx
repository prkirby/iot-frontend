import type { MqttClient } from 'mqtt'
import MQTT from 'mqtt'
import {
  MutableRefObject,
  ReactElement,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import randomstring from 'randomstring'

export type TopicHandlers = { topic: string; handler: (payload: any) => void }[]

export interface MqttContextType {
  clientReady: boolean
  clientRef: MutableRefObject<MqttClient | null>
  addHandlers: (newHandlers: TopicHandlers) => void
  removeHandlers: (handlersForRemoval: TopicHandlers) => void
}

export interface handlerPayload {
  topic: string
  payload: any
  packet: any
}

export const MqttContext = createContext<MqttContextType | null>(null)

export default function MqttProvider({ children }: { children: ReactElement }) {
  const [clientReady, setClientReady] = useState(false)

  const clientRef = useRef<MqttClient | null>(null)
  const topicHandlersRef = useRef<TopicHandlers>([])

  /**
   *
   * @param newHandlers
   */
  const addHandlers = (newHandlers: TopicHandlers) => {
    topicHandlersRef.current.push(...newHandlers)
    for (const handler of newHandlers) {
      clientRef.current?.subscribe(handler.topic)
    }
  }

  /**
   *
   * @param handlersForRemoval
   */
  const removeHandlers = (handlersForRemoval: TopicHandlers) => {
    for (const handler of handlersForRemoval) {
      let handlerToRemoveIndex = topicHandlersRef.current.findIndex(
        (val) => val.topic === handler.topic
      )
      do {
        if (handlerToRemoveIndex >= 0) {
          const removedHandler = topicHandlersRef.current.splice(
            handlerToRemoveIndex,
            1
          )
          clientRef.current?.unsubscribe(removedHandler[0].topic)
        }
        handlerToRemoveIndex = topicHandlersRef.current.findIndex(
          (val) => val.topic === handler.topic
        )
      } while (handlerToRemoveIndex >= 0)
    }
  }

  useEffect(() => {
    if (clientRef.current) return

    try {
      clientRef.current = MQTT.connect(process.env.NEXT_PUBLIC_MQTT_URI, {
        clientId:
          process.env.NEXT_PUBLIC_MQTT_CLIENTID +
          '_' +
          randomstring.generate(8),
        keepalive: 0,
      })
    } catch (error) {
      console.error('error', error)
    }
    const client = clientRef.current

    client?.on('message', (topic: string, rawPayload: any, packet: any) => {
      const th = topicHandlersRef.current.find((t) => t.topic === topic)
      let payload
      try {
        payload = JSON.parse(rawPayload)
      } catch {
        payload = rawPayload
      }
      if (th) th.handler({ topic, payload, packet })
    })

    client?.on('connect', () => {
      setClientReady(true)
    })

    return () => {
      if (client) {
        client.end()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MqttContext.Provider
      value={{ clientReady, clientRef, addHandlers, removeHandlers }}
    >
      {children}
    </MqttContext.Provider>
  )
}
