export interface Profile {
  user_id: string,
  timestamp: number,
  basicInfo: BasicInfo;
  fcmToken?: string;
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
  lastMessage?: Message;
  isBlocked?: boolean;
}

export interface BasicInfo {
  name: string;
  gender: string;
  email: string;
  birthday: string;
  mobile: string;
  profile_img_url: string;
  profile_img_file: any;
  welcome_msg: string;
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
  hasNewMessages?: boolean;
}

export interface Message {
  id: string;
  user_id: string;
  match_id: string;
  user_name?: string;
  content: string;
  createdAt: Date | number
}

export interface LastMessage {
  message: Message, 
  hasNewMessages: boolean;
  isFirstParty: boolean;
  match: Match;
}