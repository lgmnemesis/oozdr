import { BasicInfo } from './registration';

export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
  connections: {
    user_id: string,
    info: BasicInfo,
    isMatched: boolean,
    matchId: string
  }[]
}