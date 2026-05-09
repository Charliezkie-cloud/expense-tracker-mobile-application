import { View } from "react-native";
import { Text } from "react-native-paper";

import { containers } from "../styles/containers";

export default function SettingsScreen() {
  return (
    <View style={containers.main}>
      <Text variant="bodyLarge">This is the Settings Screen</Text>
    </View>
  )
}