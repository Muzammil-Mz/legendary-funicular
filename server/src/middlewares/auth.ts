import config from "config";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

const JWT_KEY: string = config.get<string>("JWT_KEY");

interface authRequest extends Request {
  user?: any;
}

const authMiddleware = (
  req: authRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader: string | undefined = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "no token provided" });
    return;
  }

  const token: string = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "invalid token" });
  }
};

export default authMiddleware;
