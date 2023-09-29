import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MqttProvider from '../lib/MqttContext'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MqttProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </MqttProvider>
  )
}
