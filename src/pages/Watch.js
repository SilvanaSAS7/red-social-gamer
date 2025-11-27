import React from 'react';
import { useParams } from 'react-router-dom';

export default function Watch() {
  const { playbackId } = useParams();
  if (!playbackId) return <div>PlaybackId not provided</div>;
  const castrPlayerUrl = `https://player.castr.com/live_${playbackId}`;

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <h2>Watch Live Stream</h2>
      <p>PlaybackId: {playbackId}</p>
      <iframe 
        src={castrPlayerUrl}
        width="100%" 
        style={{aspectRatio: "16/9", minHeight: "340px"}} 
        frameBorder="0" 
        scrolling="no" 
        allow="autoplay" 
        allowFullScreen 
        webkitallowfullscreen 
        mozallowfullscreen 
        oallowfullscreen 
        msallowfullscreen
      ></iframe>
    </div>
  );
}
