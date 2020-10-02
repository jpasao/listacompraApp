import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },  
  {
    path: '',
    loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
  },  
  {
    path: '',
    loadChildren: () => import('../pages/save-product/save-product.module').then(m => m.SaveProductPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
