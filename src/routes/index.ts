import { Router } from 'express';

import rootRoutes from './root/rootRoutes';

const routes = Router();

routes.use('/', rootRoutes);

export default routes;
