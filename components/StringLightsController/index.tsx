import { useState, useEffect, useContext } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import { IN_TOPICS, OUT_TOPICS, StringLightsControllerProps } from './types'
import {
  Box,
  TextField,
  Stack,
  Container,
  Typography,
  Slider,
  Switch,
} from '@mui/material'
import mqttPublish from '../../lib/mqttPublish'
import debounce from '../../lib/debounce'

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
      topic: `${topicPrefix}/${IN_TOPICS.LED_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setLedEnabled(!!payload)
      },
    },
    {
      topic: `${topicPrefix}/${IN_TOPICS.LED_DUTY_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setLedDuty(payload)
      },
    },
    {
      topic: `${topicPrefix}/${IN_TOPICS.LED_ANIM_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setAnimEnabled(!!payload)
      },
    },
    {
      topic: `${topicPrefix}/${IN_TOPICS.MIN_SIN_DUTY_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setMinSinDuty(payload)
      },
    },
    {
      topic: `${topicPrefix}/${IN_TOPICS.MAX_SIN_DUTY_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setMaxSinDuty(payload)
      },
    },
    {
      topic: `${topicPrefix}/${IN_TOPICS.ANIM_TIME_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setAnimTime(payload)
      },
    },
  ]

  const publish = (topic: string, value?: number) => {
    mqttPublish({
      mqttContext: mqttContext ?? undefined,
      topic: `${topicPrefix}/${topic}`,
      value: value?.toString(10) ?? 'true',
    })
  }

  /**
   * Get light status on render
   */
  useEffect(() => {
    if (mqttContext?.clientReady) {
      mqttContext.addHandlers(incommingMessageHandlers)
      publish(OUT_TOPICS.GET_STATUS)
    }

    return () => {
      mqttContext?.removeHandlers(incommingMessageHandlers)
    }
  }, [mqttContext?.clientReady])

  const debouncedSetDuty = debounce(
    (ledDuty: number) => publish(OUT_TOPICS.SET_LED_DUTY, ledDuty),
    100
  )

  const debouncedSetMinDuty = debounce(
    (minSinDuty: number) => publish(OUT_TOPICS.SET_MIN_SIN_DUTY, minSinDuty),
    100
  )

  const debouncedSetMaxDuty = debounce(
    (maxSinDuty: number) => publish(OUT_TOPICS.SET_MAX_SIN_DUTY, maxSinDuty),
    100
  )

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
                  publish(OUT_TOPICS.LED_ENABLE)
                } else {
                  publish(OUT_TOPICS.LED_DISABLE)
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
                  publish(OUT_TOPICS.LED_ANIM_ENABLE)
                } else {
                  publish(OUT_TOPICS.LED_ANIM_DISABLE)
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
              debouncedSetDuty(ledDuty)
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
              debouncedSetDuty(val)
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
              debouncedSetMinDuty(minSinDuty)
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
              debouncedSetMinDuty(val)
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
              debouncedSetMaxDuty(maxSinDuty)
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
              debouncedSetMaxDuty(val)
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
              publish(OUT_TOPICS.SET_ANIM_TIME, animTime)
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
              publish(OUT_TOPICS.SET_ANIM_TIME, val)
            }}
          />
        </Stack>
      </Box>
    </Container>
  )
}
