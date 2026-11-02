const SESSION_KEY = "fitwear.session-token";

export const sessionStorage = {
  async getToken(): Promise<string | null> {
    return typeof window === "undefined" ? null : window.localStorage.getItem(SESSION_KEY);
  },
  async setToken(token: string): Promise<void> {
    window.localStorage.setItem(SESSION_KEY, token);
  },
  async clearToken(): Promise<void> {
    if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
  },
};
