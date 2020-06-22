// provisioning file
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProvAuthGuard } from './provisioning/core/prov-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'prov-start', pathMatch: 'full' },
  {
    path: 'prov-start',
    loadChildren: () => import('./provisioning/pages/prov-start/prov-start.module').then( m => m.ProvStartPageModule),
    canActivate: [ProvAuthGuard]
  },
  {
    path: 'prov-signin',
    loadChildren: () => import('./provisioning/pages/prov-signin/prov-signin.module').then( m => m.ProvSigninPageModule)
  },
  // Default redirect route rule if non of the above matches
  { path: '**', redirectTo: 'prov-start', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
