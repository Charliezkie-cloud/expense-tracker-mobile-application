import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Animated, Easing, StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, Portal, Text, useTheme, Modal, List } from "react-native-paper";
import { Images, Flashlight, FlashlightOff, LoaderIcon, SwitchCamera } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { logger } from "react-native-logs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { fetch as fetchNet } from "@react-native-community/netinfo"

import { RootParamStackList } from "../types/navigation.types";
import { ScannedExpense } from "../types/models.types";
import { getCameraStyles } from "../styles/screen-styles";
import { useSettingsStore } from "../hooks/useSettingsStore";

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

const APP_API_URL = process.env.EXPO_PUBLIC_APP_API_URL ?? "";
const RECEIPT_SCANNER_URL = new URL("receipt-scanner", APP_API_URL);

const log = logger.createLogger();

export default function CameraScreen() {
  // Hooks
  const settings = useSettingsStore((state) => state.settings);
  const setGeminiAIConsent = useSettingsStore((state) => state.setGeminiAIConsent);
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
  const [aiConsentModal, setAIConsentModal] = useState(true);

  // Refs
  const cameraRef = useRef<CameraView | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Handlers
  async function takePictureOnPress() {
    if (!settings.geminiAIConsent) return toggleAIConsentModal();
    if (!cameraRef.current) return;

    const response = await fetchNet();
    if (!response.isConnected) return Alert.alert("Scan failed. Check your internet and try again.");

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return;

    uploadPicture(photo.uri);
  }

  async function pickImageOnPress() {
    if (!settings.geminiAIConsent) return toggleAIConsentModal();

    const response = await fetchNet();
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

  function aiConsentAgreeOnPress() {
    setGeminiAIConsent(true);
  }

  // Helpers
  async function uploadPicture(photoUri: string) {
    if (!settings.geminiAIConsent) return toggleAIConsentModal();

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
      Alert.alert("Error", "Server capacity reached. Please try again in a few seconds.");
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

  function toggleAIConsentModal() {
    setAIConsentModal(prev => !prev);
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

  useEffect(() => {
    setAIConsentModal(!settings.geminiAIConsent);
  }, [settings]);

  if (!permission) return <View />;

  if (!permission.granted) return (
    <View style={[ styles.container, { justifyContent: 'center', alignItems: 'center' } ]}>
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

      {/*Privacy notice modal*/}
      <Portal>
        <Modal
          visible={aiConsentModal}
          dismissable={false}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            AI Receipt Scanner Privacy Notice
          </Text>

          <Text variant="bodyMedium" style={styles.modalText}>
            To automatically fill in your expense details, this feature uses Google's Gemini AI.
          </Text>

          <Text variant="bodyMedium" style={styles.modalText}>
            Your receipt image is sent directly to Google to extract text.
            Because this app utilizes a free API tier, Google may retain this data to train and improve their models.
          </Text>

          <Text variant="bodyMedium" style={[ styles.modalText, { fontStyle: "italic" }]}>
            Note: Since this feature runs on the free version of the Gemini API,
            you may occasionally experience slower response times or temporary scanning issues depending on server traffic.
            I apologize for the inconvenience, as I am currently a broke developer doing my best to keep this app free for you! :(
          </Text>

          <Text variant="bodyMedium" style={styles.modalDangerText}>
            Please avoid scanning receipts containing highly sensitive personal information.
          </Text>

          <View style={{ gap: 8, marginTop: 12 }}>
            <Button
              mode="contained"
              labelStyle={{ fontWeight: "700" }}
              onPress={aiConsentAgreeOnPress}
            >
              I Agree
            </Button>
            <Button
              mode="text"
              labelStyle={{ fontWeight: "600" }}
              onPress={toggleAIConsentModal}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}