import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

declare module 'express-session' {
  interface Session {
    flash?: Record<string, string>;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    flash(type: string, message: string): void;
    flash(type: string): string | undefined;
  }
}
