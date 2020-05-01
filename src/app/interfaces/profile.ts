import { BasicInfo } from './registration';

export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
}

export interface Connections {
  user_id: string;
  mobile: string; // need for the match comperation
  connections: Connection[];
}

export interface Connection {
  id: string;
  user_id: string,
  match_user_id: string,
  match_id: string,
  info: BasicInfo,
  timestamp: number,
  isMatched: boolean
}