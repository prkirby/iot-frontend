interface DeviceData {
  id: string
  name: string
}

export const STRING_LIGHTS_TOPIC_PREFIX = '/LIGHTING'
export enum STRING_LIGHTS_IDS {
  MUSIC_ROOM = 'MUSIC_ROOM',
  LIVING_ROOM = 'LIVING_ROOM',
  DESK_ROOM = 'DESK_ROOM',
}

const enum STRING_LIGHTS_NAMES {
  MUSIC_ROOM = 'MUSIC_ROOM',
  LIVING_ROOM = 'LIVING_ROOM',
  DESK_ROOM = 'DESK_ROOM',
}

export const STRING_LIGHTS_DATA: Array<DeviceData> = [
  {
    id: STRING_LIGHTS_IDS.MUSIC_ROOM,
    name: STRING_LIGHTS_NAMES.MUSIC_ROOM,
  },
  {
    id: STRING_LIGHTS_IDS.LIVING_ROOM,
    name: STRING_LIGHTS_NAMES.LIVING_ROOM,
  },
  {
    id: STRING_LIGHTS_IDS.DESK_ROOM,
    name: STRING_LIGHTS_NAMES.DESK_ROOM,
  },
]

const enum SHELLY_DIMMERS_TOPICS {
  BEDROOM_LIGHT = 'BEDROOM_LIGHT',
}

const enum SHELLY_DIMMERS_NAMES {
  BEDROOM_LIGHT = 'Bedroom Overhead',
}

interface ShellyData extends DeviceData {
  topicPrefix: string
}

export const SHELLY_DIMMERS_DATA: Array<ShellyData> = [
  {
    id: SHELLY_DIMMERS_TOPICS.BEDROOM_LIGHT,
    topicPrefix: SHELLY_DIMMERS_TOPICS.BEDROOM_LIGHT,
    name: SHELLY_DIMMERS_NAMES.BEDROOM_LIGHT,
  },
]

const enum SHELLY_RELAYS_TOPICS {
  BEDROOM_STRINGLIGHT = 'BEDROOM_STRINGLIGHT',
}

const enum SHELLY_RELAYS_NAMES {
  BEDROOM_STRINGLIGHT = 'Bedroom Stringlight',
}
export const SHELLY_RELAYS_DATA: Array<ShellyData> = [
  {
    id: SHELLY_RELAYS_TOPICS.BEDROOM_STRINGLIGHT,
    topicPrefix: SHELLY_RELAYS_TOPICS.BEDROOM_STRINGLIGHT,
    name: SHELLY_RELAYS_NAMES.BEDROOM_STRINGLIGHT,
  },
]
