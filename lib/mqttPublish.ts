import { MqttContextType } from './MqttContext'

export default function publish({
  mqttContext,
  topic,
  value,
}: {
  mqttContext?: MqttContextType
  topic: string
  value: any
}) {
  const client = mqttContext?.clientRef.current

  if (!client) {
    console.log(`(${topic}) Cannot publish, mqttClient: `, client)
    return false
  }

  client.publish(topic, value)
}
