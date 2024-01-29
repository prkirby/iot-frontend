import { useContext, useState, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import { Stack, Container, Typography, Switch } from '@mui/material'
import mqttPublish from '../../lib/mqttPublish'
import {
  ShellyRelayControllerProps,
  ShellyRelayStatusData,
  IN_TOPICS,
  OUT_TOPICS,
} from './types'

export default function ShellyRelayController({
  topicPrefix,
  name,
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

  return (
    <Container>
      <Stack
        my={2}
        direction="row"
        spacing={2}
        alignItems="left"
        alignContent="center"
      >
        <Typography variant="h5">{name}</Typography>
        {/* <pre>{JSON.stringify(shellyData, null, 2)}</pre> */}
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
      </Stack>
    </Container>
  )
}
