import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MD3Theme, useTheme } from "react-native-paper";
import { ScanText } from "lucide-react-native";

import { RootParamStackList } from "../types/navigation.types";

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

export default function TabCenterButton() {
  // Hooks
  const navigation = useNavigation<NavProps>();
  const theme = useTheme();
  const styles = getStyles(theme);

  // Handlers
  function onPress() {
    navigation.navigate("Tabs", { screen: "Camera" });
  }

  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.customButton}>
        <ScanText size={26} color={theme.colors.onPrimaryContainer} />
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: MD3Theme) => StyleSheet.create({
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryContainer,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});