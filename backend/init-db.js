const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite3');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)", (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("Users table created or already exists");
    }
  });
});

db.serialize(() => {
  // Erstellt die tickets-Tabelle, falls sie nicht existiert
  db.run(`
 CREATE TABLE IF NOT EXISTS tickets (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER,
   superzahl INTEGER,
   hasSuperzahl BOOLEAN,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
`, (err) => {
    if (err) {
      console.error("Error creating tickets table:", err.message);
    } else {
      console.log("Tickets table created or already exists");
    }
  });

  // Erstellt die fields-Tabelle, falls sie nicht existiert
  db.run(`
 CREATE TABLE IF NOT EXISTS fields (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   ticket_id INTEGER,
   numbers TEXT,
   FOREIGN KEY(ticket_id) REFERENCES tickets(id)
 );
`, (err) => {
    if (err) {
      console.error("Error creating fields table:", err.message);
    } else {
      console.log("Fields table created or already exists");
    }
  });
});
db.close();
