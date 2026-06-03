import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Animated, Easing, StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, Text, useTheme } from "react-native-paper";
import { Images, Flashlight, FlashlightOff, LoaderIcon, SwitchCamera } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { logger } from "react-native-logs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import NetInfo from "@react-native-community/netinfo"

import { RootParamStackList } from "../types/navigation.types";
import { ScannedExpense } from "../types/models.types";
import { getCameraStyles } from "../styles/screen-styles";

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

const APP_API_URL = process.env.EXPO_PUBLIC_APP_API_URL ?? "";
const RECEIPT_SCANNER_URL = new URL("receipt-scanner", APP_API_URL);

const log = logger.createLogger();

export default function CameraScreen() {
  // Hooks
  const theme = useTheme();
  const styles = getCameraStyles(theme);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavProps>();
  const insets = useSafeAreaInsets();
  const [permission, reqPermission] = useCameraPermissions();

  // States
  const [flash, setFlash] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [loading, setLoading] = useState(false);

  // Refs
  const cameraRef = useRef<CameraView | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Handlers
  async function takePictureOnPress() {
    if (!cameraRef.current) return;

    const response = await NetInfo.fetch();
    if (!response.isConnected) return Alert.alert("Scan failed. Check your internet and try again.");

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return;

    uploadPicture(photo.uri);
  }

  async function pickImageOnPress() {
    const response = await NetInfo.fetch();
    if (!response.isConnected) return Alert.alert("Scan failed. Check your internet and try again.");

    const { status } = await requestMediaLibraryPermissionsAsync();

    if (status !== "granted")
      return Alert.alert("Error", "We need access to your photos to make this work!");

    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [4, 3],
      quality: 1
    });

    if (result.canceled) return;
    uploadPicture(result.assets[0].uri);
  }

  // Helpers
  async function uploadPicture(photoUri: string) {
    setLoading(true);

    if (!photoUri) return;

    const formData = new FormData();
    const filename = photoUri.split('/').pop() ?? "randomAssPicture";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', { uri: photoUri, name: filename, type: type } as any);
    formData.append("response-type", "json");

    try {
      const response = await fetch(RECEIPT_SCANNER_URL, { method: 'POST', body: formData });
      const result: { data: ScannedExpense[] } = await response.json();

      if (response.ok && result.data.length < 1)
        return Alert.alert("Error", "We couldn't read the photo. Please take a clearer picture.");
      if (response.ok)
        navigation.navigate("AddExpense", result.data);
    } catch (error) {
      log.error({
        error: "uploadPicture(): Something went wrong while scanning the picture, make sure to check your internet connection.",
        details: error instanceof Error ? error.message : String(error)
      });
      Alert.alert("Error", "Scan failed. Check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleFlash() {
    setFlash((current) => !current);
  }

  function toggleFacing() {
    if (facing === "back")
      return setFacing("front");

    setFacing("back");
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  // Use effects
  useEffect(() => {
    if (!isFocused)
      setFlash(false);
  }, [isFocused]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [spinValue]);

  if (!permission) return <View />;

  if (!permission.granted) return (
    <View style={styles.container}>
      <Text variant="bodyLarge" style={styles.message}>We need your permission to show the camera.</Text>
      <Button onPress={reqPermission}>Grant Permission</Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Camera View acts as a full screen background layer */}
      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          enableTorch={flash}
        />
      )}

      {/* Top Container Overlay */}
      <View style={[styles.topContainer, { paddingTop: insets.top + 12 }]}>
        {facing === "back" ? (
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            {flash ? (
              <Flashlight size={24} color="black" />
            ) : (
              <FlashlightOff size={24} color="black" />
            )}
          </TouchableOpacity>
        ) : (<></>)}
      </View>

      {/* Bottom Container Overlay */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 32 }]}>
        <TouchableOpacity style={styles.button} onPress={pickImageOnPress} disabled={loading}>
          <Images size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={[
          styles.button,
          { height: 60, width: 60 },
          loading ? { opacity: 0.5 } : { opacity: 1 }
        ]} onPress={takePictureOnPress} disabled={loading}>
          <Animated.View style={{ transform: [{ rotate: spin }], opacity: loading ? 100 : 0 }}>
            <LoaderIcon size={24} color="black" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={toggleFacing}>
          <SwitchCamera size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}