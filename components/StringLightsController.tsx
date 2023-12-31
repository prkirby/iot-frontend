import { useState, useRef, useEffect, useContext } from 'react'
import { MqttContext, handlerPayload } from '../lib/MqttContext'

import {
  Box,
  // Button,
  TextField,
  Stack,
  Container,
  Typography,
  Slider,
  Switch,
} from '@mui/material'

interface StringLightsControllerProps {
  topicPrefix: string
  name: string
}

export default function StringLightsController({
  topicPrefix,
  name,
}: StringLightsControllerProps) {
  const mqttContext = useContext(MqttContext)

  const [ledEnabled, setLedEnabled] = useState(false)
  const [ledDuty, setLedDuty] = useState(0)
  const [animEnabled, setAnimEnabled] = useState(false)
  const [minSinDuty, setMinSinDuty] = useState(0)
  const [maxSinDuty, setMaxSinDuty] = useState(50)
  const [animTime, setAnimTime] = useState(4000)

  const incommingMessageHandlers = [
    {
      topic: topicPrefix + '/ledState',
      handler: ({ payload }: handlerPayload) => {
        setLedEnabled(!!payload)
      },
    },
    {
      topic: topicPrefix + '/ledDutyState',
      handler: ({ payload }: handlerPayload) => {
        setLedDuty(payload)
      },
    },
    {
      topic: topicPrefix + '/ledAnimState',
      handler: ({ payload }: handlerPayload) => {
        setAnimEnabled(!!payload)
      },
    },
    {
      topic: topicPrefix + '/minSinDutyState',
      handler: ({ payload }: handlerPayload) => {
        setMinSinDuty(payload)
      },
    },
    {
      topic: topicPrefix + '/maxSinDutyState',
      handler: ({ payload }: handlerPayload) => {
        setMaxSinDuty(payload)
      },
    },
    {
      topic: topicPrefix + '/animTimeState',
      handler: ({ payload }: handlerPayload) => {
        setAnimTime(payload)
      },
    },
  ]

  useEffect(() => {
    if (mqttContext?.clientReady) {
      mqttContext.addHandlers(incommingMessageHandlers)
      sendGetStatus(mqttContext.clientRef.current)
    }

    return () => {
      mqttContext?.removeHandlers(incommingMessageHandlers)
    }
  }, [mqttContext?.clientReady])

  const mainLedOn = (client: any) => {
    if (!client) {
      console.log('(ledEnable) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/ledEnable', 'true')
  }

  const mainLedOff = (client: any) => {
    if (!client) {
      console.log('(ledDisable) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/ledDisable', 'true')
  }

  const ledAnimOn = (client: any) => {
    if (!client) {
      console.log('(ledAnimEnable) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/ledAnimEnable', 'true')
  }

  const ledAnimOff = (client: any) => {
    if (!client) {
      console.log('(ledAnimOff) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/ledAnimDisable', 'true')
  }

  const sendLedDuty = (client: any, ledDuty: number) => {
    if (!client) {
      console.log('(setLedDuty) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/setLedDuty', ledDuty.toString(10))
  }

  const sendMinSinDuty = (client: any, minSinDuty: number) => {
    if (!client) {
      console.log('(setMinSinDuty) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/setMinSinDuty', minSinDuty.toString(10))
  }

  const sendMaxSinDuty = (client: any, maxSinDuty: number) => {
    if (!client) {
      console.log('(setMaxSinDuty) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/setMaxSinDuty', maxSinDuty.toString(10))
  }

  const sendAnimTime = (client: any, animTime: number) => {
    if (!client) {
      console.log('(setAnimTime) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/setAnimTime', animTime.toString(10))
  }

  const sendGetStatus = (client: any) => {
    if (!client) {
      console.log('(getStatus) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish(topicPrefix + '/getStatus', 'true')
  }

  return (
    <Container>
      <Box my={6}>
        <Typography variant="h3">{name}</Typography>
        <Box my={4}>
          <Stack my={2} direction="row" spacing={2} alignItems="left">
            <Typography variant="h4">LED Enabled:</Typography>
            <Switch
              checked={ledEnabled}
              size="medium"
              onChange={(e) => {
                const ledEnabled = e.target.checked
                if (ledEnabled) {
                  mainLedOn(mqttContext?.clientRef.current)
                } else {
                  mainLedOff(mqttContext?.clientRef.current)
                }
                setLedEnabled(ledEnabled)
              }}
            />
          </Stack>
          <Stack my={2} direction="row" spacing={2} alignItems="left">
            <Typography variant="h4">Animation Enabled</Typography>
            <Switch
              checked={animEnabled}
              size="medium"
              onChange={(e) => {
                const animEnabled = e.target.checked
                if (animEnabled) {
                  ledAnimOn(mqttContext?.clientRef.current)
                } else {
                  ledAnimOff(mqttContext?.clientRef.current)
                }
                setAnimEnabled(animEnabled)
              }}
            />
          </Stack>
        </Box>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Cur LED Duty (0-50)"
            variant="filled"
            value={ledDuty}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const ledDuty = parseInt(event.target.value)
              setLedDuty(ledDuty)
              sendLedDuty(mqttContext?.clientRef.current, ledDuty)
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
              sendLedDuty(mqttContext?.clientRef.current, val)
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
              const minSinDuty = parseInt(event.target.value)
              setMinSinDuty(minSinDuty)
              sendMinSinDuty(mqttContext?.clientRef.current, minSinDuty)
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
              sendMinSinDuty(mqttContext?.clientRef.current, val)
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
              const maxSinDuty = parseInt(event.target.value)
              setMaxSinDuty(maxSinDuty)
              sendMaxSinDuty(mqttContext?.clientRef.current, maxSinDuty)
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
              sendMaxSinDuty(mqttContext?.clientRef.current, val)
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
              const animTime = parseInt(event.target.value)
              setAnimTime(animTime)
              sendAnimTime(mqttContext?.clientRef.current, animTime)
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
              sendAnimTime(mqttContext?.clientRef.current, val)
            }}
          />
        </Stack>
      </Box>
    </Container>
  )
}
