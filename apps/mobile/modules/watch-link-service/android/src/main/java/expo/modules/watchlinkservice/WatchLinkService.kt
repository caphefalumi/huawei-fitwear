package expo.modules.watchlinkservice

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log

/**
 * Keeps the process alive while the watch link is in use, so Bluetooth events still reach
 * JavaScript in the background. JavaScript timers are paused there, so this also ticks.
 */
class WatchLinkService : Service() {
  private val handler = Handler(Looper.getMainLooper())
  private val tick = object : Runnable {
    override fun run() {
      onTick?.invoke()
      handler.postDelayed(this, TICK_MS)
    }
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    try {
      val notification = notification(
        intent?.getStringExtra(EXTRA_TITLE).orEmpty(),
        intent?.getStringExtra(EXTRA_TEXT).orEmpty(),
      )
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        startForeground(
          NOTIFICATION_ID,
          notification,
          ServiceInfo.FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE,
        )
      } else {
        startForeground(NOTIFICATION_ID, notification)
      }
      handler.removeCallbacks(tick)
      handler.postDelayed(tick, TICK_MS)
    } catch (error: Exception) {
      Log.w(TAG, "Could not run in the foreground", error)
      stopSelf()
    }
    // Without the app's JavaScript there is nothing to keep alive, so never restart.
    return START_NOT_STICKY
  }

  override fun onTaskRemoved(rootIntent: Intent?) {
    stopSelf()
  }

  override fun onDestroy() {
    handler.removeCallbacks(tick)
    super.onDestroy()
  }

  private fun notification(title: String, text: String): Notification {
    val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      getSystemService(NotificationManager::class.java).createNotificationChannel(
        NotificationChannel(CHANNEL_ID, title, NotificationManager.IMPORTANCE_LOW),
      )
      Notification.Builder(this, CHANNEL_ID)
    } else {
      @Suppress("DEPRECATION")
      Notification.Builder(this)
    }
    packageManager.getLaunchIntentForPackage(packageName)?.let {
      builder.setContentIntent(
        PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE),
      )
    }
    return builder
      .setContentTitle(title)
      .setContentText(text)
      .setSmallIcon(applicationInfo.icon)
      .setOngoing(true)
      .build()
  }

  companion object {
    const val EXTRA_TITLE = "title"
    const val EXTRA_TEXT = "text"
    private const val TAG = "WatchLinkService"
    private const val CHANNEL_ID = "watch-link"
    private const val NOTIFICATION_ID = 4701
    private const val TICK_MS = 6000L

    @Volatile
    var onTick: (() -> Unit)? = null
  }
}
