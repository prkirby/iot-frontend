import * as React from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { ExpandMoreProps, ControlCardProps } from './types'

/**
 * Borrowed mostly from https://mui.com/material-ui/react-card/ expandable card example
 */

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  margin: '0 auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const StyledCard = styled(Card)(`
  @media (min-width: 600px) {
    display: 'grid';
    minHeight: '240px';
  }
`)

export default function ControlCard({
  name,
  primaryContent,
  secondaryContent,
}: ControlCardProps) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <StyledCard>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>{primaryContent}</CardContent>
      {secondaryContent && (
        <>
          <CardActions disableSpacing sx={{ justifySelf: 'center' }}>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
        </>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{secondaryContent}</CardContent>
      </Collapse>
    </StyledCard>
  )
}
