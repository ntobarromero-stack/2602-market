import express from "express";
import getUserFromToken from "./middleware/getUserFromToken.js";
import usersRouter from "./routers/users.js";
import productsRouter from "./routers/products.js";
import ordersRouter from "./routers/orders.js";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

export default app;
