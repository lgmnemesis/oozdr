import { BasicInfo } from './registration';

export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
}

export interface Connections {
  user_id: string;
  connections: Connection[];
}

export interface Connection {
  id: string;
  match_user_id: string,
  match_id: string,
  info: BasicInfo,
  timestamp: number,
  isMatched: boolean
}