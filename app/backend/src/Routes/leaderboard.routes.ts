import { Router } from 'express';
import { leaderboardController } from '../controllers';

const router = Router();

router.get('/home', leaderboardController.getHomeLeaderboard);
router.get('/away', leaderboardController.getAwayLeaderboard);
router.get('/', leaderboardController.generalLeaderboard);
export default router;
