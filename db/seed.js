import pg from "pg";
import bcrypt from "bcrypt";

const db = new pg.Client(process.env.DATABASE_URL);

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const {
    rows: [user],
  } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ('natalie', $1)
    RETURNING *
  `,
    [hashedPassword],
  );

  const products = [
    {
      title: "Wireless Headphones",
      description: "Premium noise-cancelling headphones",
      price: 199.99,
    },
    {
      title: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard",
      price: 149.99,
    },
    {
      title: "USB-C Hub",
      description: "7-in-1 USB-C hub for laptops",
      price: 49.99,
    },
    {
      title: "Webcam HD",
      description: "1080p HD webcam with microphone",
      price: 79.99,
    },
    {
      title: "Monitor Stand",
      description: "Adjustable aluminum monitor stand",
      price: 39.99,
    },
    {
      title: "Mouse Pad XL",
      description: "Extra large desk mouse pad",
      price: 24.99,
    },
    {
      title: "Laptop Sleeve",
      description: "Waterproof 15-inch laptop sleeve",
      price: 29.99,
    },
    {
      title: "Blue Light Glasses",
      description: "Anti blue light computer glasses",
      price: 34.99,
    },
    {
      title: "Cable Management",
      description: "Under desk cable management tray",
      price: 19.99,
    },
    {
      title: "Desk Lamp LED",
      description: "Dimmable LED desk lamp with USB port",
      price: 44.99,
    },
  ];

  const insertedProducts = [];
  for (const p of products) {
    const {
      rows: [product],
    } = await db.query(
      `
      INSERT INTO products (title, description, price)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [p.title, p.description, p.price],
    );
    insertedProducts.push(product);
  }

  const {
    rows: [order],
  } = await db.query(
    `
    INSERT INTO orders (date, note, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
    ["2024-01-15", "First order", user.id],
  );

  for (let i = 0; i < 5; i++) {
    await db.query(
      `
      INSERT INTO orders_products (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
    `,
      [order.id, insertedProducts[i].id, i + 1],
    );
  }
}
