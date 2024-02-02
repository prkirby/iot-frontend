export interface StringLightsControllerProps {
  topicPrefix: string
  name: string
}

export enum IN_TOPICS {
  LED_STATE = 'ledState',
  LED_DUTY_STATE = 'ledDutyState',
  LED_ANIM_STATE = 'ledAnimState',
  MIN_SIN_DUTY_STATE = 'minSinDutyState',
  MAX_SIN_DUTY_STATE = 'maxSinDutyState',
  ANIM_TIME_STATE = 'animTimeState',
}

export enum OUT_TOPICS {
  LED_ENABLE = 'ledEnable',
  LED_DISABLE = 'ledDisable',
  LED_ANIM_ENABLE = 'ledAnimEnable',
  LED_ANIM_DISABLE = 'ledAnimDisable',
  GET_STATUS = 'getStatus',
  SET_LED_DUTY = 'setLedDuty',
  SET_MIN_SIN_DUTY = 'setMinSinDuty',
  SET_MAX_SIN_DUTY = 'setMaxSinDuty',
  SET_ANIM_TIME = 'setAnimTime',
}
