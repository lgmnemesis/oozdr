import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { WelcomeGuard } from './core/welcome.guard';
import { ConnectionsGuard } from './core/connections.guard';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [AuthGuard, WelcomeGuard]
  },
  {
    path: 'connections',
    loadChildren: () => import('./pages/connections/connections.module').then( m => m.ConnectionsPageModule),
    canActivate: [AuthGuard, ConnectionsGuard]
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
