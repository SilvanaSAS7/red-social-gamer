const BACKEND_URL = 'http://localhost/dravora-api'; // XAMPP: carpeta en htdocs

export const createStream = async (streamName, ownerId) => {
  const res = await fetch(`${BACKEND_URL}/streams.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: streamName, owner_id: ownerId }),
  });

  const text = await res.text();
  // Log para depurar respuestas HTML/errores
  console.log('createStream response text:', text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Respuesta inválida del servidor: no es JSON. Revisar backend. Raw: ' + text.slice(0, 500));
  }

  if (!data.success) {
    throw new Error(data.message || 'Error creando stream');
  }

  return {
    streamId: data.data.livepeer_id,
    playbackId: data.data.playback_id,
    streamKey: data.data.stream_key,
    rtmpIngestUrl: data.data.rtmp_url,
  };
};

export const deleteStream = async (streamId) => {
  // Implementar si tienes endpoint para borrar/terminar en backend
  console.log('deleteStream not implemented, streamId=', streamId);
};