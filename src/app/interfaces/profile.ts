import { BasicInfo } from './registration';

export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
  connections: Connection[]
}

export interface Connection {
  id: string;
  user_id: string,
  info: BasicInfo,
  timestamp: number,
  isMatched: boolean,
  matchId: string
}