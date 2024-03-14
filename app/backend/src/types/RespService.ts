import IUsers from '../Interfaces/iUsers';
import ITeams from '../Interfaces/ITeams';

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
  | RoleResp
  | string
  | tokenResp
  | ErrorData;
};
