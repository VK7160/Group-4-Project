require('dotenv').config();
const express = require('express');
const https=require('https')
const path=require('path')
const fs=require('fs')
const mongoose=require('mongoose');
const app = express();
const base = `${__dirname}`;
const port=3000;


const sslserver=https.createServer({

  key:fs.readFileSync(`${base}/cert/key.pem`),
  cert:fs.readFileSync(`${base}/cert/cert.pem`),

},
app)


mongoose.connect(process.env.DB).then(()=>{
console.log("DB Connected");
})
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const cors=require("cors");

const authRoutes=require("./routes/auth");


const admin=(req, res) =>{
  return res.sendFile(`${base}/admin-login.html`);
 // return res.send("admin");
};

const home=(req, res) =>{
  return res.sendFile(`${base}/FrontEnd/home.html`);
 // return res.send("admin");
};
const contact=(req, res) =>{
  return res.sendFile(`${base}/FrontEnd/contact.html`);
 // return res.send("admin");
};

const img=(req, res) =>{
  return res.sendFile(`${base}/img/img.jpg`);
 // return res.send("admin");
};

const Homeimg=(req, res) =>{
  return res.sendFile(`${base}/FrontEnd/img/tank.jpg`);
 // return res.send("admin");
};
const c1=(req, res) =>{
  return res.sendFile(`${base}/FrontEnd/img/phone-alt.png`);
 // return res.send("admin");
};
const c2=(req, res) =>{
  return res.sendFile(`${base}/FrontEnd/img/mail-bulk.png`);
 // return res.send("admin");
};
const c3=(req, res) =>{
  return res.sendFile(`${base}/FrontEnd/img/location-get.png`);
 // return res.send("admin");
};

const water=(req, res) =>{
  return res.sendFile(`${base}/frontend/water.html`);
 // return res.send("admin");
};

const waterTankApi=(req, res) =>{
  return res.sendFile(`${base}/frontend/js/waterTankApi.js`);
 // return res.send("admin");
};

const tank_animation=(req, res) =>{
  return res.sendFile(`${base}/frontend/js/tank_animation.js`);
 // return res.send("admin");
};

/*const isloggedin=(req, res,next) =>{
  console.log("admin is logged in");
  next();
};*/
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api",authRoutes);

//app.post("/api" , authRoutes);
app.get('/',home);
app.get('/img',img);
app.get('/homeimg',Homeimg);
app.get('/c1',c1);
app.get('/c2',c2);
app.get('/c3',c3);
app.get('/adminLogin',admin);
app.get('/water',water);
app.get('/waterTankApi',waterTankApi);
app.get('/tank_animation',tank_animation);
app.get('/contact',contact);
//app.get('/waterTank',water)

sslserver.listen(port,()=>console.log("server running on 3000"))