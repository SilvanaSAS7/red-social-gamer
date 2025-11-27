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

// Nuevo: función que Home.js importa (createStreamWithSDP)
export const createStreamWithSDP = async (sdp, apiKey) => {
  // Este endpoint debe existir en tu backend y devolver JSON con:
  // { success: true, data: { livepeer_id, answer_sdp, playback_id, stream_key, rtmp_url } }
  const res = await fetch(`${BACKEND_URL}/streams_with_sdp.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sdp, apiKey }),
  });

  const text = await res.text();
  console.log('createStreamWithSDP response text:', text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Respuesta inválida del servidor (createStreamWithSDP): no es JSON. Raw: ' + text.slice(0, 500));
  }

  if (!data.success) {
    throw new Error(data.message || 'Error creando stream via SDP');
  }

  return {
    streamId: data.data.livepeer_id,
    answer: data.data.answer_sdp, // SDP answer from backend/livepeer
    playbackId: data.data.playback_id,
    streamKey: data.data.stream_key,
    rtmpIngestUrl: data.data.rtmp_url,
  };
};

export const deleteStream = async (streamId) => {
  // Si tienes un endpoint en backend para terminar/borrar streams, llámalo aquí.
  // Ejemplo opcional:
  try {
    const res = await fetch(`${BACKEND_URL}/delete_stream.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_id: streamId }),
    });
    const text = await res.text();
    console.log('deleteStream response:', text);
  } catch (e) {
    console.log('deleteStream not implemented or failed, streamId=', streamId, e);
  }
};