import express from "express";
import { client } from "../index.js";
const router = express.Router();

// get all pizzas and find by query: 
router.get("/", async function (request, response) {
  const pizzas = await client
    .db("b39wd")
    .collection("pizza-app")
    .find(request.query)
    .toArray();
  response.send(pizzas);
});

// get all pizza names : 
router.get("/pizza-by-name", async function (request, response) {
  const pizzas = await client
    .db("b39wd")
    .collection("pizza-app")
    .find({},{ name : 1}).toArray()

  response.send(pizzas);
  console.log(pizzas)
});

// get pizzas by id : 
router.get("/:id", async function (request, response) {
  const { id } = request.params;
  // db.pizzas.findOne({id:1})
  const pizza = await client
    .db("b39wd")
    .collection("pizza-app")
    .findOne({ id: id });
  // const pizza = pizzaData.find((pza) => pza.id == id)
  pizza
    ? response.send(pizza)
    : response.status(404).send({ msg: "pizza not available" });
});

// create pizza data :
router.post("/create", async function (request, response) {
  const data = request.body;
  // console.log(request.body);

  const result = await client
    .db("b39wd")
    .collection("pizza-app")
    .insertOne(data);
  response.send(data);
});

// delete pizzas by id:
router.delete("/:id", async function (request, response) {
  const { id } = request.params;
  // db.pizzas.findOne({id:1})
  const pizza = await client
    .db("b39wd")
    .collection("pizza-app")
    .deleteOne({ id: id });
  // const pizza = pizzaData.find((pza) => pza.id == id)
  pizza.deletedCount > 0
    ? response.send({ msg: "pizza data deleted successfully" })
    : response.status(404).send({ msg: "pizza not available" });
});

// Edit pizzas by id : 
router.put("/:id", async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  console.log(data);

  const result = await client
    .db("b39wd")
    .collection("pizza-app")
    .updateOne({ id: id }, { $set: data });
  console.log(result);

  result
    ? response.send(result)
    : response.status(404).send({ msg: "pizza not available" });
});

export default router;

