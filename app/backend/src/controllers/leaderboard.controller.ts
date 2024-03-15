import { Request, Response } from 'express';
import { leaderboardService } from '../services';

async function getHomeLeaderboard(req:Request, res: Response) {
  const leaderboard = await leaderboardService.getHomeLeaderboard();
  return res.status(200).json(leaderboard);
}

async function getAwayLeaderboard(req:Request, res: Response) {
  const leaderboard = await leaderboardService.getAwayLeaderboard();
  return res.status(200).json(leaderboard);
}

async function generalLeaderboard(req:Request, res: Response) {
  const leaderboard = await leaderboardService.getGeneralLeaderboard();
  return res.status(200).json(leaderboard);
}

export default {
  getHomeLeaderboard,
  getAwayLeaderboard,
  generalLeaderboard,
};
