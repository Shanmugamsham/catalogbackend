
const express = require("express");
const routes=require("./Routes/routes")
const cors=require("cors")
const cookieParser = require('cookie-parser')
const app = express();
require('dotenv').config()

const port = process.env.port


app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.json()); 
app.use(routes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });