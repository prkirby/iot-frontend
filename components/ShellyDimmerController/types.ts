export interface ShellyDimmerControllerProps {
  topicPrefix: string
  name: string
}

export interface ShellyDimmerControllerData {
  id: number
  source: string
  output: boolean
  brightness: number
}

export enum IN_TOPICS {
  STATUS = 'status/light:0',
}

export enum OUT_TOPICS {
  GEN_COMMAND = 'shellies/command',
  GET_STATUS = 'status_update',
  DIMMER_COMMAND = 'rpc',
  SW_ON = 'turnontopic',
  SW_OFF = 'turnofftopic',
  SW_DIM = 'brightnesstopic',
  LIGHT_METHOD = 'Light.set',
}
