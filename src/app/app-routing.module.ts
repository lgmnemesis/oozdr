import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { WelcomeGuard } from './core/welcome.guard';
import { AuthGuard } from './core/auth.guard';
import { HomeGuard } from './core/home.guard';
import { NoGuard } from './core/no.guard';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule),
    canActivate: [HomeGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [WelcomeGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'connections',
    loadChildren: () => import('./pages/connections/connections.module').then( m => m.ConnectionsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'matches',
    loadChildren: () => import('./pages/matches/matches.module').then( m => m.MatchesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'match/:cid',
    loadChildren: () => import('./pages/matches/matches.module').then( m => m.MatchesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'terms',
    loadChildren: () => import('./pagese/terms/terms.module').then( m => m.TermsPageModule),
    canActivate: [NoGuard]
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pagese/privacy/privacy.module').then( m => m.PrivacyPageModule),
    canActivate: [NoGuard]
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule),
    canActivate: [NoGuard]
  },
  {
    path: 'support',
    loadChildren: () => import('./pagese/support/support.module').then( m => m.SupportPageModule),
    canActivate: [NoGuard]
  },
  {
    path: 'unsubscribe/:id',
    loadChildren: () => import('./pages/unsubscribe/unsubscribe.module').then( m => m.UnsubscribePageModule),
    canActivate: [NoGuard]
  },
  // Default redirect route rule if non of the above matches
  { path: '**', redirectTo: 'start', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
