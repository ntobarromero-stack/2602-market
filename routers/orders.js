import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getProductsByOrderId,
} from "../db/queries/orders.js";
import { getProductById } from "../db/queries/products.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

const router = express.Router();

// 🔒 POST /orders
router.post("/", requireUser, requireBody(["date"]), async (req, res, next) => {
  try {
    const { date, note } = req.body;
    const order = await createOrder(date, note, req.user.id);
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

// 🔒 GET /orders
router.get("/", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// 🔒 GET /orders/:id
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");
    res.json(order);
  } catch (e) {
    next(e);
  }
});

// 🔒 POST /orders/:id/products
router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) return res.status(404).send("Order not found.");
      if (order.user_id !== req.user.id)
        return res.status(403).send("Forbidden.");

      const { productId, quantity } = req.body;
      const product = await getProductById(productId);
      if (!product) return res.status(400).send("Product not found.");

      const record = await addProductToOrder(order.id, productId, quantity);
      res.status(201).json(record);
    } catch (e) {
      next(e);
    }
  },
);

// 🔒 GET /orders/:id/products
router.get("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");

    const products = await getProductsByOrderId(order.id);
    res.json(products);
  } catch (e) {
    next(e);
  }
});

export default router;
