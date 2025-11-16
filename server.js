import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.NEWS_API_KEY;
const SECRET_KEY = process.env.AUTH_SECRET || "dev_secret_change_me";

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend çalışıyor!" });
});

// Haberleri getiren endpoint
app.get("/api/news", async (req, res) => {
  try {
    const category = req.query.category || "technology";
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
    console.log("Requesting NewsAPI:", url, "API_KEY present:", !!API_KEY);

    const response = await fetch(url);
    console.log("NewsAPI status:", response.status, response.statusText);

    const data = await response.json();
    console.log("NewsAPI response keys:", Object.keys(data || {}));
    if (data && data.articles) {
      console.log("Articles length:", Array.isArray(data.articles) ? data.articles.length : "not array");
      return res.json(data.articles);
    }

    // Eğer articles yoksa hata mesajını logla ve boş dizi dön
    console.warn("NewsAPI returned no articles. Full response:", data);
    return res.json([]);
  } catch (error) {
    console.error("API Hatası:", error);
    return res.status(500).json({ error: "Haber verisi alınamadı." });
  }
});

// ---------- Auth bölümü start ----------
const USERS_FILE = path.resolve(process.cwd(), "users.json");

// users.json yoksa oluştur
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Register
app.post("/auth/register", (req, res) => {
  console.log("POST /auth/register body:", req.body); // <-- ekleyin
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Eksik alan" });

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ message: "Bu e-mail zaten kayıtlı!" });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const newUser = { id: Date.now(), email, password: hashed };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return res.json({ message: "Kayıt başarılı!" });
  } catch (err) {
    console.error("Register hata:", err);
    return res.status(500).json({ message: "Kayıt sırasında hata oluştu" });
  }
});

// Login
app.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Eksik alan" });

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı!" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Şifre yanlış!" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1d" });
    return res.json({ message: "Giriş başarılı", token });
  } catch (err) {
    console.error("Login hata:", err);
    return res.status(500).json({ message: "Giriş sırasında hata oluştu" });
  }
});
// ---------- Auth bölümü end ----------

// Backend'i başlat
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda çalışıyor...`);
});
