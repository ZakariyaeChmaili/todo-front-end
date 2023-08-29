import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { TodosComponent } from 'src/app/components/layout/todos/todos.component';

const routes: Routes = [
  { path:'', component:LayoutComponent,children:[
    {path:'todos',component:TodosComponent}
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
