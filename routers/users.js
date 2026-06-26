import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "../db/queries/users.js";
import { createToken } from "../utils/jwt.js";
import requireBody from "../middleware/requireBody.js";

const router = express.Router();

// POST /users/register
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await createUser(username, hashedPassword);
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (e) {
      next(e);
    }
  },
);

// POST /users/login
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsername(username);
      if (!user) return res.status(401).send("Invalid credentials.");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).send("Invalid credentials.");

      const token = createToken({ id: user.id });
      res.status(200).send(token);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
