import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';

import config from '.';

const configureSession = () => {
  if (!config.session_secret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  return session({
    name: 'sd_sid',
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.environment === 'production' ? true : false,
      sameSite: 'strict',
    },
  });
};

export default configureSession;
