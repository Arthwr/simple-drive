import { Router } from 'express';

import registerRouter from './root/registerRoutes';
import rootRoutes from './root/rootRoutes';

const routes = Router();

routes.use('/', rootRoutes);
routes.use('/register', registerRouter);

export default routes;
