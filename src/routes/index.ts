import { Router } from 'express';

import registerRouter from './registerRoutes';
import rootRoutes from './rootRoutes';

const routes = Router();

routes.use('/', rootRoutes);
routes.use('/register', registerRouter);

export default routes;
