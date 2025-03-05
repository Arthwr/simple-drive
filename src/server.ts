import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';

const server = express();

// Compression
server.use(compression());

// Static
server.use(express.static(path.join(__dirname, 'public')));

// Decline favicon requests
server.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/favicon.ico') {
    res.status(204).end();
    return;
  }

  next();
});

// Body parsers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// View engine
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// Routes
server.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/index');
});

server.listen(3000, () => {
  console.log('Server running at port 3000');
});
