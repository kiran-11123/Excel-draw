import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export interface AuthRequest extends Request {
  user: {
    user_id: string;
  };
}

interface MyJwtPayload extends JwtPayload {
  user_id: string;
}

const Authentication_token = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    if (!decoded.user_id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ⬇️ CAST req → AuthRequest HERE
    (req as AuthRequest).user = { user_id: decoded.user_id };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default Authentication_token;
