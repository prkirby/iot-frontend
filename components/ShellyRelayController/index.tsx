import { useContext, useState, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import useOverride from '../../lib/useOverride'
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
  override,
}: ShellyRelayControllerProps) {
  const mqttContext = useContext(MqttContext)

  const [shellyData, setShellyData] = useState<ShellyRelayStatusData | null>()
  const [switchActive, setSwitchActive] = useState(false)

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/${IN_TOPICS.STATUS}`,
      handler: ({ payload }: handlerPayload) => {
        const data = payload as ShellyRelayStatusData
        setShellyData(data)
        setSwitchActive(data.output)
      },
    },
  ]

  const publish = (topic: string, value: string) => {
    mqttPublish({ mqttContext: mqttContext ?? undefined, topic, value })
  }

  useEffect(() => {
    if (mqttContext?.clientReady) {
      mqttContext.addHandlers(incommingMessageHandlers)
      publish(OUT_TOPICS.GEN_COMMAND, OUT_TOPICS.GET_STATUS)
    }

    return () => {
      mqttContext?.removeHandlers(incommingMessageHandlers)
    }
  }, [mqttContext?.clientReady])

  /** Override Hook */
  const overrideOn = () => {
    publish(`${topicPrefix}/${OUT_TOPICS.SW_COMMAND}`, OUT_TOPICS.SW_ON)
    setSwitchActive(true)
  }

  const overrideOff = () => {
    publish(`${topicPrefix}/${OUT_TOPICS.SW_COMMAND}`, OUT_TOPICS.SW_OFF)
    setSwitchActive(false)
  }

  useOverride(overrideOn, overrideOff, override)

  const renderPrimaryContent = () => {
    const switchComponent = (
      <Switch
        checked={switchActive}
        onChange={() => {
          const newState = !switchActive
          setSwitchActive(newState)
          publish(
            `${topicPrefix}/${OUT_TOPICS.SW_COMMAND}`,
            newState ? OUT_TOPICS.SW_ON : OUT_TOPICS.SW_OFF
          )
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
    />
  )
}
