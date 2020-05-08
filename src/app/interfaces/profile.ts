export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
}

export interface Connection {
  id: string;
  user_id: string;
  match_user_id: string;
  match_id: string;
  user_mobile: string; // the user that open the connection (user_id)
  user_profle_img_url: string;
  basicInfo: BasicInfo;
  createdAt?: firebase.firestore.Timestamp;
  isMatched: boolean;
  isNewMatch: boolean;
}

export interface BasicInfo {
  name: string;
  gender: string;
  email: string;
  birthday: string;
  mobile: string;
  profile_img_url: string;
  profile_img_file: any;
}

export interface Match {
  id: string;
  firstParty: Party;
  secondParty: Party;
  participates: string[];
  messages: Message[];
}

export interface Party {
  user_id: string;
  user_mobile: string;
}

export interface Message {
  id: string;
  user_id: string;
  user_name?: string;
  content: string;
  createdAt: Date | number
}