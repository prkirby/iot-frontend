import { useState, useRef } from 'react'
import type { MqttClient } from 'mqtt'
import useMqtt from '../lib/useMqtt'
import { handlerPayload } from '../lib/useMqtt'
import throttle from 'lodash/throttle'

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

interface ShellyDimmerControllerProps {
  topicPrefix: string
  name: string
}

export default function ShellyDimmerController({
  topicPrefix,
  name,
}: ShellyDimmerControllerProps) {
  const [shellyOutput, setShellyOutput] = useState('')

  const incommingMessageHandlers = useRef([
    {
      topic: `${topicPrefix}/status/light:0`,
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

  const turnOn = (client: any) => {
    if (!client) {
      console.log('(turnOn) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(
      `${topicPrefix}/rpc`,
      JSON.stringify({
        id: 0,
        src: 'turnontopic',
        method: 'Light.set',
        params: {
          id: 0,
          on: true,
        },
      })
    )
  }
  const turnOff = (client: any) => {
    if (!client) {
      console.log('(turnOff) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(
      `${topicPrefix}/rpc`,
      JSON.stringify({
        id: 0,
        src: 'turnofftopic',
        method: 'Light.set',
        params: {
          id: 0,
          on: false,
        },
      })
    )
  }

  const setBrightness = (client: any, val: number) => {
    if (!client) {
      console.log('(setBrightness) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(
      `${topicPrefix}/rpc`,
      JSON.stringify({
        id: 0,
        src: 'brightnesstopic',
        method: 'Light.set',
        params: {
          id: 0,
          brightness: val,
        },
      })
    )
  }

  const throttledSetBrightness = throttle(setBrightness, 500, {
    leading: true,
    trailing: true,
  })

  return (
    <Container>
      <Box my={3}>
        <Typography variant="h5">{name}</Typography>
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
        <Slider
          // value={ledDuty}
          min={0}
          max={100}
          onChange={(_ev, val) => {
            if (Array.isArray(val)) {
              val = val[0]
            }
            throttledSetBrightness(mqttClientRef.current, val)
          }}
        />
      </Box>
    </Container>
  )
}
