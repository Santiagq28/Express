import { Router } from 'express';
import ApuestaRoute from './apuesta.route.js';

const router = Router();
router.use(ApuestaRoute);

export default router;
