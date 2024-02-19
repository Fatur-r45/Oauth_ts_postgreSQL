import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserData {
  id: String;
  name: String;
  address: String;
}

interface ValidationRequest extends Request {
  userData: UserData;
}

export const accessValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRequest = req as ValidationRequest;
  const { authorization } = validationRequest.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "token di perlukan",
    });
  }
  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET!;
  try {
    const jwtDecode = jwt.verify(token, secret);
    if (typeof jwtDecode !== "string") {
      validationRequest.userData = jwtDecode as UserData;
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
};
