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

export interface Alert {
  id: string;
  title: string;
  content: string;
  dismissText: string;
  okText: string;
  action: {
    isAction: boolean;
    actionName: 'new_version';
    delay: number;
  }
}