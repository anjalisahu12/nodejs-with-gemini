const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
require('dotenv').config();
const express = require('express');
const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hello by gemini");
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

// Change API to POST request
app.post('/api/content', async (req, res) => {
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
    console.log("server is running on port 3000");
});
