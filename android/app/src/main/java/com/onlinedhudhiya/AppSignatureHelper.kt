package com.onlinedhudhiya

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Base64
import android.util.Log
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.util.Arrays

class AppSignatureHelper(private val context: Context) {

    companion object {
        private const val TAG = "DhudhiyaSIG"
        private const val HASH_TYPE = "SHA-256"
        const val NUM_HASHED_BYTES = 9
        const val NUM_BASE64_CHAR = 11
    }

    fun getAppSignatures(): List<String> {
        val appCodes = ArrayList<String>()

        try {
            val packageName = context.packageName
            val pm = context.packageManager

            val packageInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                pm.getPackageInfo(
                    packageName,
                    PackageManager.GET_SIGNING_CERTIFICATES
                )
            } else {
                @Suppress("DEPRECATION")
                pm.getPackageInfo(
                    packageName,
                    PackageManager.GET_SIGNATURES
                )
            }

            val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo.signingInfo?.apkContentsSigners
            } else {
                @Suppress("DEPRECATION")
                packageInfo.signatures
            }

            signatures?.forEach { signature ->
                val hash = hash(packageName, signature.toCharsString())
                hash?.let {
                    appCodes.add(it)
                    Log.d(TAG, "App hash: $it")
                }
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error getting app signatures", e)
        }

        return appCodes
    }

    private fun hash(packageName: String, signature: String): String? {
        return try {
            val appInfo = "$packageName $signature"
            val messageDigest = MessageDigest.getInstance(HASH_TYPE)
            messageDigest.update(appInfo.toByteArray(StandardCharsets.UTF_8))

            val hashSignature = messageDigest.digest()
            val truncated = Arrays.copyOfRange(hashSignature, 0, NUM_HASHED_BYTES)

            val base64Hash = Base64.encodeToString(
                truncated,
                Base64.NO_PADDING or Base64.NO_WRAP
            )

            base64Hash.substring(0, NUM_BASE64_CHAR)

        } catch (e: Exception) {
            Log.e(TAG, "Hash error", e)
            null
        }
    }
}
