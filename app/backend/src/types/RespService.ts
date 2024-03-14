import ITeams from '../Interfaces/ITeams';

export type ErrorData = {
  message: string;
};

export type RespType = {
  status: string;
  data: ITeams | ITeams[] | ErrorData;
};
