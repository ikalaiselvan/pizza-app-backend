// const express = require("express"); // "type": "commonjs" in package.json
import express from "express"; // "type": "module" in package.json
import {MongoClient} from 'mongodb'
import pizzaRouter from './routes/pizza.route.js'
import * as dotenv from 'dotenv';
dotenv.config()

console.log(process.env.MONGO_URL)

const app = express();

const PORT = 4000;  
  
  // const MONGO_URL = "mongodb://127.0.0.1";           // no need to mention default port
  // const MONGO_URL = process.env.MONG O_URL              // or defaultt port(27017)
  const MONGO_URL = "mongodb+srv://kalaiselvan:kalai6565@cluster0.oiqqgzq.mongodb.net"
// const MONGO_URL = "mongodb://localhost:27017";       // or
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongodb connected")

// app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use("/pizza", pizzaRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };