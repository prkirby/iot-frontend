import { useState } from 'react'
import StringLightsController from '../StringLightsController'
import ShellyDimmerController from '../ShellyDimmerController'
import ShellyRelayController from '../ShellyRelayController'
import OverrideController from '../OverrideController'
import ControllerGrid from '../ControllerGrid'
import {
  STRING_LIGHTS_TOPIC_PREFIX,
  STRING_LIGHTS_DATA,
  SHELLY_DIMMERS_DATA,
  SHELLY_RELAYS_DATA,
  OVERRIDE_STATE,
} from './types'

export default function ControllerPanel() {
  const [override, setOverride] = useState(OVERRIDE_STATE.INIT)
  const allOnFn = () => {
    console.log('all On')
    setOverride(OVERRIDE_STATE.ON)
  }

  const allOffFn = () => {
    console.log('all off')
    setOverride(OVERRIDE_STATE.OFF)
  }

  const renderLightControls = () => {
    let stringLightsControllers = []
    for (const { id, name } of STRING_LIGHTS_DATA) {
      stringLightsControllers.push(
        <StringLightsController
          topicPrefix={`${STRING_LIGHTS_TOPIC_PREFIX}/${id}`}
          name={name}
          key={name}
          override={override}
        />
      )
    }

    return stringLightsControllers
  }

  const renderShellyDimmers = () => {
    let shellyDimmers = []
    for (const { topicPrefix, name } of SHELLY_DIMMERS_DATA) {
      shellyDimmers.push(
        <ShellyDimmerController
          topicPrefix={topicPrefix}
          name={name}
          key={name}
          override={override}
        />
      )
    }

    return shellyDimmers
  }

  const renderShellyRelays = () => {
    let shellyRelays = []
    for (const { topicPrefix, name } of SHELLY_RELAYS_DATA) {
      shellyRelays.push(
        <ShellyRelayController
          topicPrefix={topicPrefix}
          name={name}
          key={name}
          override={override}
        />
      )
    }

    return shellyRelays
  }

  return (
    <>
      <ControllerGrid>
        {<OverrideController allOnFn={allOnFn} allOffFn={allOffFn} />}
      </ControllerGrid>
      <ControllerGrid>{renderShellyRelays()}</ControllerGrid>
      <ControllerGrid>{renderLightControls()}</ControllerGrid>
      <ControllerGrid>{renderShellyDimmers()}</ControllerGrid>
    </>
  )
}
