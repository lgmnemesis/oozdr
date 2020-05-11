import { Injectable } from '@angular/core';
import { SharedStoreService } from './shared-store.service';
import { Connection } from '../interfaces/profile';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private sharedStoreService: SharedStoreService,
    private router: Router) { }

  addMessage(matchId: string, messageContent: string) {
    const message = this.formatMessage(messageContent);
    this.sharedStoreService.addMatchMessage(matchId, message);
  }

  formatMessage(message: string): string {
    return message.replace(/(http[s]:\/\/[^ ]+)\s*?/g, '<a href="$1" ref="noopener noreferrer" target="_blank">$1</a>');
  }

  gotoMatch(connection: Connection) {
    this.sharedStoreService.activeMatchConnectionId = connection.id;
    if (connection.isNewMatch) {
      this.sharedStoreService.updateConnectionData(connection, {isNewMatch: false});
    }
    this.router.navigate(['/match', connection.id]).catch(error => console.error(error));
  }
}
