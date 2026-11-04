import { Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"

export type PickedImage = {
  uri: string
  base64: string
  mimeType: "image/jpeg" | "image/png"
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
    base64: true,
    quality: 0.7,
    allowsEditing: true,
  }
  const result = camera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options)
  if (result.canceled) return null

  const asset = result.assets[0]
  if (!asset.base64) throw new Error("Could not read this image. Choose another JPEG or PNG.")
  const mimeType = asset.base64.startsWith("/9j/")
    ? "image/jpeg"
    : asset.base64.startsWith("iVBOR")
      ? "image/png"
      : null
  if (!mimeType) throw new Error("Choose a JPEG or PNG image.")
  if (asset.base64.length > 7_000_000) {
    throw new Error("This image is too large. Crop it or choose a smaller photo (under 5 MB).")
  }

  return { uri: asset.uri, base64: asset.base64, mimeType }
}
