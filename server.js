import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

const CLIENT_ID = "152575177583-bl027gj86q96nuru4uart85jtseeg0db.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://youtube-uploader-backend1.onrender.com/oauth2callback";

// ✅ Home route
app.get("/", (req, res) => {
  res.send("✅ YouTube Uploader Backend Running!");
});

// ✅ Dummy video upload route
app.post("/upload", upload.single("video"), async (req, res) => {
  console.log("🎥 Received video upload request");

  // This is just a test route for now.
  // Real upload to YouTube will require OAuth token handling.
  res.json({ videoId: "demo12345" });
});

// ✅ Community post upload route (text + image)
app.post("/uploadPost", upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file;

    console.log("📝 Received post:", text);
    if (image) console.log("🖼️ Received image:", image.originalname);

    // Since YouTube API doesn’t support posts, just simulate success.
    res.json({
      success: true,
      message: "Post uploaded (simulated)",
      text,
      image: image ? image.originalname : null,
    });
  } catch (error) {
    console.error("Error handling /uploadPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start server
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
