import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "fitwear.session-token";

export const sessionStorage = {
  getToken: () => SecureStore.getItemAsync(SESSION_KEY),
  setToken: (token: string) =>
    SecureStore.setItemAsync(SESSION_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  clearToken: () => SecureStore.deleteItemAsync(SESSION_KEY),
};
