import { Router } from "express";
import { conn } from "../dbconnect";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await conn;
    const rows = await db.all("SELECT * FROM User"); 
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
