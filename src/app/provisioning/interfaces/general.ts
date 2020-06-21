import { Profile, Connection } from 'src/app/interfaces/profile';
import { Subscription } from 'rxjs';

export interface UserData {
  profile: Profile;
  connectionsData: {
    connections: Connection[];
    _connections: Subscription;
  }
}