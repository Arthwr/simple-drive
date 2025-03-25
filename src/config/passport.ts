import bcryptjs from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import config from '.';
import UserService from '../services/UserService';
import { FlashMessages, FlashTypes } from './constants';

const configurePassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await UserService.findUserByEmail(email);
          const hash = user ? user.password : config.dummyHash;

          const match = await bcryptjs.compare(password, hash);

          if (!user || !match) {
            req.flash(FlashTypes.ERROR, FlashMessages.LOGIN_FAILED);
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          req.flash(FlashTypes.ERROR, FlashMessages.UNEXPECTED_ERROR);
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserService.findUserById(id);

      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
