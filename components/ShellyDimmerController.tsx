import { useState, useRef, useContext, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../lib/MqttContext'
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
  const mqttContext = useContext(MqttContext)

  // const [shellyOutput, setShellyOutput] = useState('')

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/status/light:0`,
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
        {/* <pre>{shellyOutput}</pre> */}
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
        <Slider
          // value={ledDuty}
          min={0}
          max={100}
          onChange={(_ev, val) => {
            if (Array.isArray(val)) {
              val = val[0]
            }
            throttledSetBrightness(mqttContext?.clientRef.current, val)
          }}
        />
      </Box>
    </Container>
  )
}
