// const express = require("express"); // "type": "commonjs" in package.json
import express from "express"; // "type": "module" in package.json
import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();

const PORT = process.env.PORT;

const pizzaData = [
    {
      id: 1,
      name: "Pepper barbique chicken",
      varients: ["small", "medium", "large"],
      prices: [{
        small: 200,
        medium: 350,
        large: 400,
      }],
  
      category: "nonveg",
      image: "https://th.bing.com/th/id/OIP.gTBpgBflDwRjtg9WTRcgrgHaE8?w=280&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      desctiption: "pepper barbecue chicken I Cheese",
    },{
      id: 2,
      name: "barbique veg",
      varients: ["small", "medium", "large"],
      prices: [{
        small: 80,
        medium: 290,
        large: 380,
      }],
      category: "nonveg",
      image: "https://th.bing.com/th/id/OIP.gTBpgBflDwRjtg9WTRcgrgHaE8?w=280&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      desctiption: "pepper barbecue chicken I Cheese",
    },{
      id: 3,
      name: "Pepper barbique veg",
      varients: ["small", "medium", "large"],
      prices: [{
        small: 130,
        medium: 280,
        large: 490,
      }],
      category: "nonveg",
      image: "https://th.bing.com/th/id/OIP.gTBpgBflDwRjtg9WTRcgrgHaE8?w=280&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      desctiption: "pepper barbecue chicken I Cheese",
    },{
      id: 4,
      name: "Pepper chicken",
      varients: ["small", "medium", "large"],
      prices: [{
        small: 120,
        medium: 340,
        large: 480,
      }],
      category: "nonveg",
      image: "https://th.bing.com/th/id/OIP.gTBpgBflDwRjtg9WTRcgrgHaE8?w=280&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      desctiption: "pepper barbecue chicken I Cheese",
    },{
      id: 5,
      name: "barbique chicken",
      varients: ["small", "medium", "large"],
      prices: [{
        small: 20,
        medium: 35,
        large: 40,
      }],
      category: "nonveg",
      image: "https://th.bing.com/th/id/OIP.gTBpgBflDwRjtg9WTRcgrgHaE8?w=280&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      desctiption: "pepper barbecue chicken I Cheese",
    },{
      id: 6,
      name: "Pepper veg",
      varients: ["small", "medium", "large"],
      prices: [{
        small: 100,
        medium: 300,
        large: 430,
      }],
      category: "nonveg",
      image: "https://th.bing.com/th/id/OIP.gTBpgBflDwRjtg9WTRcgrgHaE8?w=280&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      desctiption: "pepper barbecue chicken I Cheese",
    }
  ];
  
  // const MONGO_URL = "mongodb://127.0.0.1";           // no need to mention default port
  const MONGO_URL = process.env.MONGO_URL// const MONGO_URL = "mongodb://127.0.0.1:27017";       // or defaultt port(27017)
// const MONGO_URL = "mongodb://localhost:27017";       // or
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongodb connected")

// app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.get("/pizza", async function (request, response) {

  const pizzas = await client.db("b39wd").collection("pizza-app").find(request.query).toArray();
    response.send(pizzas);
  });

app.get("/pizza/:id", async function (request, response) {
    const {id} = request.params;
    // db.pizzas.findOne({id:1})
    const pizza = await client.db("b39wd").collection("pizza-app").findOne({id: id});
    // const pizza = pizzaData.find((pza) => pza.id == id)
    pizza ? response.send(pizza): response.status(404).send({msg:"pizza not available"})
  });

  app.post("/pizza", async function(request, response){
    const data = request.body;
    console.log(request.body);

    const result = await client.db("b39wd").collection("pizza-app").insertMany(data);
    response.send(data);
  });

  app.delete("/pizza/:id", async function (request, response) {
    const {id} = request.params;
    // db.pizzas.findOne({id:1})
    const pizza = await client.db("b39wd").collection("pizza-app").deleteOne({id: id});
    // const pizza = pizzaData.find((pza) => pza.id == id)
    pizza.deletedCount > 0 ? response.send({msg: "pizza data deleted successfully"}): response.status(404).send({msg:"pizza not available"})
  });

  app.put("/pizza/:id", async function (request, response) {
    const {id} = request.params;
    const data = request.body;
    console.log(data);

    const result = await client.db("b39wd").collection("pizza-app").updateOne({ id : id }, { $set : data });
    console.log(result);

    result ? response.send(result): response.status(404).send({msg:"pizza not available"})
  });

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));