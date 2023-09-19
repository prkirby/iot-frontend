import { useState, useRef } from 'react'
import type { MqttClient } from 'mqtt'
import useMqtt from '../lib/useMqtt'
import { handlerPayload } from '../lib/useMqtt'

import {
  Box,
  Button,
  TextField,
  Stack,
  Container,
  // Typography,
  Slider,
} from '@mui/material'

export default function Home() {
  const [ledDuty, setLedDuty] = useState(0)
  const [minSinDuty, setMinSinDuty] = useState(0)
  const [maxSinDuty, setMaxSinDuty] = useState(50)
  const [animTime, setAnimTime] = useState(4000)

  const incommingMessageHandlers = useRef([
    {
      topic: '/sayHelloToUI',
      handler: ({ payload }: handlerPayload) => {
        console.log(payload)
      },
    },
    // {
    //   topic: '/temp',
    //   handler: ({ payload }: handlerPayload) => {
    //     setTemp(payload)
    //   },
    // },
    // {
    //   topic: '/altitude',
    //   handler: ({ payload }: handlerPayload) => {
    //     setAltitude(payload)
    //   },
    // },
    // {
    //   topic: '/tapDetected',
    //   handler: ({ payload }: handlerPayload) => {
    //     setNumTaps(payload)
    //   },
    // },
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
      clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
    },
    topicHandlers: incommingMessageHandlers.current,
    onConnectedHandler: (client) => setMqttClient(client),
  })

  const publishMessages = (client: any) => {
    if (!client) {
      console.log('(publishMessages) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('topic1', '1st message from component')
  }

  const mainLedOn = (client: any) => {
    if (!client) {
      console.log('(ledEnable) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/ledEnable', 'true')
  }

  const mainLedOff = (client: any) => {
    if (!client) {
      console.log('(ledDisable) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/ledDisable', 'true')
  }

  const ledAnimOn = (client: any) => {
    if (!client) {
      console.log('(ledAnimEnable) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/ledAnimEnable', 'true')
  }

  const ledAnimOff = (client: any) => {
    if (!client) {
      console.log('(ledAnimOff) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/ledAnimDisable', 'true')
  }

  const sendLedDuty = (client: any) => {
    if (!client) {
      console.log('(setLedDuty) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/setLedDuty', ledDuty.toString(10))
  }

  const sendMinSinDuty = (client: any) => {
    if (!client) {
      console.log('(setMinSinDuty) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/setMinSinDuty', minSinDuty.toString(10))
  }

  const sendMaxSinDuty = (client: any) => {
    if (!client) {
      console.log('(setMaxSinDuty) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/setMaxSinDuty', maxSinDuty.toString(10))
  }

  const sendAnimTime = (client: any) => {
    if (!client) {
      console.log('(setAnimTime) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/setAnimTime', animTime.toString(10))
  }

  return (
    <Container>
      <Box my={6}>
        <Box my={4}>
          <Stack my={2} direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              onClick={() => publishMessages(mqttClientRef.current)}
            >
              Say Hello
            </Button>
          </Stack>
        </Box>
        <Box my={4}>
          <Stack my={2} direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              onClick={() => mainLedOn(mqttClientRef.current)}
            >
              LEDs On
            </Button>
            <Button
              variant="contained"
              onClick={() => mainLedOff(mqttClientRef.current)}
            >
              LEDs Off
            </Button>
            <Button
              variant="contained"
              onClick={() => ledAnimOn(mqttClientRef.current)}
            >
              LEDs Anim On
            </Button>
            <Button
              variant="contained"
              onClick={() => ledAnimOff(mqttClientRef.current)}
            >
              LEDs Anim Off
            </Button>
          </Stack>
        </Box>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Cur LED Duty (0-50)"
            variant="filled"
            value={ledDuty}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLedDuty(parseInt(event.target.value))
              sendLedDuty(mqttClientRef.current)
            }}
          />
          <Slider
            value={ledDuty}
            min={0}
            max={50}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setLedDuty(val)
              sendLedDuty(mqttClientRef.current)
            }}
          />
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Min sinwave duty (0 - 50)"
            variant="filled"
            value={minSinDuty}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMinSinDuty(parseInt(event.target.value))
              sendMinSinDuty(mqttClientRef.current)
            }}
          />
          <Slider
            value={minSinDuty}
            min={0}
            max={50}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setMinSinDuty(val)
              sendMinSinDuty(mqttClientRef.current)
            }}
          />
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Max sinwave Duty (0-50)"
            variant="filled"
            value={maxSinDuty}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMaxSinDuty(parseInt(event.target.value))
              sendMaxSinDuty(mqttClientRef.current)
            }}
          />
          <Slider
            value={maxSinDuty}
            min={0}
            max={50}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setMaxSinDuty(val)
              sendMaxSinDuty(mqttClientRef.current)
            }}
          />
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Cur Anim Time (ms) (1000 - 20,000)"
            variant="filled"
            value={animTime}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAnimTime(parseInt(event.target.value))
              sendAnimTime(mqttClientRef.current)
            }}
          />
          <Slider
            value={animTime}
            min={1000}
            max={20000}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setAnimTime(val)
              sendAnimTime(mqttClientRef.current)
            }}
          />
        </Stack>
      </Box>
    </Container>
  )
}
