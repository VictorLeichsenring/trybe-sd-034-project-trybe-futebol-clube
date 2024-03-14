import IUsers from '../Interfaces/iUsers';
import ITeams from '../Interfaces/ITeams';
import IMatches from '../Interfaces/iMatches';

type tokenResp = { token: string };
type RoleResp = { role: string };

export type ErrorData = {
  message: string;
};

export type RespType = {
  status: string;
  data:
  ITeams
  | ITeams[]
  | IUsers
  | IMatches
  | IMatches[]
  | RoleResp
  | string
  | tokenResp
  | ErrorData;
};
