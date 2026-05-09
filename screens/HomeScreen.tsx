import { View } from "react-native";

import { containers } from "../styles/containers";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View style={containers.main}>

      <Text variant="bodyLarge">Hello world ;D</Text>
    
    </View>
  )
}