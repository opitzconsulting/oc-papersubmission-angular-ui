import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule, MatIconModule, MatMenuModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {CognitoGuard} from "./cognito.guard";
import {CognitoService} from "./aws/cognito.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [CognitoGuard, CognitoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
