import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const CLIENT_ID = "152575177583-bl027gj86q96nuru4uart85jtseeg0db.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Set this in Render environment variables
const REDIRECT_URI = "https://youtube-uploader-backend1.onrender.com/oauth2callback";

// Step 1: Root route for Render check
app.get("/", (req, res) => {
  res.send("✅ YouTube Uploader Backend Running Successfully!");
});

// Step 2: Generate Google OAuth URL
app.get("/auth-url", (req, res) => {
  const scope = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  res.json({ url: authUrl });
});

// Step 3: OAuth callback (Google → our backend)
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send("Missing authorization code.");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      })
    });

    const data = await tokenRes.json();

    if (data.error) {
      console.error("Token Error:", data);
      return res.status(400).send(`Error exchanging code: ${data.error_description}`);
    }

    // Send tokens back to frontend (you can store them safely if you want)
    res.send(`<h2>✅ Login Successful!</h2><p>You can close this tab and return to the uploader.</p>`);
  } catch (err) {
    console.error("OAuth Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Step 4: Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
