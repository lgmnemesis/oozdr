import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvStartPageRoutingModule } from './prov-start-routing.module';

import { ProvStartPage } from './prov-start.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvStartPageRoutingModule
  ],
  declarations: [ProvStartPage]
})
export class ProvStartPageModule {}
