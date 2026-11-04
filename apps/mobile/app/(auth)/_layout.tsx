import { Slot, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Platform, View } from "react-native"

import { Palette as AuthColors } from "@/constants/palette"

export default function AuthLayout() {
  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, backgroundColor: AuthColors.background }}>
        <StatusBar style="dark" />
        <Slot />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: AuthColors.background },
        }}
      />
    </>
  )
}
