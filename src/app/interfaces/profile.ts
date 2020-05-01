export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
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

export interface BasicInfo {
  name: string;
  gender: string;
  email: string;
  birthday: string;
  mobile: string;
  profilePhoto: string;
  profilePhotoOrg: string;
}

export interface Match {
  party1: Profile,
  party2: Profile
}