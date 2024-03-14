import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken';
import { userController } from '../controllers';

const router = Router();

router.post('/', userController.login);
router.get('/role', verifyToken, userController.getUserRole);

export default router;
