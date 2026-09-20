require('dotenv').config();
const express = require('express');
var cors = require('cors')
const dns = require('node:dns');
const authControllar = require("./controllar/authControllar.js");
const dbConfig = require('./config/dbConfig.js');

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8000
dns.setServers(["8.8.8.8","1.1.1.1"])


dbConfig()


app.get("/", (req,res)=>{
res.send("hi homepage");
})
// app.post("/registration", (req,res)=>{
//     console.log(req.body);
// })
app.get("/allUsers",authControllar.getAlluser)
app.post("/registration",authControllar.registration)
app.delete("/delate/:id", authControllar.userDelate)
app.post("/update/:id", authControllar.userUpdate)
app.listen(port,()=>{
    console.log(`server in running on ${port}`);
    
})