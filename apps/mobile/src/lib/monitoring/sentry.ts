import * as Sentry from "@sentry/react-native"

import { sentryOptions } from "@/lib/monitoring/sentry-options"

Sentry.init(sentryOptions)
