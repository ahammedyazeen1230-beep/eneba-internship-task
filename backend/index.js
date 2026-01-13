const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve frontend public files (so /images/... works)
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Database path
const dbPath = path.join(__dirname, "games.db");
const db = new sqlite3.Database(dbPath);

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          old_price REAL,
          discount_pct INTEGER DEFAULT 0,
          image_url TEXT NOT NULL,
          platform TEXT NOT NULL,
          region TEXT NOT NULL
        )
        `,
        (err) => {
          if (err) return reject(err);

          db.run(`DELETE FROM games`, (err2) => {
            if (err2) return reject(err2);

            const stmt = db.prepare(
              `INSERT INTO games (name, price, old_price, discount_pct, image_url, platform, region)
               VALUES (?, ?, ?, ?, ?, ?, ?)`
            );

            // Split Fiction
            stmt.run("Split Fiction", 34.14, 42.0, 19, "/images/splitfiction.jpg", "XBOX", "EUROPE");
            stmt.run("Split Fiction", 35.15, 44.0, 20, "/images/splitfiction.jpg", "XBOX", "GLOBAL");
            stmt.run("Split Fiction", 36.25, 36.25, 0, "/images/splitfiction.jpg", "NINTENDO", "EUROPE");

            // FIFA 23
            stmt.run("FIFA 23", 29.99, 59.99, 50, "/images/fifa23.jpg", "PS5", "GLOBAL");
            stmt.run("FIFA 23", 27.49, 49.99, 45, "/images/fifa23.jpg", "PC", "EUROPE");

            // Red Dead Redemption 2
            stmt.run("Red Dead Redemption 2", 39.99, 59.99, 33, "/images/rdr2.jpg", "PC", "GLOBAL");

            stmt.finalize((err3) => {
              if (err3) return reject(err3);
              console.log("✅ DB ready (seeded with discounts)");
              resolve();
            });
          });
        }
      );
    });
  });
}

// API
app.get("/list", (req, res) => {
  const search = (req.query.search || "").toLowerCase();

  let sql = `
    SELECT id, name, price, old_price, discount_pct, image_url, platform, region
    FROM games
  `;
  let params = [];

  if (search) {
    sql += ` WHERE LOWER(name) LIKE ? OR LOWER(platform) LIKE ? OR LOWER(region) LIKE ?`;
    params = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("❌ Failed to init DB:", e.message);
    process.exit(1);
  });
