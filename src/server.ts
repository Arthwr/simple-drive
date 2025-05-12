import compression from 'compression';
import express from 'express';
import passport from 'passport';
import path from 'path';

import config from './config';
import configurePassport from './config/passport';
import configureSession from './config/session';
import errorHandler from './middleware/errorHandler';
import flash from './middleware/flash';
import configureHelmet from './middleware/helmet';
import messageStore from './middleware/messageStore';
import notFoundHandler from './middleware/notFoundHandler';
import routes from './routes';
import utils from './utils/utils';

const server = express();

// Render deploy
server.set('trust proxy', 1);

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

// Flash messages
server.use(flash);

// Flash message store
server.use(messageStore);

// Utilities
server.locals.utils = utils;

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

// Handle (delete) output .js files in public/scripts during run dev script
// Check validation on submit (front-end)
// Fix edge case where flash message will be stored if redirect fail
// Change flash messages colors to something better (Success)
// Implement input validation for reg/login & other routes
// Structure Flash Message into subcategories
// Possibly test against each error scenario
//  but not his relations. Implement bump function
// Fix bug with flash messages appearing again during browser back redirect
// Remove elements folder
// Fix color of successful client flash message icon
// Input validation on folder name to fix a case with empty string name for folder.
