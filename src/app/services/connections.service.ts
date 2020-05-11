import { Injectable } from '@angular/core';
import { SharedStoreService } from './shared-store.service';
import { Connection, Match, Message, LastMessage } from '../interfaces/profile';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private sharedStoreService: SharedStoreService,
    private router: Router) { }

  addMessage(match: Match, messageContent: string) {
    const message = this.formatMessage(messageContent);
    this.sharedStoreService.addMatchMessage(match, message);
  }

  formatMessage(message: string): string {
    return message.replace(/(http[s]:\/\/[^ ]+)\s*?/g, '<a href="$1" ref="noopener noreferrer" target="_blank">$1</a>');
  }

  gotoMatch(connection: Connection, lastMessage?: LastMessage) {
    this.sharedStoreService.activeMatchConnectionId = connection.id;
    if (connection.isNewMatch) {
      this.sharedStoreService.updateConnectionData(connection, {isNewMatch: false});
    } else if (lastMessage && lastMessage.hasNewMessages) {
      this.sharedStoreService.setMatchPartyHasReadMessages(lastMessage);
    }
    this.router.navigate(['/match', connection.id]).catch(error => console.error(error));
  }
}
