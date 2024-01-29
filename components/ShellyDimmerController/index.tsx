import { useState, useContext, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import mqttPublish from '../../lib/mqttPublish'
import debounce from '../../lib/debounce'
import {
  ShellyDimmerControllerData,
  ShellyDimmerControllerProps,
  OUT_TOPICS,
  IN_TOPICS,
} from './types'
import { Stack, Container, Typography, Slider, Switch } from '@mui/material'

export default function ShellyDimmerController({
  topicPrefix,
  name,
}: ShellyDimmerControllerProps) {
  const mqttContext = useContext(MqttContext)

  const [shellyData, setShellyData] =
    useState<ShellyDimmerControllerData | null>()
  const [switchActive, setSwitchActive] = useState(false)
  const [dimmerLevel, setDimmerLevel] = useState(0)

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/${IN_TOPICS.STATUS}`,
      handler: ({ payload }: handlerPayload) => {
        const data = payload as ShellyDimmerControllerData
        setShellyData(data)
        setSwitchActive(data.output)
        setDimmerLevel(data.brightness)
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

  const turnOn = () => {
    publish(
      `${topicPrefix}/${OUT_TOPICS.DIMMER_COMMAND}`,
      JSON.stringify({
        id: 0,
        src: OUT_TOPICS.SW_ON,
        method: OUT_TOPICS.LIGHT_METHOD,
        params: {
          id: 0,
          on: true,
        },
      })
    )
  }

  const turnOff = () => {
    publish(
      `${topicPrefix}/${OUT_TOPICS.DIMMER_COMMAND}`,
      JSON.stringify({
        id: 0,
        src: OUT_TOPICS.SW_OFF,
        method: OUT_TOPICS.LIGHT_METHOD,
        params: {
          id: 0,
          on: false,
        },
      })
    )
  }

  const setBrightness = (val: number) => {
    publish(
      `${topicPrefix}/${OUT_TOPICS.DIMMER_COMMAND}`,
      JSON.stringify({
        id: 0,
        src: OUT_TOPICS.SW_DIM,
        method: OUT_TOPICS.LIGHT_METHOD,
        params: {
          id: 0,
          brightness: val,
        },
      })
    )
  }

  const debouncedSetBrightness = debounce(setBrightness, 100)

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
        <Switch
          checked={switchActive}
          onChange={() => {
            const newState = !switchActive
            setSwitchActive(newState)
            if (newState) {
              turnOn()
            } else {
              turnOff()
            }
          }}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Stack>
      <Slider
        value={dimmerLevel}
        min={0}
        max={100}
        onChange={(_ev, val) => {
          if (Array.isArray(val)) {
            val = val[0]
          }
          setDimmerLevel(val)
          debouncedSetBrightness(val)
        }}
      />
      {/* <pre>{JSON.stringify(shellyData, null, 2)}</pre> */}
    </Container>
  )
}