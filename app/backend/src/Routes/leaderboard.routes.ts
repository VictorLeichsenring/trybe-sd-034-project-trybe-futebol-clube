import { Router } from 'express';
import { leaderboardController } from '../controllers';

const router = Router();

router.get('/home', leaderboardController.getHomeLeaderboard);

export default router;
