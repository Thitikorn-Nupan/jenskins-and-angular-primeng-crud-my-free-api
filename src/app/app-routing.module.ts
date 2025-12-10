import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ToDoOneToManyComponent} from "./components/to-do-one-to-many/to-do-one-to-many.component";

const routes: Routes = [
  { path: 'to-do-one-to-many', component: ToDoOneToManyComponent },
];

@NgModule({
  // {useHash: true} just the easy way for deploy many routing app ** Not good for production
  imports: [RouterModule.forRoot(routes)], // ,{useHash: true}
  exports: [RouterModule]
})
export class AppRoutingModule { }
