package com.safesphere.app.services

import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.safesphere.app.R

class CameraService : Service() {
    private lateinit var camera: CameraDevice

    override fun onCreate() {
        super.onCreate()
        
        // Establish persistent Foreground Service allowing infinite minimal execution tracking
        startForeground(
            1,
            NotificationCompat.Builder(this, "SafeSphereChannel")
                .setContentTitle("SafeSphere Camera Active")
                .setContentText("Monitoring critically in the background")
                .setSmallIcon(R.drawable.ic_camera)
                .build()
        )
        openCamera()
    }

    private fun openCamera() {
        val cameraManager = getSystemService(Context.CAMERA_SERVICE) as CameraManager
        
        // Force the primary wide-angle rear camera
        val cameraId = cameraManager.cameraIdList[0] 
        try {
            cameraManager.openCamera(cameraId, object : CameraDevice.StateCallback() {
                override fun onOpened(cameraDevice: CameraDevice) {
                    camera = cameraDevice
                    // Target ML Kit / Tensor-Flow AI inference pipeline (no UI preview Surface attached natively)
                }
                override fun onDisconnected(cameraDevice: CameraDevice) { 
                    cameraDevice.close() 
                }
                override fun onError(cameraDevice: CameraDevice, error: Int) { 
                    cameraDevice.close() 
                }
            }, null)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
