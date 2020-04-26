import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WelcomeContainerComponent } from './welcome-container.component';
import { WelcomeInfoModule } from '../welcome-info/welcome-info.module';
import { WelcomeService } from 'src/app/services/welcome.service';
import { WelcomeMobileVerificationModule } from '../welcome-mobile-verification/welcome-mobile-verification.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, WelcomeInfoModule, WelcomeMobileVerificationModule],
  providers: [WelcomeService],
  declarations: [WelcomeContainerComponent],
  exports: [WelcomeContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeContainerModule { }