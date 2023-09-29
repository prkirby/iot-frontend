import { useContext, useState, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../lib/MqttContext'
import { Box, Container, Typography, Button } from '@mui/material'

interface ShellyRelayControllerProps {
  topicPrefix: string
  name: string
}

export default function ShellyRelayController({
  topicPrefix,
  name,
}: ShellyRelayControllerProps) {
  const mqttContext = useContext(MqttContext)

  // const [shellyOutput, setShellyOutput] = useState('')

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/status/switch:0`,
      handler: ({ payload }: handlerPayload) => {
        // setShellyOutput(JSON.stringify(payload, null, 2))
      },
    },
  ]

  useEffect(() => {
    if (mqttContext?.clientReady) {
      mqttContext.addHandlers(incommingMessageHandlers)
    }

    return () => {
      mqttContext?.removeHandlers(incommingMessageHandlers)
    }
  }, [mqttContext?.clientReady])

  const getStatus = (client: any) => {
    if (!client) {
      console.log('(getStatus) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('shellies/command', 'status_update')
  }
  const turnOn = (client: any) => {
    if (!client) {
      console.log('(turnOn) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(`${topicPrefix}/command/switch:0`, 'on')
  }
  const turnOff = (client: any) => {
    if (!client) {
      console.log('(turnOff) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(`${topicPrefix}/command/switch:0`, 'off')
  }

  return (
    <Container>
      <Box my={3}>
        <Typography variant="h5">{name}</Typography>
        {/* <pre>{shellyOutput}</pre> */}
        {/* <Box display="inline-block" mx={1}>
          <Button
            variant="contained"
            onClick={() => getStatus(mqttContext?.clientRef.current)}
          >
            getStatus
          </Button>
        </Box> */}
        <Box display="inline-block" mx={1}>
          <Button
            variant="contained"
            onClick={() => turnOn(mqttContext?.clientRef.current)}
          >
            On
          </Button>
        </Box>
        <Box display="inline-block" mx={1}>
          <Button
            variant="outlined"
            onClick={() => turnOff(mqttContext?.clientRef.current)}
          >
            Off
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
