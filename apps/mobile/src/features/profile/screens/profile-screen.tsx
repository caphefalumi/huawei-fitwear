import * as Application from "expo-application"
import { router, type Href } from "expo-router"
import { Platform, StyleSheet, Text, View } from "react-native"

import { Card, PageHeading, Screen } from "@/components/ui"
import { useAuth } from "@/features/auth"
import { useWatchStatus } from "@/features/watch"
import { Palette as C } from "@/theme"

import { MenuGroup, MenuRow } from "../components/menu"
import { NameSheet } from "../components/sheets"
import { useProfileEditor } from "../components/use-profile-editor"

export function ProfileScreen() {
  const watch = useWatchStatus()
  const { user } = useAuth()
  const { openSheet, setOpenSheet, savedMessage, editorProps } = useProfileEditor<"name">()
  const healthProvider = Platform.select({ ios: "Apple Health", android: "Health Connect" })

  return (
    <Screen contentStyle={styles.content}>
      <PageHeading title="Profile" />
      <Card>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.trim()
                .split(/\s+/)
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() ?? "•"}
            </Text>
          </View>
          <View style={styles.user}>
            <Text style={styles.userName}>{user?.name?.trim() || "VoocHealth member"}</Text>
            <Text style={styles.userHandle}>{user?.email ?? ""}</Text>
          </View>
        </View>
        <MenuRow label="Edit name" onPress={() => setOpenSheet("name")} />
      </Card>
      {savedMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.saved}>
          {savedMessage}
        </Text>
      ) : null}

      <MenuGroup title="Health data">
        <MenuRow
          icon={{ ios: "person.text.rectangle", android: "badge", web: "badge" }}
          label="Body & goals"
          onPress={() => router.push("/body-profile")}
        />
        <MenuRow
          icon={{ ios: "dumbbell", android: "fitness_center", web: "fitness_center" }}
          label="Training & recovery"
          onPress={() => router.push("/training")}
        />
        <MenuRow
          icon={{ ios: "chart.bar", android: "bar_chart", web: "bar_chart" }}
          label="My progress"
          onPress={() => router.push("/progress")}
        />
        <MenuRow
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          label="My workouts"
          onPress={() => router.push("/workout-history" as Href)}
        />
      </MenuGroup>

      <MenuGroup title="Devices">
        <MenuRow
          icon={{ ios: "applewatch", android: "watch", web: "watch" }}
          label="VoocHealth watch"
          value={watch.label}
          onPress={() => router.push("/watch")}
        />
      </MenuGroup>

      <MenuGroup title="Other">
        <MenuRow
          icon={{ ios: "gearshape", android: "settings", web: "settings" }}
          label="Settings"
          onPress={() => router.push("/settings")}
        />
        <MenuRow
          icon={{ ios: "lock.shield", android: "shield", web: "shield" }}
          label="Account & privacy"
          onPress={() => router.push("/account-data")}
        />
        <MenuRow
          icon={{ ios: "square.grid.2x2", android: "grid_view", web: "grid_view" }}
          label="Third-party services"
          value={healthProvider}
          onPress={() => router.push("/third-party-services")}
        />
        <MenuRow
          icon={{ ios: "info.circle", android: "info", web: "info" }}
          label="About"
          value={`Version: ${Application.nativeApplicationVersion ?? "web"}`}
        />
      </MenuGroup>

      {openSheet === "name" ? <NameSheet {...editorProps} /> : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 22,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: C.accentTint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "500",
    color: C.accent,
  },
  user: {
    flex: 1,
    gap: 5,
  },
  userName: {
    fontSize: 19,
    fontWeight: "600",
    color: C.text,
  },
  userHandle: {
    fontSize: 12,
    color: C.textMuted,
  },
  saved: { color: C.textMuted, fontSize: 14 },
})
