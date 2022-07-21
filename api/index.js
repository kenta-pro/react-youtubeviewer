const express = require("express");
const { google } = require("googleapis");

const { YOUTUBE_API_KEY } = process.env;

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_API_KEY,
});

const router = express.Router();

router.get("/videos/search/:keyword", (req, res, next) => {
  const { keyword } = req.params;
  const { pageToken } = req.query;
  (async () => {
    const {
      data: { items: idItems, nextPageToken },
    } = await youtube.search.list({
      part: "id",
      q: keyword,
      type: "video",
      maxResults: 20,
      pageToken,
    });
    const ids = idItems.map(({ id: { videoId } }) => videoId);
    const {
      data: { items },
    } = await youtube.videos.list({
      part: "statistics,snippet",
      id: ids.join(","),
    });
    res.json({ items, nextPageToken });
  })().catch(next);
});

router.get("/videos/:videoId", (req, res, next) => {
  const { videoId } = req.params;
  (async () => {
    const {
      data: { items },
    } = await youtube.videos.list({
      part: "statistics,snippet",
      id: videoId,
    });
    res.json(items[0]);
  })().catch(next);
});

router.get("/videos/:videoId/related", (req, res, next) => {
  const { videoId: relatedToVideoId } = req.params;
  const { pageToken } = req.query;
  (async () => {
    const {
      data: { items: idItems, nextPageToken },
    } = await youtube.search.list({
      part: "id",
      relatedToVideoId,
      type: "video",
      maxResults: 20,
      pageToken,
    });
    const ids = idItems.map(({ id: { videoId } }) => videoId);
    const {
      data: { items },
    } = await youtube.videos.list({
      part: "statistics,snippet",
      id: ids.join(","),
    });
    res.json({ items, nextPageToken });
  })().catch(next);
});

module.exports = router;
