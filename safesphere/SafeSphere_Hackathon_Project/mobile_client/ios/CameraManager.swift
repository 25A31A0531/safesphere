import Foundation
import AVFoundation
import UIKit

class CameraManager {
    var captureSession: AVCaptureSession?
    var taskID: UIBackgroundTaskIdentifier = .invalid

    func startBackgroundCamera() {
        captureSession = AVCaptureSession()
        
        // Target physical rear optic hardware specifically
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
              let input = try? AVCaptureDeviceInput(device: device) else { return }

        if captureSession?.canAddInput(input) == true {
            captureSession?.addInput(input)
        }

        // Engage continuous stream processing (no UI layer natively attached bridging to views)
        captureSession?.startRunning()

        // Keep hardware pipeline infinitely alive inside background OS scheduling
        taskID = UIApplication.shared.beginBackgroundTask(withName: "SafeSphere.AI.Camera") {
            UIApplication.shared.endBackgroundTask(self.taskID)
            self.taskID = .invalid
        }
    }
    
    func stopBackgroundCamera() {
        captureSession?.stopRunning()
        if taskID != .invalid {
            UIApplication.shared.endBackgroundTask(self.taskID)
            taskID = .invalid
        }
    }
}
