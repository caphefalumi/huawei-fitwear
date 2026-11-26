import { act, render, screen } from "@testing-library/react-native"
import { Linking } from "react-native"

import { usePairing } from "../pairing.store"
import { WatchScreen } from "../screens/watch-screen"
import { useWatchStore } from "../store"

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}))
jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(async () => {}),
  NotificationFeedbackType: { Success: "success" },
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }))

beforeEach(() => {
  usePairing.setState({ enabled: false, name: "" })
  useWatchStore.setState({ status: "off", error: null })
})

test("goes from setup to searching to the connected watch's name", async () => {
  await render(<WatchScreen />)
  expect(screen.getByText("Connect watch")).toBeTruthy()
  expect(screen.getByText("Open VoocHealth on your watch")).toBeTruthy()

  await act(() => {
    usePairing.setState({ enabled: true })
    useWatchStore.setState({ status: "searching" })
  })
  expect(screen.getByText("Stop searching")).toBeTruthy()

  await act(() => {
    usePairing.setState({ name: "HUAWEI WATCH 5" })
    useWatchStore.setState({ status: "connected" })
  })
  expect(screen.getByText("HUAWEI WATCH 5")).toBeTruthy()
  expect(screen.getByText("Forget watch")).toBeTruthy()
  expect(screen.queryByText("Open VoocHealth on your watch")).toBeNull()
})

test("offers the settings app when Bluetooth permission is refused", async () => {
  usePairing.setState({ enabled: true })
  useWatchStore.setState({ status: "searching", error: "Bluetooth permissions denied." })
  const open = jest.spyOn(Linking, "openSettings").mockResolvedValue()

  await render(<WatchScreen />)

  expect(screen.getByText("Open settings")).toBeTruthy()
  expect(open).not.toHaveBeenCalled()
})
