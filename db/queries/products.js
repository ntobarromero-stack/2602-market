import db from "../client.js";

export async function getAllProducts() {
  const { rows } = await db.query(`SELECT * FROM products`);
  return rows;
}

export async function getProductById(id) {
  const {
    rows: [product],
  } = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return product;
}

export async function getOrdersByProductId(productId, userId) {
  const { rows } = await db.query(
    `SELECT orders.* FROM orders
     JOIN orders_products ON orders.id = orders_products.order_id
     WHERE orders_products.product_id = $1 AND orders.user_id = $2`,
    [productId, userId],
  );
  return rows;
}
