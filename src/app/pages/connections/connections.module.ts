import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectionsPageRoutingModule } from './connections-routing.module';
import { ConnectionsPage } from './connections.page';
import { TopMenuModule } from 'src/app/components/top-menu/top-menu.module';
import { ConnectionsModule } from 'src/app/components/connections/connections.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { AlertsModule } from 'src/app/components/alerts/alerts.module';
import { ParallaxHeaderModule } from 'src/app/directives/parallax-header.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionsPageRoutingModule,
    TopMenuModule,
    ConnectionsModule,
    ScrollbarThemeModule,
    ParallaxHeaderModule,
    AlertsModule
  ],
  declarations: [ConnectionsPage]
})
export class ConnectionsPageModule {}
