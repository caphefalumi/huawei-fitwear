import { ImageManipulator, SaveFormat } from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { Platform } from "react-native"

export type PickedImage = {
  uri: string
  mimeType: "image/webp"
}

// Pickers hand back HEIC, JPEG or PNG; storage and analysis take WebP only.
export async function prepareMealImage(uri: string): Promise<PickedImage> {
  const rendered = await ImageManipulator.manipulate(uri, { maxWidth: 1280 }).renderAsync()
  const saved = await rendered.saveAsync({
    compress: 0.8,
    format: SaveFormat.WEBP,
  })
  return { uri: saved.uri, mimeType: "image/webp" }
}

export async function pickImage(camera: boolean): Promise<PickedImage | null> {
  if (camera && Platform.OS !== "web") {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      throw new Error(
        "Camera permission was denied. Allow camera access in settings or choose a library image.",
      )
    }
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 1,
    allowsEditing: true,
  }
  const result = camera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options)
  if (result.canceled) return null

  return prepareMealImage(result.assets[0].uri)
}
