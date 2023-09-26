import { useState, useRef } from 'react'
import type { MqttClient } from 'mqtt'
import useMqtt from '../lib/useMqtt'
import { handlerPayload } from '../lib/useMqtt'

import {
  Box,
  // Button,
  TextField,
  Stack,
  Container,
  Typography,
  Slider,
  Switch,
  Button,
} from '@mui/material'

interface ShellyRelayControllerProps {
  topicPrefix: string
  name: string
}

export default function ShellyRelayController({
  topicPrefix,
  name,
}: ShellyRelayControllerProps) {
  const [shellyOutput, setShellyOutput] = useState('')

  const incommingMessageHandlers = useRef([
    {
      topic: `${topicPrefix}/status/switch:0`,
      handler: ({ payload }: handlerPayload) => {
        setShellyOutput(JSON.stringify(payload, null, 2))
      },
    },
  ])

  const mqttClientRef = useRef<MqttClient | null>(null)
  const setMqttClient = (client: MqttClient) => {
    mqttClientRef.current = client
  }
  useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URI,
    options: {
      // username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      // password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID + '_' + topicPrefix,
    },
    topicHandlers: incommingMessageHandlers.current,
    onConnectedHandler: (client) => setMqttClient(client),
  })
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
            onClick={() => getStatus(mqttClientRef.current)}
          >
            getStatus
          </Button>
        </Box> */}
        <Box display="inline-block" mx={1}>
          <Button
            variant="contained"
            onClick={() => turnOn(mqttClientRef.current)}
          >
            On
          </Button>
        </Box>
        <Box display="inline-block" mx={1}>
          <Button
            variant="outlined"
            onClick={() => turnOff(mqttClientRef.current)}
          >
            Off
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
