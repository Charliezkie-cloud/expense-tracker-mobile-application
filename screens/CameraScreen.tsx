import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, Text } from "react-native-paper";
import { Camera, Images, Flashlight, FlashlightOff } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { logger } from "react-native-logs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { RootParamStackList } from "../types/navigation.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScannedExpense } from "../types/models.types";

type NavProps = NativeStackNavigationProp<RootParamStackList, "Tabs">;

const TEST_API = "https://charlzk.vercel.app/api/receipt-scanner";
const log = logger.createLogger();

export default function CameraScreen() {
  // Hooks
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavProps>();
  const insets = useSafeAreaInsets();
  const [permission, reqPermission] = useCameraPermissions();

  // States
  const [flash, setFlash] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs
  const cameraRef = useRef<CameraView | null>(null);

  // Handlers
  async function takePictureOnPress() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return;

    // uploadPicture(photo.uri);
  }

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
      const response = await fetch(TEST_API, { method: 'POST', body: formData });
      const result: { data: ScannedExpense[] } = await response.json();

      if (response.ok) {
        if (result.data.length < 1) {
          return Alert.alert("Error", "We couldn't read the photo. Please take a clearer picture.");
        }

        navigation.navigate("AddExpense", result.data);
      }
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

  // Helpers
  function toggleFlash() {
    setFlash((current) => !current);
  }

  // Use effects
  useEffect(() => {
    if (!isFocused)
      setFlash(false);
  }, [isFocused]);

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
          facing="back"
          enableTorch={flash}
        />
      )}

      {/* Top Container Overlay */}
      <View style={[styles.topContainer, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
          {flash ? (
            <Flashlight size={24} color="black" />
          ) : (
            <FlashlightOff size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Container Overlay */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 32 }]}>
        <TouchableOpacity style={styles.button} onPress={() => {
          // TEST
          navigation.navigate("AddExpense", [
            {
              name: "Test 1",
              quantity: 1,
              price: 19.20,
            },
            {
              name: "Test 2",
              quantity: 2,
              price: 99.99,
            },
          ]);
        }}>
          <Images size={26} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={[
          styles.button,
          loading ? { opacity: 0.5 } : { opacity: 1 }
        ]} onPress={takePictureOnPress} disabled={loading}>
          <Camera size={26} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    zIndex: 1,
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "white",
  },
  iconButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});