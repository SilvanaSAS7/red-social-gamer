import React, { useEffect, useState } from 'react';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch('/imagenes/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar manifest');
        return res.json();
      })
      .then((list) => {
        if (mounted) setImages(list);
      })
      .catch((e) => {
        console.warn('Error cargando manifest.json', e);
        if (mounted) setError(e.message || String(e));
      });
    return () => { mounted = false; };
  }, []);

  if (error) return <div style={{ padding: 20, color: 'crimson' }}>Error cargando imágenes: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Galería de Imágenes</h2>
      <p style={{ color: '#666' }}>Imágenes servidas desde <code>/public/imagenes</code>. Usa este componente para vistas previas o catálogos.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
        {images.map((file) => (
          <div key={file} style={{ border: '1px solid #eee', padding: 8, borderRadius: 6, background: '#fff' }}>
            <img
              src={`/imagenes/${file}`}
              alt={file}
              style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4 }}
              loading="lazy"
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#333', wordBreak: 'break-all' }}>{file}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
