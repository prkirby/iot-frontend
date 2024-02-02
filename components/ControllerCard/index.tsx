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
import { LinearProgress } from '@mui/material'

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

const StyledCardHeader = styled(CardHeader)`
  padding-top: 8px;
  padding-bottom: 4px;
`

const StyledCardContent = styled(CardContent)`
  padding-top: 0;
  padding-bottom: 0;
`

const StyledCardActions = styled(CardActions)`
  padding-top: 0;
  padding-bottom: 0;
`

export default function ControlCard({
  name,
  primaryContent,
  secondaryContent,
  loading,
}: ControlCardProps) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card>
      <StyledCardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
      />
      {loading ? (
        <CardContent>
          <LinearProgress />
        </CardContent>
      ) : (
        <>
          <StyledCardContent>{primaryContent}</StyledCardContent>
          {secondaryContent && (
            <>
              <StyledCardActions disableSpacing sx={{ justifySelf: 'center' }}>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </StyledCardActions>
            </>
          )}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <StyledCardContent>{secondaryContent}</StyledCardContent>
          </Collapse>
        </>
      )}
    </Card>
  )
}
