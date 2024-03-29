import { useState, useEffect, useContext } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import { IN_TOPICS, OUT_TOPICS, StringLightsControllerProps } from './types'
import ControlCard from '../ControllerCard'
import LightSwitch from '../LightSwitch'
import { Stack, Typography, Slider, Switch } from '@mui/material'
import mqttPublish from '../../lib/mqttPublish'
import debounce from '../../lib/debounce'
import { ControllerContext } from '../../lib/ControllerContext'

export default function StringLightsController({
  topicPrefix,
  name,
}: StringLightsControllerProps) {
  const controllerContext = useContext(ControllerContext)
  const mqttContext = useContext(MqttContext)

  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ledDuty, setLedDuty] = useState(0)
  const [animEnabled, setAnimEnabled] = useState(false)
  const [minSinDuty, setMinSinDuty] = useState(0)
  const [maxSinDuty, setMaxSinDuty] = useState(50)
  const [animTime, setAnimTime] = useState(4000)

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/${IN_TOPICS.LED_STATE}`,
      handler: ({ payload }: handlerPayload) => {
        setLoading(false)
        setEnabled(!!payload)
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

  const turnOn = () => {
    setEnabled(true)
    publish(OUT_TOPICS.LED_ENABLE)
  }

  const turnOff = () => {
    setEnabled(false)
    publish(OUT_TOPICS.LED_DISABLE)
  }

  controllerContext[name] = {
    turnOnFn: turnOn,
    turnOffFn: turnOff,
  }

  const renderPrimaryContent = () => {
    const switchComponent = (
      <Switch
        checked={enabled}
        size="medium"
        onChange={(e) => {
          const ledEnabled = e.target.checked
          ledEnabled ? turnOn() : turnOff()
        }}
      />
    )

    const sliderComponent = (
      <Slider
        value={ledDuty}
        min={0}
        max={50}
        valueLabelDisplay="auto"
        valueLabelFormat={(value: number) => `${value * 2}%`}
        onChange={(_ev, val) => {
          if (Array.isArray(val)) {
            val = val[0]
          }
          setLedDuty(val)
          debouncedSetDuty(val)
        }}
      />
    )

    return (
      <LightSwitch
        switchComponent={switchComponent}
        sliderComponent={sliderComponent}
      />
    )
  }

  const renderSecondaryContent = () => {
    return (
      <>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="left"
          alignItems="center"
        >
          <Typography variant="h6">Pulse</Typography>
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
        <Stack my={1} direction="column" spacing={2} alignItems="left">
          <Typography variant="h6">Min Pulse Brightness</Typography>
          <Slider
            value={minSinDuty}
            min={0}
            max={50}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value * 2}%`}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setMinSinDuty(val)
              debouncedSetMinDuty(val)
            }}
          />
        </Stack>
        <Stack my={1} direction="column" spacing={1} alignItems="left">
          <Typography variant="h6">Max Pulse Brightness</Typography>
          <Slider
            value={maxSinDuty}
            min={0}
            max={50}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value * 2}%`}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setMaxSinDuty(val)
              debouncedSetMaxDuty(val)
            }}
          />
        </Stack>
        <Stack my={1} direction="column" spacing={1} alignItems="left">
          <Typography variant="h6">Pulse Time</Typography>
          <Slider
            value={animTime}
            min={1000}
            max={20000}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) => `${value / 1000} secs`}
            onChange={(_ev, val) => {
              if (Array.isArray(val)) {
                val = val[0]
              }
              setAnimTime(val)
              publish(OUT_TOPICS.SET_ANIM_TIME, val)
            }}
          />
        </Stack>
      </>
    )
  }

  return (
    <ControlCard
      name={name}
      loading={loading}
      primaryContent={renderPrimaryContent()}
      secondaryContent={renderSecondaryContent()}
    />
  )
}
