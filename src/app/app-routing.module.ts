import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
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
