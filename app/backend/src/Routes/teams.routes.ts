import { Router } from 'express';
import TeamController from '../controllers';

const router = Router();

router.get('/', TeamController);

export default router;
