import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { matchService } from '../services';
import IMatches from '../Interfaces/iMatches';

async function getAll(req:Request, res: Response) {
  // const { status, data } = await matchService.getAll();
  // let responseObj = { data };
  // if (req.query.inProgress === 'true') {
  //   const filteredData = data.filter((match: { inProgress: boolean; }) => match.inProgress);
  //   responseObj = filteredData;
  // }
  // return res.status(mapStatusHTTP(status)).json(responseObj);
  const { status, data } = await matchService.getAll();

  // Usamos afirmação de tipo para tratar 'data' como um array de 'IMatches'
  const matches = data as IMatches[];

  let responseObj;
  if (req.query.inProgress === 'true') {
    // Filtra 'matches' para incluir apenas aqueles que estão em progresso
    const filteredMatches = matches.filter((match) => match.inProgress);
    responseObj = { data: filteredMatches };
  } else {
    // Retorna todos os 'matches' se nenhum filtro específico for aplicado
    responseObj = { data: matches };
  }

  return res.status(mapStatusHTTP(status)).json(responseObj);
}

export default {
  getAll,
};
