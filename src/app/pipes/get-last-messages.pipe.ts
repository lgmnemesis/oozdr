import { Pipe, PipeTransform } from '@angular/core';
import { Connection, Match, LastMessage } from '../interfaces/profile';

@Pipe({
  name: 'getLastMessages'
})
export class GetLastMessagesPipe implements PipeTransform {

  transform(connection: Connection, matches: Match[]): any {
    const lastMessage: LastMessage = {message: null, hasNewMessages: false, isFirstParty: false, match: null};
    if (matches && connection) {
      matches.forEach(match => {
        if (match.id === connection.match_id) {
          lastMessage.message = match.messages[match.messages.length - 1];
          const isFirstParty = match.firstParty.user_id == connection.user_id;
          if (isFirstParty) {
            lastMessage.hasNewMessages = match.firstParty.hasNewMessages;
          } else {
            lastMessage.hasNewMessages = match.secondParty.hasNewMessages;
          }
          lastMessage.isFirstParty = isFirstParty;
          lastMessage.match = match;
        }
      });
    }
    return lastMessage;
  }

}
