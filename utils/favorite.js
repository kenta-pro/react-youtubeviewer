const fs = require("fs");

const FAVORITE_IDS_FILE = "./favoriteIds.json";

module.exports.readFavoriteIds = () =>
  new Promise((resolve, reject) => {
    fs.readFile(FAVORITE_IDS_FILE, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data ? JSON.parse(data) : []);
    });
  });

module.exports.writeFavoriteIds = (favoriteIds) =>
  new Promise((resolve, reject) => {
    fs.writeFile(FAVORITE_IDS_FILE, JSON.stringify(favoriteIds), (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
