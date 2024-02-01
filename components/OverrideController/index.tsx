import { ButtonGroup, Button } from '@mui/material'
import ControlCard from '../ControllerCard'
import { OverrideControllerProps } from './types'

const NAME = 'Override'

const renderPrimaryContent = (allOnFn: () => void, allOffFn: () => void) => (
  <ButtonGroup variant="contained">
    <Button onClick={allOnFn}>I</Button>
    <Button onClick={allOffFn}>O</Button>
  </ButtonGroup>
)

export default function OverrideController({
  allOnFn,
  allOffFn,
}: OverrideControllerProps) {
  return (
    <ControlCard
      name={NAME}
      primaryContent={renderPrimaryContent(allOnFn, allOffFn)}
    />
  )
}
