import { Injectable } from '@angular/core';
import { SharedStoreService } from './shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private sharedStoreService: SharedStoreService) { }

  addMessage(messageContent: string) {
    const message = this.formatMessage(messageContent);
    this.sharedStoreService.addMatchMessage(message);
  }

  formatMessage(message: string): string {
    return message.replace(/(http[s]:\/\/[^ ]+)\s*?/g, '<a href="$1" ref="noopener noreferrer" target="_blank">$1</a>');
  }
}
