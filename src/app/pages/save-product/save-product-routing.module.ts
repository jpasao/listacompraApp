import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaveProductPage } from './save-product.page';

const routes: Routes = [
  {
    path: '',
    component: SaveProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveProductPageRoutingModule {}
