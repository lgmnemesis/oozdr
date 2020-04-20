import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StartPageRoutingModule } from './start-routing.module';
import { StartPage } from './start.page';
import { SignInModalModule } from 'src/app/components/sign-in-modal/sign-in-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule,
    SignInModalModule
  ],
  declarations: [StartPage]
})
export class StartPageModule {}
