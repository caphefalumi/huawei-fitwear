import { sentryOptions } from "@/lib/monitoring/sentry-options"

test("Sentry omits request, identity, custom context, tags, and breadcrumb content", async () => {
  expect(sentryOptions.sendDefaultPii).toBe(false)
  expect(sentryOptions.tracesSampleRate).toBe(0.2)
  expect(sentryOptions.enableAutoBreadcrumbTracking).toBe(false)
  expect(sentryOptions.enableNetworkBreadcrumbs).toBe(false)
  expect(sentryOptions.enableNetworkEventBreadcrumbs).toBe(false)
  expect(sentryOptions.beforeSend).toBeDefined()
  expect(sentryOptions.beforeBreadcrumb).toBeDefined()
  if (!sentryOptions.beforeSend) throw new Error("Expected the Sentry event scrubber")

  const clean = await sentryOptions.beforeSend(
    {
      request: { url: "https://api.example.test/meals?date=private", data: "food diary" },
      user: { email: "member@example.test" },
      extra: { weight: 60 },
      tags: { meal: "breakfast" },
      contexts: { custom: { health: "private" } },
      breadcrumbs: [
        {
          type: "http",
          level: "info",
          category: "POST /meals?date=private",
          message: "Food diary details",
          data: { meal: "breakfast" },
        },
      ],
    } as never,
    {} as never,
  )

  expect(clean?.request).toBeUndefined()
  expect(clean?.user).toBeUndefined()
  expect(clean?.extra).toBeUndefined()
  expect(clean?.tags).toBeUndefined()
  expect(clean?.contexts).toBeUndefined()
  expect(clean?.breadcrumbs).toEqual([{ type: "http", level: "info" }])
})

test("Sentry breadcrumb hook retains only non-content metadata", () => {
  const beforeBreadcrumb = sentryOptions.beforeBreadcrumb
  expect(beforeBreadcrumb).toBeDefined()
  if (!beforeBreadcrumb) throw new Error("Expected the Sentry breadcrumb scrubber")

  expect(
    beforeBreadcrumb(
      {
        type: "http",
        level: "info",
        category: "POST /meals?date=private",
        message: "Food diary details",
        data: { meal: "breakfast" },
      } as never,
      {} as never,
    ),
  ).toEqual({ type: "http", level: "info" })
})
