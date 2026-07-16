import "dotenv/config";
import express from "express";

// Proxies text-to-speech requests to Spitch (spitch.app) for languages with
// no usable browser/OS voice — Yorùbá, Hausa, Igbo. Keeps SPITCH_API_KEY on
// the server; the frontend never sees it.
const PORT = process.env.TTS_SERVER_PORT || 8787;
const SPITCH_API_KEY = process.env.SPITCH_API_KEY;

const VOICE_BY_LANGUAGE = {
  yo: "sade",
  ha: "amina",
  ig: "ngozi",
};

const app = express();
app.use(express.json());

app.post("/api/tts", async (req, res) => {
  const { text, language } = req.body || {};
  const voice = VOICE_BY_LANGUAGE[language];

  if (!text || !voice) {
    res.status(400).json({ error: "Missing text, or language is not one Spitch is used for." });
    return;
  }
  if (!SPITCH_API_KEY) {
    res.status(500).json({ error: "Server is missing SPITCH_API_KEY." });
    return;
  }

  try {
    const spitchRes = await fetch("https://api.spitch.app/v1/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SPITCH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, language, voice, format: "mp3" }),
    });

    if (!spitchRes.ok) {
      const detail = await spitchRes.text();
      res.status(spitchRes.status).json({ error: "Spitch request failed", detail });
      return;
    }

    const buffer = Buffer.from(await spitchRes.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err) {
    res.status(502).json({ error: "Failed to reach Spitch", detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`TTS proxy listening on http://localhost:${PORT}`);
});
