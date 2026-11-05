import type * as Sentry from "@sentry/react-native"

type BeforeSend = NonNullable<Parameters<typeof Sentry.init>[0]["beforeSend"]>
type BeforeBreadcrumb = NonNullable<Parameters<typeof Sentry.init>[0]["beforeBreadcrumb"]>

export const scrubSentryEvent: BeforeSend = (event) => {
  event.request = undefined
  event.user = undefined
  event.extra = undefined
  event.tags = undefined
  event.contexts = undefined
  event.breadcrumbs = event.breadcrumbs?.map(({ type, level }) => ({ type, level }))
  return event
}

export const scrubSentryBreadcrumb: BeforeBreadcrumb = (breadcrumb) =>
  breadcrumb ? { type: breadcrumb.type, level: breadcrumb.level } : null

export const sentryOptions: Parameters<typeof Sentry.init>[0] = {
  dsn: "https://6d1373e54757edcbf1d1340fe16def81@o4510546028855296.ingest.us.sentry.io/4510546031542272",
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
  enableAutoBreadcrumbTracking: false,
  enableNetworkBreadcrumbs: false,
  enableNetworkEventBreadcrumbs: false,
  beforeSend: scrubSentryEvent,
  beforeBreadcrumb: scrubSentryBreadcrumb,
}
