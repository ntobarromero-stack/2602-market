import express from "express";
import {
  getAllProducts,
  getProductById,
  getOrdersByProductId,
} from "../db/queries/products.js";
import requireUser from "../middleware/requireUser.js";

const router = express.Router();

// GET /products
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (e) {
    next(e);
  }
});

// GET /products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");
    res.json(product);
  } catch (e) {
    next(e);
  }
});

// 🔒 GET /products/:id/orders
router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");

    const orders = await getOrdersByProductId(req.params.id, req.user.id);
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

export default router;
