import { Stack, Typography, Switch, Slider } from '@mui/material'
import { ReactComponentElement } from 'react'

export default function LightSwitch({
  switchComponent,
  sliderComponent,
}: {
  switchComponent: ReactComponentElement<typeof Switch>
  sliderComponent?: ReactComponentElement<typeof Slider>
}) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="left"
      alignItems="center"
    >
      <Typography variant="body1">I/O</Typography>
      {switchComponent}
      {sliderComponent}
    </Stack>
  )
}
