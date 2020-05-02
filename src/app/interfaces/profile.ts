export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
}

export interface Connection {
  id: string;
  user_id: string
  match_user_id: string,
  match_id: string,
  user_mobile: string, // the user that open the connection (user_id)
  basicInfo: BasicInfo,
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