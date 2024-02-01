import ControllerPanel from '../components/ControllerPanel'
import { Container, Typography } from '@mui/material'

export default function Home() {
  return (
    <Container>
      <Typography variant="h2" textAlign="center">
        KIRBY_IOT
      </Typography>
      <ControllerPanel />
    </Container>
  )
}
