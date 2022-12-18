import express from "express";
import { client } from "../index.js";
const router = express.Router();

router.get("/", async function (request, response) {
  const pizzas = await client
    .db("b39wd")
    .collection("pizza-router")
    .find(request.query)
    .toArray();
  response.send(pizzas);
});

router.get("/:id", async function (request, response) {
  const { id } = request.params;
  // db.pizzas.findOne({id:1})
  const pizza = await client
    .db("b39wd")
    .collection("pizza-router")
    .findOne({ id: id });
  // const pizza = pizzaData.find((pza) => pza.id == id)
  pizza
    ? response.send(pizza)
    : response.status(404).send({ msg: "pizza not available" });
});

router.post("/", async function (request, response) {
  const data = request.body;
  console.log(request.body);

  const result = await client
    .db("b39wd")
    .collection("pizza-router")
    .insertMany(data);
  response.send(data);
});

router.delete("/:id", async function (request, response) {
  const { id } = request.params;
  // db.pizzas.findOne({id:1})
  const pizza = await client
    .db("b39wd")
    .collection("pizza-router")
    .deleteOne({ id: id });
  // const pizza = pizzaData.find((pza) => pza.id == id)
  pizza.deletedCount > 0
    ? response.send({ msg: "pizza data deleted successfully" })
    : response.status(404).send({ msg: "pizza not available" });
});

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
