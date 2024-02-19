import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
// REGISTER
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await prisma.users.findMany({
    where: {
      email: email,
    },
  });
  if (!users) {
    const result = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      message: "user created",
    });
  } else {
    const result = await prisma.users.update({
      data: {
        password: hashedPassword,
        updatedAt: Date.now().toString(),
      },
      where: {
        email,
      },
    });
    res.status(200).json({
      data: result,
      message: "user has ben set password",
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(404).json({
      messgae: "User not found",
    });
  }
  if (!user?.password) {
    return res.status(404).json({
      message: "Password not set",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.address,
    };
    const secretKey = process.env.JWT_SECRET!;
    const expireIn = 60 * 60 * 24;
    const token = jwt.sign(payload, secretKey, { expiresIn: expireIn });
    return res.json({
      data: {
        id: user.id,
        email: user.email,
        address: user.address,
      },
      message: "login success",
      token: token,
    });
  } else {
    return res.status(403).json({
      message: "Wrong Password",
    });
  }
};

// CREATE
export const postUsers = async (req: Request, res: Response) => {
  const { name, email, address } = req.body;
  const result = await prisma.users.create({
    data: {
      name: name,
      email: email,
      address: address,
    },
  });
  res.status(200).json({
    data: result,
    message: `User ${result.name} Created`,
  });
  res.json({ message: "User Created" });
};

// GET DATA
export const getUsers = async (req: Request, res: Response) => {
  const result = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
    },
  });
  res.status(200).json({
    data: result,
    message: "User List",
  });
};

// UPDATE DATA
export const patchUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, address } = req.body;
  const result = await prisma.users.update({
    data: {
      name: name,
      email: email,
      address: address,
    },
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      updatedAt: true,
    },
  });
  res.status(200).json({
    data: result,
    message: `user ${id}  updated`,
  });
};

export const deleteuser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await prisma.users.delete({
    where: {
      id: Number(id),
    },
  });
  res.json({ message: `user ${id} hass been deleted` });
};
