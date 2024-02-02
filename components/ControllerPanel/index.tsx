import { useState } from 'react'
import ControllerProvider from '../../lib/ControllerContext'
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
} from './types'

export default function ControllerPanel() {
  const renderLightControls = () => {
    let stringLightsControllers = []
    for (const { id, name } of STRING_LIGHTS_DATA) {
      stringLightsControllers.push(
        <StringLightsController
          topicPrefix={`${STRING_LIGHTS_TOPIC_PREFIX}/${id}`}
          name={name}
          key={name}
        />
      )
    }

    return stringLightsControllers
  }

  const renderShellyDimmers = () => {
    let shellyDimmers = []
    for (const { topicPrefix, name, id } of SHELLY_DIMMERS_DATA) {
      shellyDimmers.push(
        <ShellyDimmerController
          topicPrefix={topicPrefix ?? ''}
          name={name}
          key={id}
        />
      )
    }

    return shellyDimmers
  }

  const renderShellyRelays = () => {
    let shellyRelays = []
    for (const { topicPrefix, name, id } of SHELLY_RELAYS_DATA) {
      shellyRelays.push(
        <ShellyRelayController
          topicPrefix={topicPrefix ?? ''}
          name={name}
          key={id}
        />
      )
    }

    return shellyRelays
  }

  return (
    <ControllerProvider>
      <ControllerGrid>{[<OverrideController key="override" />]}</ControllerGrid>
      <ControllerGrid>
        {[...renderShellyRelays(), ...renderShellyDimmers()]}
      </ControllerGrid>
      <ControllerGrid>{renderLightControls()}</ControllerGrid>
    </ControllerProvider>
  )
}
