import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvSigninPageRoutingModule } from './prov-signin-routing.module';

import { ProvSigninPage } from './prov-signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProvSigninPageRoutingModule
  ],
  declarations: [ProvSigninPage]
})
export class ProvSigninPageModule {}
