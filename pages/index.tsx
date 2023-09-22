import StringLightsController from '../components/stringLightsController'
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

export default function Home() {
  return <Container>{renderLightControls()}</Container>
}
