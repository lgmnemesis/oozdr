import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatchesPageRoutingModule } from './matches-routing.module';
import { MatchesPage } from './matches.page';
import { TopMenuModule } from 'src/app/components/top-menu/top-menu.module';
import { MatchesModule } from 'src/app/components/matches/matches.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchesPageRoutingModule,
    TopMenuModule,
    MatchesModule
  ],
  declarations: [MatchesPage]
})
export class MatchesPageModule {}
