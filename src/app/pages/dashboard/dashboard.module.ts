import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { TopMenuModule } from 'src/app/components/top-menu/top-menu.module';
import { MatchesModule } from 'src/app/components/matches/matches.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    TopMenuModule,
    MatchesModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
