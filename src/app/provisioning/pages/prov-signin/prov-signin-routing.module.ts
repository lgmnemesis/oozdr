import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvSigninPage } from './prov-signin.page';

const routes: Routes = [
  {
    path: '',
    component: ProvSigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvSigninPageRoutingModule {}
