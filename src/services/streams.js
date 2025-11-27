const express = require('express');
const fetch = require('node-fetch');
const pool = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const LIVEPEER_KEY = process.env.LIVEPEER_API_KEY;

if (!LIVEPEER_KEY) console.warn('WARN: LIVEPEER_API_KEY not set in server .env');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT s.*, u.username FROM streams s LEFT JOIN users u ON s.owner_id = u.id ORDER BY s.created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('streams list', err);
    res.status(500).json({ error: 'internal' });
  }
});

// Create stream + exchange SDP. Protected.
router.post('/', auth, async (req, res) => {
  try {
    if (!LIVEPEER_KEY) return res.status(500).json({ error: 'server_missing_livepeer_key' });
    const { sdp, title } = req.body;
    if (!sdp) return res.status(400).json({ error: 'missing_sdp' });

    // 1) create stream on Livepeer Studio
    const createResp = await fetch('https://livepeer.studio/api/streams', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LIVEPEER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: title || `live-${Date.now()}`, mp4: false }),
    });
    const createText = await createResp.text();
    if (!createResp.ok) {
      console.error('create stream failed', createResp.status, createText);
      return res.status(502).json({ error: 'create_failed', body: createText });
    }
    const createData = JSON.parse(createText);
    const livepeerId = createData.id;
    const playbackId = createData.playbackId || createData.stream?.playbackId;

    // 2) exchange SDP
    const sdpResp = await fetch(`https://livepeer.studio/api/streams/${livepeerId}/webrtc`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${LIVEPEER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'offer', sdp }),
    });
    const sdpText = await sdpResp.text();
    if (!sdpResp.ok) {
      // cleanup
      await fetch(`https://livepeer.studio/api/streams/${livepeerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${LIVEPEER_KEY}` },
      }).catch(() => {});
      console.error('sdp exchange failed', sdpResp.status, sdpText);
      return res.status(502).json({ error: 'sdp_failed', body: sdpText });
    }
    let answer = sdpText;
    try { const j = JSON.parse(sdpText); answer = j.sdp || j.answer || sdpText; } catch {}

    // 3) persist stream in DB
    const [result] = await pool.query(
      'INSERT INTO streams (livepeer_id, playback_id, owner_id, title, status, rtmp_ingest_url, stream_key) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [livepeerId, playbackId || null, req.user.id, title || null, 'active', createData.rtmpIngestUrl || null, createData.streamKey || null]
    );
    const streamId = result.insertId;

    res.json({ id: streamId, livepeer_id: livepeerId, playback_id: playbackId, answer });
  } catch (err) {
    console.error('streams create', err);
    res.status(500).json({ error: 'internal', details: String(err) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT s.*, u.username FROM streams s LEFT JOIN users u ON s.owner_id = u.id WHERE s.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('streams get', err);
    res.status(500).json({ error: 'internal' });
  }
});

// delete stream (protected) - deletes on Livepeer and updates DB
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM streams WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    const stream = rows[0];
    // only owner can delete (basic check)
    if (stream.owner_id !== req.user.id) return res.status(403).json({ error: 'forbidden' });

    if (stream.livepeer_id && LIVEPEER_KEY) {
      await fetch(`https://livepeer.studio/api/streams/${stream.livepeer_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${LIVEPEER_KEY}` },
      }).catch(() => {});
    }
    await pool.query('UPDATE streams SET status = ?, stopped_at = NOW() WHERE id = ?', ['stopped', id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('streams delete', err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;