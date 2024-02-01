import { IconButtonProps } from '@mui/material/IconButton'
import React from 'react'

export interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

export interface ControlCardProps {
  name: string
  primaryContent: React.ReactElement
  secondaryContent?: React.ReactElement
}
