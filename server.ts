import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bodyParser from "body-parser";
import { router as test } from "./controller/test"
import { router as post } from "./controller/post"

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.text());

app.use("/test", test);
app.use("/post", post);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});