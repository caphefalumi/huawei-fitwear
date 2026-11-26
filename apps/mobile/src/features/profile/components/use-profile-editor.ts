import { useState } from "react"
import { AccessibilityInfo } from "react-native"

/** Which editor sheet is open on a profile screen, and the confirmation after saving. */
export function useProfileEditor<Sheet extends string>() {
  const [openSheet, setOpenSheet] = useState<Sheet | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const editorProps = {
    visible: true,
    onClose: () => setOpenSheet(null),
    onSaved: () => {
      setSavedMessage("Profile updated.")
      void AccessibilityInfo.announceForAccessibility("Profile updated.")
    },
  }
  return { openSheet, setOpenSheet, savedMessage, editorProps }
}
