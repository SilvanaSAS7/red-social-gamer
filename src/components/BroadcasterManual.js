import React, { useState, useRef, useEffect } from 'react';
import * as castrService from '../services/castrService';
import { useStream } from '../context/StreamContext';

const BroadcasterManual = () => {
  const [streamName, setStreamName] = useState('');
  const [region, setRegion] = useState('US-West');
  const [streamInfo, setStreamInfo] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [previewOn, setPreviewOn] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const { startStream, stopStream } = useStream();

  useEffect(() => {
    // Cuando el componente se desmonte, detiene la notificación del stream
    return () => {
      if (streamInfo) { // Solo si se creó un stream
        stopStream();
      }
    };
  }, [streamInfo, stopStream]);

  const startPreview = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setMediaStream(stream);
      setPreviewOn(true);
    } catch (err) {
      setError('Could not access camera/microphone: ' + err.message);
    }
  };

  const stopPreview = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      setMediaStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setPreviewOn(false);
  };

  const createStream = async () => {
    setError(null);
    try {
      const stream = await castrService.createStream(streamName, region);
      setStreamInfo(stream);
      startStream(stream.id);
    } catch (err) {
      setError('Failed to create stream: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Start Live Stream with Castr.io</h1>

      <section style={{ marginBottom: 16 }}>
        <label>Stream Name</label>
        <input value={streamName} onChange={e => setStreamName(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
      </section>

      <section style={{ marginBottom: 16 }}>
        <label>Region</label>
        <select value={region} onChange={e => setRegion(e.target.value)} style={{ display: 'block', marginTop: 6 }}>
          <option value="US-West">US-West</option>
          <option value="US-East">US-East</option>
          <option value="EU-West">EU-West</option>
          <option value="Asia-Pacific">Asia-Pacific</option>
        </select>
      </section>

      <section style={{ marginBottom: 16 }}>
        <button onClick={startPreview} disabled={previewOn} style={{ marginRight: 8 }}>Start Preview</button>
        <button onClick={stopPreview} disabled={!previewOn} style={{ marginRight: 8 }}>Stop Preview</button>
        <button onClick={createStream} style={{ marginLeft: 8 }}>Create Stream</button>
      </section>

      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', background: '#000' }} />
        </div>
        <div style={{ width: 420 }}>
          <h3>Stream Information</h3>
          {!streamInfo && <div style={{ color: '#666' }}>Stream information will appear here once the stream is created.</div>}
          {streamInfo && (
            <div>
              <p><strong>ID:</strong> {streamInfo.id}</p>
              <p><strong>RTMP URL:</strong><br /> {streamInfo.rtmp_url}</p>
              <p><strong>Stream Key:</strong><br /><code style={{ wordBreak: 'break-all' }}>{streamInfo.stream_key}</code></p>
              <p><strong>Playback URL:</strong><br /> <a href={streamInfo.playback_url} target="_blank" rel="noreferrer">{streamInfo.playback_url}</a></p>
              <p><strong>Watch Stream:</strong><br /> <a href={`/watch/${streamInfo.id}`} target="_blank" rel="noreferrer">{`/watch/${streamInfo.id}`}</a></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcasterManual;