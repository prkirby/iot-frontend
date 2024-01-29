import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'

export default function ControllerGrid({ children }: React.PropsWithChildren) {
  const renderChildren = () => {
    if (!Array.isArray(children)) return children
    return children.map((el, index) => (
      <Grid xs={12} md={6} lg={4} key={index}>
        {el}
      </Grid>
    ))
  }

  return (
    <Grid
      my={1}
      container
      spacing={{ xs: 2, md: 4 }}
      rowSpacing={{ xs: 2, md: 4 }}
      justifyContent="center"
    >
      {renderChildren()}
    </Grid>
  )
}
