import db from "../client.js";

export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(`SELECT id, username FROM users WHERE id = $1`, [id]);
  return user;
}

export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return user;
}

export async function createUser(username, hashedPassword) {
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username`,
    [username, hashedPassword],
  );
  return user;
}
