import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { AngularIbanModule } from 'angular-iban';
import { HomePageRoutingModule } from './home-routing.module';
import { StoreModule } from '@ngrx/store';
import { transfersReducer } from '../state/transfers.reducers';
import { TransfersComponent } from './components/transfers/transfers.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AngularIbanModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ transfers: transfersReducer })
  ],
  declarations: [
    HomePage,
    TransfersComponent
  ]
})
export class HomePageModule {}
