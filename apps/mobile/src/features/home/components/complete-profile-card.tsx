import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { Button } from "@/components/ui"
import { Palette as C } from "@/theme"

/** Shown instead of targets while the profile is missing details a target needs. */
export function CompleteProfileCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">
        Complete profile
      </Text>
      <Text style={styles.body}>Complete your profile to see your customized dashboard.</Text>
      <Button
        label="Complete profile"
        onPress={() => router.push("/profile")}
        accessibilityLabel="Complete profile"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.accentTint,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: C.text,
  },
})
