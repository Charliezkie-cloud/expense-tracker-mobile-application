import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  color?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function HorizontalLine({ color = "#6b7280", label, style }: Props) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
        },
        label ? { gap: 14 } : { },
        style
      ]}
    >
      {label && (
        <>
          <View style={{
            flex: 1,
            height: StyleSheet.hairlineWidth,
            backgroundColor: color
          }} />
          <Text variant="bodyMedium" style={{ color }}>{label}</Text>
        </>
      )}
      <View style={{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: color
      }} />
    </View>
  )
}