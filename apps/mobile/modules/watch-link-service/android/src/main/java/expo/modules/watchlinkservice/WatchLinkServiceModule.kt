package expo.modules.watchlinkservice

import android.content.Intent
import android.os.Build
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WatchLinkServiceModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WatchLinkService")

    Events("onTick")

    OnCreate {
      WatchLinkService.onTick = { sendEvent("onTick", emptyMap<String, Any>()) }
    }

    /** False when Android refuses, for example because the app is already in the background. */
    Function("start") { title: String, text: String ->
      val context = appContext.reactContext ?: return@Function false
      val intent = Intent(context, WatchLinkService::class.java)
        .putExtra(WatchLinkService.EXTRA_TITLE, title)
        .putExtra(WatchLinkService.EXTRA_TEXT, text)
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          context.startForegroundService(intent)
        } else {
          context.startService(intent)
        }
        true
      } catch (error: Exception) {
        Log.w("WatchLinkService", "Could not start", error)
        false
      }
    }

    Function("stop") {
      stopService()
    }

    OnDestroy {
      WatchLinkService.onTick = null
      stopService()
    }
  }

  private fun stopService() {
    val context = appContext.reactContext ?: return
    context.stopService(Intent(context, WatchLinkService::class.java))
  }
}
