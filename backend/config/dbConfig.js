const mongoose = require('mongoose');

const db_url= process.env.DB_URL;

const dbConfig = ()=>{
    mongoose.connect(db_url).then(()=>{
    console.log("DB connected");
}).catch((error)=>{
    console.log("db error"+ error);
    
})}

module.exports = dbConfig