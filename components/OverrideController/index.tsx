import { ButtonGroup, Button } from '@mui/material'
import ControlCard from '../ControllerCard'
import { useContext } from 'react'
import { ControllerContext } from '../../lib/ControllerContext'

const NAME = 'Override'

const renderPrimaryContent = (allOnFn: () => void, allOffFn: () => void) => (
  <ButtonGroup variant="contained">
    <Button onClick={allOnFn}>On</Button>
    <Button onClick={allOffFn}>Off</Button>
  </ButtonGroup>
)

export default function OverrideController() {
  const controllerContext = useContext(ControllerContext)

  const allOnFn = () => {
    for (const [_id, val] of Object.entries(controllerContext)) {
      val.turnOnFn()
    }
  }

  const allOffFn = () => {
    for (const [_id, val] of Object.entries(controllerContext)) {
      val.turnOffFn()
    }
  }

  return (
    <ControlCard
      name={NAME}
      primaryContent={renderPrimaryContent(allOnFn, allOffFn)}
      loading={false}
    />
  )
}
