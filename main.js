const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
res.send("hello by gemini")
})
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const prompt = "Explain how AI works";

const generate= async(prompt)=>{
try{

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}catch(err){
  console.log(err);
  
}
}
// generate();
app.get('/api/content',async(req,res)=>{
  try{

    const data = req.body.question;
    const result = await generate(data);
    res.send({"result":result})
  }catch(err){
res.send({"error":err})
  }
})

app.listen(3000, ()=>{
  console.log("server is running on 3000");
  
})