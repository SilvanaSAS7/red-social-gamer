import React from 'react';
import { useParams } from 'react-router-dom';

export default function Watch() {
  const { playbackId } = useParams();
  if (!playbackId) return <div>PlaybackId no proporcionado</div>;
  const hlsUrl = `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`;

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <h2>Ver Directo</h2>
      <p>PlaybackId: {playbackId}</p>
      <video
        controls
        style={{ width: '100%', maxWidth: 900, background: '#000' }}
        src={hlsUrl}
      >
        Tu navegador no soporta vídeo HTML5 con HLS nativo. Si quieres compatibilidad amplia, integra hls.js o el Player oficial de Livepeer.
      </video>
      <p style={{ marginTop: 12 }}><a href={hlsUrl} target="_blank" rel="noreferrer">Abrir HLS directamente</a></p>
    </div>
  );
}
