import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CognitoGuard} from "./cognito.guard";

const routes: Routes = [
  {
    path: 'upload',
    loadChildren: 'app/slides/slides.module#SlidesModule',
    canActivate: [CognitoGuard]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
