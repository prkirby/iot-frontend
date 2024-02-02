import { useState, useContext, useEffect } from 'react'
import { MqttContext, handlerPayload } from '../../lib/MqttContext'
import mqttPublish from '../../lib/mqttPublish'
import debounce from '../../lib/debounce'
import LightSwitch from '../LightSwitch'
import ControlCard from '../ControllerCard'
import {
  ShellyDimmerControllerData,
  ShellyDimmerControllerProps,
  OUT_TOPICS,
  IN_TOPICS,
} from './types'
import { Slider, Switch, Paper } from '@mui/material'
import { CodeBlock, atomOneDark } from 'react-code-blocks'
import { Code } from '@mui/icons-material'
import { ControllerContext } from '../../lib/ControllerContext'

export default function ShellyDimmerController({
  topicPrefix,
  name,
}: ShellyDimmerControllerProps) {
  const mqttContext = useContext(MqttContext)
  const controllerContext = useContext(ControllerContext)

  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shellyData, setShellyData] =
    useState<ShellyDimmerControllerData | null>()
  const [dimmerLevel, setDimmerLevel] = useState(0)

  const incommingMessageHandlers = [
    {
      topic: `${topicPrefix}/${IN_TOPICS.STATUS}`,
      handler: ({ payload }: handlerPayload) => {
        const data = payload as ShellyDimmerControllerData
        setEnabled(data.output)
        setDimmerLevel(data.brightness)
        setShellyData(data)
        setLoading(false)
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
    setEnabled(true)
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
    setEnabled(false)
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

  controllerContext[name] = {
    turnOnFn: turnOn,
    turnOffFn: turnOff,
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

  const renderPrimaryContent = () => {
    const switchComponent = (
      <Switch
        checked={enabled}
        onChange={() => {
          const newState = !enabled
          newState ? turnOn() : turnOff()
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    )

    const sliderComponent = (
      <Slider
        value={dimmerLevel}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        valueLabelFormat={(value: number) => `${value}%`}
        onChange={(_ev, val) => {
          if (Array.isArray(val)) {
            val = val[0]
          }
          setDimmerLevel(val)
          debouncedSetBrightness(val)
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

  const renderSecondaryContent = () => (
    <>
      <Paper>
        <Code />
      </Paper>
      <CodeBlock
        text={JSON.stringify(shellyData, null, 2)}
        language="json"
        showLineNumbers={true}
        startingLineNumber={1}
        theme={atomOneDark}
      />
    </>
  )

  return (
    <ControlCard
      name={name}
      primaryContent={renderPrimaryContent()}
      secondaryContent={renderSecondaryContent()}
      loading={loading}
    />
  )
}
