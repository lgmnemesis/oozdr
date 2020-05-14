import { Connection } from './profile';

export interface ConnectionsState {
  state: 'add' | 'edit' | 'view';
  connection?: Connection;
  prevState?: 'add' | 'edit' | 'view';
}