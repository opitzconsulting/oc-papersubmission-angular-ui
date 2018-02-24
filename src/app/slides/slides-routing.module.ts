import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlideUploadComponent } from './slide-upload/slide-upload.component';

const routes: Routes = [
  {
    path: '',
    component: SlideUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidesRoutingModule { }
