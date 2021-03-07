import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AuthComponent } from './auth.component';

@NgModule({
  imports: [ CommonModule, IonicModule,],
  declarations: [AuthComponent],
  exports: [AuthComponent]
})
export class AuthComponentModule {}
