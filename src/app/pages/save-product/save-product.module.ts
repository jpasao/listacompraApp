import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaveProductPageRoutingModule } from './save-product-routing.module';

import { SaveProductPage } from './save-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaveProductPageRoutingModule
  ],
  declarations: [SaveProductPage]
})
export class SaveProductPageModule {}
