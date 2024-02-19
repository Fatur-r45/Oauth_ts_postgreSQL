import express from "express";
import {
  deleteuser,
  getUsers,
  login,
  patchUser,
  postUsers,
  register,
} from "../controller/authController";
import { accessValidation } from "../middleware/validationToken";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users", accessValidation, getUsers);
router.post("/users", accessValidation, postUsers);
router.patch("/users/:id", accessValidation, patchUser);
router.delete("/users/:id", deleteuser);

export default router;
