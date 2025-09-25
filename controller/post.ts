import { Router } from "express";
import { conn } from "../dbconnect";
import express from "express";

export const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const db = await conn; //ใช้ connection จาก dbconnect.ts

    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "phone and password are required" });
    }

    //เช็คในตาราง user ก่อน
    const user = await db.get(
      "SELECT * FROM user WHERE phone = ? AND password = ?",
      [phone, password]
    );

    if (user) {
      return res.json({
        role: "user",
        data: user,
      });
    }

    //เช็คใน rider
    const rider = await db.get(
      "SELECT * FROM rider WHERE phone = ? AND password = ?",
      [phone, password]
    );

    if (rider) {
      return res.json({
        role: "rider",
        data: rider,
      });
    }

    //ไม่พบข้อมูลในทั้ง 2 ตาราง
    return res.status(401).json({ error: "Invalid phone or password" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});