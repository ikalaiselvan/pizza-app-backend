// const express = require("express"); // "type": "commonjs" in package.json
import express from "express"; // "type": "module" in package.json
import {MongoClient} from 'mongodb'
import pizzaRouter from './routes/pizza.route.js'
import authRouter from "./routes/auth.route.js";
import * as dotenv from 'dotenv';
import  isAuth  from "./routes/auth/authentication.js";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
// const cookieParser = require("cookie-parser");


const app = express();

const PORT = process.env.PORT || 5000; 
  
  // const MONGO_URL = "mongodb://127.0.0.1";           // no need to mention default port
  const MONGO_URL = process.env.MONGO_URL              // or defaultt port(27017)
// const MONGO_URL = "mongodb://localhost:27017";       // or
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongodb connected")

// app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", function (request, response) {
  console.log("index cookies : ", request.cookies);
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use("/auth", authRouter);
app.use("/pizza", pizzaRouter);


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };