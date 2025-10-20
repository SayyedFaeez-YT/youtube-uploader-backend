import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CLIENT_ID = "152575177583-bl027gj86q96nuru4uart85jtseeg0db.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.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;
const REDIRECT_URI = "https://youtube-uploader-backend.onrender.com/oauth2callback";

app.get("/", (req, res) => {
  res.send("✅ YouTube Uploader Backend Running!");
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
