import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface MyJwtPayload extends JwtPayload {
  user_id: string;
}

interface AuthRequest extends Request {
  user?: MyJwtPayload;
}

const Authentication_token = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    if (!decoded.user_id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = decoded; // ✅ no TS error
    next();
  } catch (er) {
    const err = er as Error;
    return res.status(401).json({
      message: "Invalid token",
      error: err.message
    });
  }
};

export default Authentication_token;
