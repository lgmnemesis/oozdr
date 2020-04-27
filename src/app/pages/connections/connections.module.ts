import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectionsPageRoutingModule } from './connections-routing.module';
import { ConnectionsPage } from './connections.page';
import { TopMenuModule } from 'src/app/components/top-menu/top-menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionsPageRoutingModule,
    TopMenuModule
  ],
  declarations: [ConnectionsPage]
})
export class ConnectionsPageModule {}
