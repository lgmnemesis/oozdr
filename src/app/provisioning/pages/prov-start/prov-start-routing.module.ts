import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvStartPage } from './prov-start.page';

const routes: Routes = [
  {
    path: '',
    component: ProvStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvStartPageRoutingModule {}
