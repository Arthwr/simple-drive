import compression from 'compression';
import express from 'express';
import passport from 'passport';
import path from 'path';

import config from './config';
import configurePassport from './config/passport';
import configureSession from './config/session';
import errorHandler from './middleware/errorHandler';
import configureHelmet from './middleware/helmet';
import notFoundHandler from './middleware/notFoundHandler';
import routes from './routes';

const server = express();

// Compression
server.use(compression());

// Headers
server.use(configureHelmet());

// Static
server.use(express.static(path.join(__dirname, 'public')));

// Decline browser favicon requests
server.use((req, res, next) => {
  if (req.path === '/favicon.ico') {
    res.status(204).end();
    return;
  }

  next();
});

// Body parsers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Session
server.use(configureSession());

// Passport session support
server.use(passport.session());

// Passport strategy
configurePassport();

// View engine
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// Routes
server.use('/', routes);

//  404
server.use(notFoundHandler);

// Error handler
server.use(errorHandler);

// Server
server.listen(config.port, () => {
  console.log(`Server running at port ${config.port}`);
});
