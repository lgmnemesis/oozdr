import { BasicInfo } from './registration';

export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
  connections: string; // should be an object
}