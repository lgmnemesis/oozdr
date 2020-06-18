// provisioning file
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'prov-start', pathMatch: 'full' },
  {
    path: 'prov-start',
    loadChildren: () => import('./provisioning/pages/prov-start/prov-start.module').then( m => m.ProvStartPageModule)
  },
  // Default redirect route rule if non of the above matches
  { path: '**', redirectTo: 'prov-start', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
