export interface ToastMessage {
  header?: string;
  message: string;
  duration?: number;
}

export interface IonToastMessage {
  header?: string;
  message: string;
  duration?: number;
  position?: 'top'|'bottom'|'middle';
  buttons?: any[]
}