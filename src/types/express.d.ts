import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
interface UserPayload {
  sub: number;
  username: string;
}
