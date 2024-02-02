import { useContext, useState, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import { ControllerContext } from '../../lib/ControllerContext'
import { Switch, Paper } from '@mui/material'
import LightSwitch from '../LightSwitch'
import ControlCard from '../ControllerCard'
import mqttPublish from '../../lib/mqttPublish'
import {
  ShellyRelayControllerProps,
  ShellyRelayStatusData,
  IN_TOPICS,
  OUT_TOPICS,
} from './types'
import { Code } from '@mui/icons-material'
import { CodeBlock, atomOneDark } from 'react-code-blocks'

export default function ShellyRelayController({
  topicPrefix,
  name,
}: ShellyRelayControllerProps) {
  const mqttContext = useContext(MqttContext)
  const controllerContext = useContext(ControllerContext)

  const [loading, setLoading] = useState(true)
  const [enabled, setEnabled] = useState(false)
  const [shellyData, setShellyData] = useState<ShellyRelayStatusData | null>()

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/${IN_TOPICS.STATUS}`,
      handler: ({ payload }: handlerPayload) => {
        setLoading(false)
        const data = payload as ShellyRelayStatusData
        setShellyData(data)
        setEnabled(data.output)
      },
    },
  ]

  const publish = (topic: string, value: string) => {
    mqttPublish({ mqttContext: mqttContext ?? undefined, topic, value })
  }

  /**
   * Mqtt add handlers
   */
  useEffect(() => {
    if (mqttContext?.clientReady) {
      mqttContext.addHandlers(incommingMessageHandlers)
      publish(OUT_TOPICS.GEN_COMMAND, OUT_TOPICS.GET_STATUS)
    }

    return () => {
      mqttContext?.removeHandlers(incommingMessageHandlers)
    }
  }, [mqttContext?.clientReady])

  const turnOn = () => {
    setEnabled(true)
    publish(`${topicPrefix}/${OUT_TOPICS.SW_COMMAND}`, OUT_TOPICS.SW_ON)
  }

  const turnOff = () => {
    setEnabled(false)
    publish(`${topicPrefix}/${OUT_TOPICS.SW_COMMAND}`, OUT_TOPICS.SW_OFF)
  }

  controllerContext[name] = {
    turnOnFn: turnOn,
    turnOffFn: turnOff,
  }

  const renderPrimaryContent = () => {
    const switchComponent = (
      <Switch
        checked={enabled}
        onChange={() => {
          const newState = !enabled
          newState ? turnOn() : turnOff()
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    )
    return <LightSwitch switchComponent={switchComponent} />
  }

  const renderSecondaryContent = () => (
    <>
      <Paper>
        <Code />
      </Paper>
      <CodeBlock
        text={JSON.stringify(shellyData, null, 2)}
        language="json"
        showLineNumbers={true}
        startingLineNumber={1}
        theme={atomOneDark}
      />
    </>
  )

  return (
    <ControlCard
      name={name}
      primaryContent={renderPrimaryContent()}
      secondaryContent={renderSecondaryContent()}
      loading={loading}
    />
  )
}
