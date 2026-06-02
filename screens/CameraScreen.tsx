import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, Text } from "react-native-paper";
import { Camera, Images, Flashlight, FlashlightOff } from "lucide-react-native";
import { useRef, useState } from "react";
import { logger } from "react-native-logs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TEST_API = "https://charlzk.vercel.app/api/receipt-scanner";
const log = logger.createLogger();

export default function CameraScreen() {
  // Hooks
  const insets = useSafeAreaInsets();
  const [permission, reqPermission] = useCameraPermissions();

  // States
  const [flash, setFlash] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  // Handlers
  function toggleFlash() {
    setFlash((current) => !current);
  }

  async function takePictureOnPress() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return;
    uploadPicture(photo.uri);
  }

  async function uploadPicture(photoUri: string) {
    if (!photoUri) return;
    const formData = new FormData();
    const filename = photoUri.split('/').pop() ?? "randomAssPicture";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', { uri: photoUri, name: filename, type: type } as any);
    formData.append("response-type", "json");

    try {
      const response = await fetch(TEST_API, { method: 'POST', body: formData });
      const result = await response.json();
      alert('Upload Successful!');
    } catch (error) {
      log.error({ error: "Upload failed", details: error });
      alert('Upload failed.');
    }
  }

  if (!permission) return <View />;

  if (!permission.granted) return (
    <View style={styles.container}>
      <Text variant="bodyLarge" style={styles.message}>We need your permission to show the camera.</Text>
      <Button onPress={reqPermission}>Grant Permission</Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" enableTorch={flash}>

        <View style={[styles.topContainer, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            {flash ? (
              <Flashlight size={24} color="black" />
            ) : (
              <FlashlightOff size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 32 }]}>
          <TouchableOpacity style={styles.button}>
            <Images size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePictureOnPress}>
            <Camera size={26} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 32,
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