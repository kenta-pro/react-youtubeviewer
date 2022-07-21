const express = require("express");
const { google } = require("googleapis");
const { readFavoriteIds, writeFavoriteIds } = require("../utils/favorite");

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

router.get("/videos/favorites", (req, res, next) => {
  (async () => {
    const favoriteIds = await readFavoriteIds();
    if (!favoriteIds.length) {
      res.json({ items: [] });
      return;
    }
    const {
      data: { items },
    } = await youtube.videos.list({
      part: "statistics,snippet",
      id: favoriteIds.join(","),
    });
    res.json({ items });
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

router.get("/favorites", (req, res, next) => {
  readFavoriteIds()
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

router
  .route("/favorites/:id")
  .post((req, res, next) => {
    (async () => {
      const { id } = req.params;
      const favoriteIds = await readFavoriteIds();
      if (favoriteIds.indexOf(id) === -1) {
        favoriteIds.unshift(id);
        writeFavoriteIds(favoriteIds);
      }
      res.end();
    })().catch(next);
  })
  .delete((req, res, next) => {
    (async () => {
      const { id } = req.params;
      const favoriteIds = await readFavoriteIds();
      const indexOfId = favoriteIds.indexOf(id);
      if (indexOfId !== -1) {
        writeFavoriteIds(favoriteIds.filter((favoriteId) => favoriteId !== id));
      }
      res.end();
    })().catch(next);
  });

module.exports = router;
