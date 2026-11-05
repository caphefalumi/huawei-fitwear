import * as Sentry from "@sentry/react-native"

Sentry.init({
  dsn: "https://6d1373e54757edcbf1d1340fe16def81@o4510546028855296.ingest.us.sentry.io/4510546031542272",
  tracesSampleRate: 0.2,
  sendDefaultPii: false,
})
