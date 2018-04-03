import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidesRoutingModule } from './slides-routing.module';
import { SlideUploadComponent } from './slide-upload/slide-upload.component';
import { MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  imports: [
    CommonModule,
    SlidesRoutingModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  declarations: [SlideUploadComponent],
  exports: [SlideUploadComponent]
})
export class SlidesModule { }
