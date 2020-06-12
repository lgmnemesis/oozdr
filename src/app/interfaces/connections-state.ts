import { Connection } from './profile';

export interface ConnectionsState {
  state: 'add' | 'edit' | 'add_closure' | 'edit_closure' | 'view';
  connection?: Connection;
  prevState?: 'add' | 'edit' | 'add_closure' | 'edit_closure' | 'view';
}