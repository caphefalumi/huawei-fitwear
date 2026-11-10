import { Switch, type SwitchProps } from "react-native"

import { Palette as C } from "@/theme"

/** On/off switch in brand colors: white thumb, grey track when off and accent when on. */
export function Toggle(
  props: Omit<SwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor">,
) {
  return (
    <Switch
      {...props}
      trackColor={{ false: C.track, true: C.accent }}
      thumbColor={C.surface}
      ios_backgroundColor={C.track}
    />
  )
}
