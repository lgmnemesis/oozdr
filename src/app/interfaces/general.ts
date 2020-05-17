export interface FileUpload {
  id: string;
  url: string;
  isSelected: boolean;
}

export interface FcmState {
  isRegistered: boolean;
  isSubscribed: boolean;
}

export interface Feedback {
  name: string;
  email: string;
  message: string;
}