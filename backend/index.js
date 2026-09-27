require('dotenv').config();
const express = require('express');
var cors = require('cors')
const dns = require('node:dns');
const authControllar = require("./controllar/authControllar.js");
const uploadControllar = require("./controllar/uploadControllar.js");
const dbConfig = require('./config/dbConfig.js');
const upload = require('./middleware/upload.js');

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8000
dns.setServers(["8.8.8.8","1.1.1.1"])


dbConfig()


app.get("/", (req,res)=>{
res.send("hi homepage");
})
app.get("/allUsers",authControllar.getAlluser)
app.post("/registration", upload.single('avatar'), authControllar.registration)
app.delete("/delate/:id", authControllar.userDelate)
app.post("/update/:id", upload.single('avatar'), authControllar.userUpdate)

app.post("/upload", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        massage: "No image file provided"
      });
    }
    const cloudinaryResponse = await uploadControllar.uploadToCloudinary(req.file.buffer, "uploads");
    res.status(200).json({
      success: true,
      massage: "Image uploaded successfully",
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      massage: "Image upload failed",
      error: error.message
    });
  }
})

app.use((error, req, res, next) => {
  if (error) {
    res.status(400).json({
      success: false,
      massage: error.message
    });
  }
})

app.listen(port,()=>{
    console.log(`server in running on ${port}`);
    
})
