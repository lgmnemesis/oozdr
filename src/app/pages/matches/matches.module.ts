import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatchesPageRoutingModule } from './matches-routing.module';
import { MatchesPage } from './matches.page';
import { TopMenuModule } from 'src/app/components/top-menu/top-menu.module';
import { MatchesModule } from 'src/app/components/matches/matches.module';
import { ChatContentViewModule } from 'src/app/components/chat-content-view/chat-content-view.module';
import { ChatInputViewModule } from 'src/app/components/chat-input-view/chat-input-view.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { MatchOptionsModule } from 'src/app/components/match-options/match-options.module';
import { MatchDetailsModule } from 'src/app/components/match-details/match-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesPageRoutingModule,
    TopMenuModule,
    MatchesModule,
    ChatContentViewModule,
    ChatInputViewModule,
    ScrollbarThemeModule,
    MatchOptionsModule,
    MatchDetailsModule
  ],
  declarations: [MatchesPage]
})
export class MatchesPageModule {}
