export interface ShellyRelayControllerProps {
  topicPrefix: string
  name: string
}

export interface ShellyRelayStatusData {
  id: number
  source: string
  output: boolean
  apower: number
  voltage: number
  current: number
  aenergy: {
    total: number
    by_minute: [number]
    minute_ts: number
  }
  temperature: {
    tC: number
    tF: number
  }
}

export enum IN_TOPICS {
  STATUS = 'status/switch:0',
}

export enum OUT_TOPICS {
  GEN_COMMAND = 'shellies/command',
  GET_STATUS = 'status_update',
  SW_COMMAND = 'command/switch:0',
  SW_ON = 'on',
  SW_OFF = 'off',
}
