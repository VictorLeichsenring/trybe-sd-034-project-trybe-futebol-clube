import { Router } from 'express';
import { matchesController } from '../controllers';
import verifyToken from '../middlewares/verifyToken';

const router = Router();
router.get('/', matchesController.getAll);
router.patch('/:id/finish', verifyToken, matchesController.finishMatch);

export default router;
