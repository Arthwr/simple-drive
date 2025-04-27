import { Router } from 'express';

import isAuthenticated from '../middleware/isAuthenticated';
import apiRouter from './api/apiRoutes';
import loginRoutes from './auth/loginRoutes';
import registerRoutes from './auth/registerRoutes';
import dashboardRoutes from './dashboard/dashboardRoutes';
import indexRoutes from './index/indexRoutes';
import folderRoutes from './storage/folderRoutes';
import uploadRoutes from './storage/uploadRoutes';

const routes = Router();

// Public Routes
routes.use('/', indexRoutes);
routes.use('/login', loginRoutes);
routes.use('/register', registerRoutes);

// Protected routes
routes.use('/dashboard', isAuthenticated, dashboardRoutes);

// ---- Folder and files manipulation
routes.use('/folder', isAuthenticated, folderRoutes);
routes.use('/upload', isAuthenticated, uploadRoutes);

// API for different stuff (tree structure and etc)
routes.use('/api', isAuthenticated, apiRouter);

export default routes;
