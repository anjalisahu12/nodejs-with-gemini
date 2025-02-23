const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const path = require("path"); // <-- Import path module

const app = express();

// ✅ Serve frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Enable CORS
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type",
  })
);
app.use(express.json());
app.use(bodyParser.json());

// ✅ Serve index.html when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.log(err);
    return "Error generating response";
  }
};

// Handle API request
app.post("/api/content", async (req, res) => {
  try {
    const data = req.body.question;
    if (!data) return res.status(400).send({ error: "Question is required" });

    const result = await generate(data);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
