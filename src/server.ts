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
// Add pause for flash messages on hover or tab switch perhaps?
// Move icon load from partials/icons to public for better consistency?
// Fix simple drive on /dashboard hover animation
// I don't really like /dashboard left top corner icon name colors combo. Maybe change icon, colors, font family and sizes.
// Implement input validation for reg/login & other routes
// Structure Flash Message into subcategories
// During folders/files render - sort them against type (folder, file) and then alphabeticaly.
// Possibly test against each error scenario
// Implement breadcrumbs functionality (search and render)
// Implement size calculation for folders.
// Folder @updatedAt right now only checks time of Folder model being updated itself,
//  but not his relations. Implement bump function
// Fix bug with flash messages appearing again during browser back redirect
// Tune in specific item acception for upload
// Files should be in custom field before uploaded
