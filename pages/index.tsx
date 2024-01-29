import StringLightsController from '../components/StringLightsController'
import ShellyDimmerController from '../components/ShellyDimmerController'
import ShellyRelayController from '../components/ShellyRelayController'
import { Box, Container, Typography } from '@mui/material'
import ControllerGrid from '../components/ControllerGrid'

const stringLightsTopicPrefix = '/LIGHTING'
const stringLightsData = [
  {
    id: 'LIVING_ROOM',
    name: 'Living Room',
  },
  {
    id: 'MUSIC_ROOM',
    name: 'Music Room',
  },
  {
    id: 'DESK_ROOM',
    name: 'Desk Room',
  },
]

const renderLightControls = () => {
  let stringLightsControllers = []
  for (const { id, name } of stringLightsData) {
    stringLightsControllers.push(
      <StringLightsController
        topicPrefix={`${stringLightsTopicPrefix}/${id}`}
        name={name}
        key={name}
      />
    )
  }

  return stringLightsControllers
}

const shellyDimmersData = [
  { topicPrefix: 'BEDROOM_LIGHT', name: 'Bedroom Overhead' },
]

const renderShellyDimmers = () => {
  let shellyDimmers = []
  for (const { topicPrefix, name } of shellyDimmersData) {
    shellyDimmers.push(
      <ShellyDimmerController
        topicPrefix={topicPrefix}
        name={name}
        key={name}
      />
    )
  }

  return shellyDimmers
}

const shellyRelaysData = [
  { topicPrefix: 'BEDROOM_STRINGLIGHT', name: 'Bedroom Stringlight' },
]

const renderShellyRelays = () => {
  let shellyRelays = []
  for (const { topicPrefix, name } of shellyRelaysData) {
    shellyRelays.push(
      <ShellyRelayController topicPrefix={topicPrefix} name={name} key={name} />
    )
  }

  return shellyRelays
}

export default function Home() {
  return (
    <Container>
      <Typography variant="h2" textAlign="center">
        KIRBY_IOT
      </Typography>
      <ControllerGrid>
        {[...renderShellyRelays(), ...renderShellyDimmers()]}
      </ControllerGrid>
      <ControllerGrid>{renderLightControls()}</ControllerGrid>
    </Container>
  )
}
