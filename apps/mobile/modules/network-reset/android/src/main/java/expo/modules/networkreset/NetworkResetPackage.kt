package expo.modules.networkreset

import android.app.Application
import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import com.facebook.react.modules.network.OkHttpClientProvider
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package
import java.util.concurrent.TimeUnit
import okhttp3.ConnectionPool

/**
 * Keeps React Native's HTTP client from reusing connections that died with a
 * network. When Android moves the default network (for example from cellular
 * to Wi-Fi right after airplane mode ends), a pooled HTTP/2 connection opened
 * on the old network can hang every later request until it times out.
 */
class NetworkResetPackage : Package {
  override fun createApplicationLifecycleListeners(
    context: Context,
  ): List<ApplicationLifecycleListener> = listOf(NetworkResetLifecycleListener())
}

private const val PING_INTERVAL_SECONDS = 5L

private class NetworkResetLifecycleListener : ApplicationLifecycleListener {
  override fun onCreate(application: Application) {
    val context = application.applicationContext
    val pool = ConnectionPool()
    // Runs before React Native creates its networking module, which asks the
    // factory for its client. Pings fail a connection that stopped answering.
    OkHttpClientProvider.setOkHttpClientFactory {
      OkHttpClientProvider.createClientBuilder(context)
        .connectionPool(pool)
        .pingInterval(PING_INTERVAL_SECONDS, TimeUnit.SECONDS)
        .build()
    }
    val connectivity = context.getSystemService(ConnectivityManager::class.java) ?: return
    connectivity.registerDefaultNetworkCallback(
      object : ConnectivityManager.NetworkCallback() {
        private var current: Network? = null

        override fun onAvailable(network: Network) {
          if (current != null && current != network) pool.evictAll()
          current = network
        }

        override fun onLost(network: Network) {
          if (network == current) {
            current = null
            pool.evictAll()
          }
        }
      },
    )
  }
}
