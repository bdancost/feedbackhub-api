// src/types/express/index.d.ts
import type { JwtPayload } from "../jwtPayload";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
