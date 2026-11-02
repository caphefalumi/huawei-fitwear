import { isLoggedIn } from "@/features/auth/helpers/is-logged-in";

test("only treats token-bearing sessions that expire after now as logged in", () => {
  const active = {
    id: "session-a",
    token: "token-a",
    userId: "member-a",
    expiresAt: new Date(2_000).toISOString(),
  };

  expect(isLoggedIn(active, 1_000)).toBe(true);
  expect(isLoggedIn({ ...active, token: "" }, 1_000)).toBe(false);
  expect(isLoggedIn({ ...active, expiresAt: new Date(1_000).toISOString() }, 1_000)).toBe(false);
  expect(isLoggedIn({ ...active, expiresAt: "invalid" }, 1_000)).toBe(false);
});
