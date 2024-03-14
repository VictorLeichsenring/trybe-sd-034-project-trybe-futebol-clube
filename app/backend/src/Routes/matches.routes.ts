import { Router } from 'express';
import { matchesController } from '../controllers';
import verifyToken from '../middlewares/verifyToken';

const router = Router();
router.get('/', matchesController.getAll);
router.patch('/:id/finish', verifyToken, matchesController.finishMatch);
router.patch('/:id', verifyToken, matchesController.updateMatch);
router.post('/', verifyToken, matchesController.createMatch);

export default router;
