export interface ToastMessage {
  header?: string;
  message: string;
  type: 'connection_added';
  id: string;
  isVisible: boolean;
  duration?: number;
  dismissButton?: boolean;
  dismissButtonText?: string;
  persistOnDismiss?: boolean;
}

export interface IonToastMessage {
  header?: string;
  message: string;
  duration?: number;
  position?: 'top'|'bottom'|'middle';
  buttons?: any[]
}