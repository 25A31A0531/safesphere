import { useState, useEffect, useRef } from 'react';

export default function CameraAI({ onDetection }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | requesting | active | error
  const [detections, setDetections] = useState([]);
  const [frameCount, setFrameCount] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelStatus, setModelStatus] = useState('');
  const modelRef = useRef(null);
  const streamRef = useRef(null);
  const animRef = useRef(null);

  const loadModel = async () => {
    setModelStatus('Loading TensorFlow model...');
    try {
      const tf = await import('@tensorflow/tfjs');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      await tf.ready();
      modelRef.current = await cocoSsd.load();
      setModelLoaded(true);
      setModelStatus('Model ready');
    } catch (e) {
      setModelStatus('Model failed to load');
      console.error(e);
    }
  };

  const startCamera = async () => {
    setStatus('requesting');
    if (!modelLoaded) await loadModel();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('active');
        runDetection();
      }
    } catch (e) {
      setStatus('error');
      console.error(e);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setStatus('idle');
    setDetections([]);
  };

  const runDetection = async () => {
    if (!videoRef.current || !modelRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const detect = async () => {
      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const preds = await modelRef.current.detect(video);
          setDetections(preds);
          setFrameCount(f => f + 1);

          // Draw bounding boxes
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          preds.forEach(p => {
            const [x, y, w, h] = p.bbox;
            const isHighRisk = ['person', 'car', 'fire', 'smoke'].includes(p.class);
            ctx.strokeStyle = isHighRisk ? '#ef4444' : '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = isHighRisk ? 'rgba(239,68,68,0.8)' : 'rgba(59,130,246,0.8)';
            ctx.fillRect(x, y - 22, p.class.length * 8 + 60, 22);
            ctx.fillStyle = 'white';
            ctx.font = '13px Inter, sans-serif';
            ctx.fillText(`${p.class} ${Math.round(p.score * 100)}%`, x + 4, y - 5);
          });

          // Fire heuristic: if very bright warm pixels dominate
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let firePixels = 0;
          for (let i = 0; i < imgData.length; i += 16) {
            const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
            if (r > 200 && g > 80 && b < 80) firePixels++;
          }
          if (firePixels > 800 && onDetection) {
            onDetection({ event_type: 'Fire detected (Camera AI)', severity: 'Critical', area_name: 'Camera View', timestamp_utc: new Date().toISOString() });
          }
        } catch {}
      }
      animRef.current = requestAnimationFrame(detect);
    };
    detect();
  };

  useEffect(() => () => stopCamera(), []);

  const RISK_CLASSES = ['person', 'car', 'truck', 'bus', 'motorcycle', 'bicycle', 'fire', 'smoke'];

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div className="card-title">Camera AI Detection</div>
          <div className="card-subtitle">TensorFlow.js COCO-SSD Object Detection</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`status-dot ${status === 'active' ? 'online' : status === 'error' ? 'danger' : 'offline'}`} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'capitalize' }}>{status === 'requesting' ? 'Starting...' : status}</span>
        </div>
      </div>

      {/* Video/Canvas area */}
      <div style={{ position: 'relative', background: 'rgba(0,0,0,0.5)', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', marginBottom: 16 }}>
        <video ref={videoRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: status === 'active' ? 1 : 0 }} muted playsInline />
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: status === 'active' ? 'block' : 'none' }} />

        {status !== 'active' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: '3rem' }}>{status === 'error' ? '❌' : '📷'}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              {status === 'error' ? 'Camera access denied' : status === 'requesting' ? 'Requesting camera...' : 'Camera is off'}
            </span>
            {modelStatus && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{modelStatus}</span>}
          </div>
        )}

        {status === 'active' && (
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px' }}>
            <span className="status-dot danger" />
            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>LIVE</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>Frame #{frameCount}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {status === 'active' ? (
          <button className="btn btn-secondary btn-full" onClick={stopCamera}>⏹ Stop Camera</button>
        ) : (
          <button className="btn btn-primary btn-full" onClick={startCamera} disabled={status === 'requesting'}>
            {status === 'requesting' ? <><span className="spinner" /> Loading AI...</> : '▶ Start Camera AI'}
          </button>
        )}
      </div>

      {/* Detections */}
      {detections.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Detected Objects ({detections.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {detections.map((d, i) => {
              const risk = RISK_CLASSES.includes(d.class);
              return (
                <span key={i} className={`badge ${risk ? 'badge-orange' : 'badge-blue'}`}>
                  {d.class} {Math.round(d.score * 100)}%
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}