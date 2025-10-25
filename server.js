const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const RAPIDAPI_HOST = "free-mp3-mp4-youtube.p.rapidapi.com";
// Keep the key secret — Render will provide it from an env var
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

if (!RAPIDAPI_KEY) {
  console.warn("Warning: RAPIDAPI_KEY not set. Set it in Render environment variables.");
}

app.get("/download", async (req, res) => {
  try {
    // Accept video id as query param, default from your example
    const id = req.query.id || "medPORJ8KO0";
    const targetUrl = `https://${RAPIDAPI_HOST}/${id}/MP3/spinner/2196f3/100/box-button/2196f3/tiny-button/Download/FFFFFF/yes/FFFFFF/none`;

    const r = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY
      }
    });

    // stream the response back (or get text if the endpoint returns html)
    const body = await r.text();
    res.status(r.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy fetch failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
