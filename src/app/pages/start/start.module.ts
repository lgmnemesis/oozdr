import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StartPageRoutingModule } from './start-routing.module';
import { StartPage } from './start.page';
import { SignInModalModule } from 'src/app/components/sign-in-modal/sign-in-modal.module';
import { SiteFooterModalModule } from 'src/app/components/site-footer-modal/site-footer-modal.module';
import { ScrollbarThemeModule } from 'src/app/directives/scrollbar-theme.directive';
import { ParallaxHeaderModule } from 'src/app/directives/parallax-header.directive';
import { SiteFooterModule } from 'src/app/components/site-footer/site-footer.module';
import { WhyOozdrModule } from 'src/app/components/why-oozdr/why-oozdr.module';
import { SocialShareModule } from 'src/app/components/social-share/social-share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule,
    SignInModalModule,
    SiteFooterModalModule,
    ScrollbarThemeModule,
    ParallaxHeaderModule,
    WhyOozdrModule,
    SiteFooterModule,
    SocialShareModule
  ],
  declarations: [StartPage]
})
export class StartPageModule {}
