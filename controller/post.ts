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

router.post("/reguser", async (req, res) => {
  try {
    const db = await conn;

    const { phone, password, Fname, Lname, img } = req.body;

    // ตรวจสอบว่ากรอกข้อมูลครบ
    if (!phone || !password || !Fname || !Lname || !img) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // เช็คว่าเบอร์นี้มีอยู่แล้วหรือยัง
    const existing = await db.get("SELECT * FROM user WHERE phone = ?", [phone]);
    if (existing) {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    // Insert user ใหม่
    const result = await db.run(
      "INSERT INTO user (phone, password, Fname, Lname, img) VALUES (?, ?, ?, ?, ?)",
      [phone, password, Fname, Lname, img]
    );

    res.status(201).json({
      message: "User registered successfully",
      userID: result.lastID, // id ล่าสุดที่ insert ได้
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/regrider", async (req, res) => {
  try {
    const db = await conn;

    const { phone, password, Fname, Lname, img, Veh_img, plate } = req.body;

    // ตรวจสอบ input
    if (!phone || !password || !Fname || !Lname || !img || !Veh_img || !plate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // เช็คว่าเบอร์ซ้ำหรือยัง
    const existing = await db.get("SELECT * FROM rider WHERE phone = ?", [phone]);
    if (existing) {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    // Insert rider ใหม่
    const result = await db.run(
      `INSERT INTO rider (phone, password, Fname, Lname, img, Veh_img, plate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [phone, password, Fname, Lname, img, Veh_img, plate]
    );

    res.status(201).json({
      message: "Rider registered successfully",
      riderID: result.lastID, // id ล่าสุดที่ insert ได้
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});