// dbconnect.ts
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export const conn: Promise<Database<sqlite3.Database, sqlite3.Statement>> =
  open({
    filename: "./deliveryDB.db",
    driver: sqlite3.Database,
  }).then((db) => {
    console.log("✅ Connected to SQLite deliveryDB.db");
    return db;
  });
