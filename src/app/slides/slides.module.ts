import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidesRoutingModule } from './slides-routing.module';
import { SlideUploadComponent } from './slide-upload/slide-upload.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SlidesRoutingModule,
    MatCardModule
  ],
  declarations: [SlideUploadComponent],
  exports: [SlideUploadComponent]
})
export class SlidesModule { }
