
"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
var express = require("express");
const Admin = require("../models/admin");
const WaterData = require("../models/waterData");

const moment = require("moment");

var router = express.Router();
var jwt = require("jsonwebtoken");
var expressjwt = require("express-jwt");
const waterData = require("../models/waterData");

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }
    const adminlogin = await Admin.findOne({ username, password }).lean();
    if (!adminlogin) {
      return res.json({ status: "error", error: "Invalid Username/pasword" });
    } else {
      const token = jwt.sign({ _id: Admin._id }, "hello");
      res.cookie("token", token, { expire: new Date() + 9999 });
      // localStorage.setItem("token",token);

      res.json({ token, status: "ok", data: adminlogin });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/saveData", async (req, res) => {
  // const{Id}=req.body;
  // const data=new WaterData(req.body);
  const data = await WaterData.findOne({}).sort({ _id: -1 });
  console.log("test");
  if (!data) {
    await waterData.create({
      transaction: 100,

      waterlevel: 100,
    });
  } else {
    console.log(data);
    if (data.waterlevel >= 700) return res.status(400).json("already full");
    await waterData.create({
      transaction: 100,

      waterlevel: data.waterlevel + 100,
    });
  }
  res.status(200).json("ho gya");
});

router.get("/waterlevel", async (req, res) => {
  const data = await WaterData.findOne({}).sort({ _id: -1 });

  return res.status(200).json(data);
});

router.delete("/removeData", async (req, res) => {
  // const{Id}=req.body;
  // const data=new WaterData(req.body);
  const data = await WaterData.findOne({}).sort({ _id: -1 });

  if (!data) {
    res.status(400).json("No water to remove");
  } else {
    if (data.waterlevel < 100) return res.status(400).json("already empty");
    await waterData.create({
      transaction: -100,

      waterlevel: data.waterlevel - 100,
    });
  }
  res.status(200).json("ho gya");
});

// router.isSignedIn=expressjwt({
//     secret: "hello",
//     userProperty: "auth"
// });
router.get("/signup", (req, res) => {
  const admin = new Admin(req.body);
  admin.save((err, admin) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save",
      });
    }
    res.json({
      username: admin.username,
      password: admin.password,
    });
  });
});

router.post("/mailFilled", async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: 587,
    secure: false,
    requireTLS: true, // true for 465, false for other ports
    auth: {
      user: process.env.email, // generated ethereal user
      pass: process.env.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"tankwater95@gmail.com', // sender address
    to: "chaya3007.be20@chitkara.edu.in,chayashiv629@gmail.com", // list of receivers
    subject: "Tank Full ✔", // Subject line
    text: "Your tank is full", // plain text body
    html: "<b>Your tank is full</b>", // html body
  });

  res.status(200).json("Email sent:water tank is full");
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

router.post("/mailempty", async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: 587,
    secure: false,
    requireTLS: true, // true for 465, false for other ports
    auth: {
      user: process.env.email, // generated ethereal user
      pass: process.env.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"tankwater95@gmail.com', // sender address
    to: "chaya3007.be20@chitkara.edu.in,chayashiv629@gmail.com", // list of receivers
    subject: "Tank Empty ✔", // Subject line
    text: "Your tank is Empty", // plain text body
    html: "<b>Your tank is Empty</b>", // html body
  });

  res.status(200).json("Email sent:water tank is Empty");
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

router.get("/graph", async (req, res) => {
  const { date } = req.query;
  let condition = {};

  if (date && date.length) {
    condition = { created: { $lte: date } };
  }
  const data = await WaterData.find(condition);

  return res.status(200).json(data);
});

router.get("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout",
  });
});
module.exports = router;
