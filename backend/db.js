const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "games.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image_url TEXT NOT NULL,
      platform TEXT NOT NULL,
      region TEXT NOT NULL
    )
  `);

  db.run(`DELETE FROM games`);

  const stmt = db.prepare(`
    INSERT INTO games (name, price, image_url, platform, region)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Split Fiction
  stmt.run(
    "Split Fiction",
    34.14,
    "https://cdn.cloudflare.steamstatic.com/steam/apps/2001120/library_600x900_2x.jpg",
    "XBOX",
    "EUROPE"
  );

  stmt.run(
    "Split Fiction",
    35.15,
    "https://cdn.cloudflare.steamstatic.com/steam/apps/2001120/library_600x900_2x.jpg",
    "XBOX",
    "GLOBAL"
  );

  stmt.run(
    "Split Fiction",
    36.25,
    "https://cdn.cloudflare.steamstatic.com/steam/apps/2001120/library_600x900_2x.jpg",
    "NINTENDO",
    "EUROPE"
  );

  // FIFA 23
  stmt.run(
    "FIFA 23",
    29.99,
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/library_600x900.jpg",
    "PS5",
    "GLOBAL"
  );

  stmt.run(
    "FIFA 23",
    27.49,
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/library_600x900.jpg",
    "PC",
    "EUROPE"
  );

  // Red Dead Redemption 2
  stmt.run(
    "Red Dead Redemption 2",
    39.99,
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900_2x.jpg",
    "PC",
    "GLOBAL"
  );

  stmt.finalize();
  console.log("✅ Database recreated with real images");
});

db.close();
