import StringLightsController from '../components/stringLightsController'
import ShellyDimmerController from '../components/shellyDimmerController'
import ShellyRelayController from '../components/shellyRelayController'
import { Box, Container } from '@mui/material'

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
  for (const stringLightData of stringLightsData) {
    stringLightsControllers.push(
      <Box my={6} key={stringLightData.id}>
        <StringLightsController
          topicPrefix={`${stringLightsTopicPrefix}/${stringLightData.id}`}
          name={stringLightData.name}
        />
      </Box>
    )
  }

  return stringLightsControllers
}

const shellyDimmersData = [
  { topicPrefix: 'BEDROOM_LIGHT', name: 'Bedroom Overhead' },
]

const renderShellyDimmers = () => {
  let shellyDimmers = []
  for (const shellyDimmerData of shellyDimmersData) {
    shellyDimmers.push(
      <Box my={2} key={shellyDimmerData.topicPrefix}>
        <ShellyDimmerController
          topicPrefix={shellyDimmerData.topicPrefix}
          name={shellyDimmerData.name}
        />
      </Box>
    )
  }

  return shellyDimmers
}

const shellyRelaysData = [
  { topicPrefix: 'BEDROOM_STRINGLIGHT', name: 'Bedroom Stringlight' },
]

const renderShellyRelays = () => {
  let shellyRelays = []
  for (const shellyRelayData of shellyRelaysData) {
    shellyRelays.push(
      <Box my={2} key={shellyRelayData.topicPrefix}>
        <ShellyRelayController
          topicPrefix={shellyRelayData.topicPrefix}
          name={shellyRelayData.name}
        />
      </Box>
    )
  }

  return shellyRelays
}

export default function Home() {
  return (
    <Container>
      {renderShellyRelays()}
      {renderShellyDimmers()}
      {renderLightControls()}
    </Container>
  )
}
