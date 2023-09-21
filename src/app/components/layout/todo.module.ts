import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import {  TodosComponent } from './todos/todos.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTreeModule} from '@angular/material/tree';
import { SpeedDialModule } from 'primeng/speeddial';
import {ToastModule} from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { NodeService } from 'src/app/components/layout/services/node.service';
import { FormComponent } from './form/form.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ChecklistDatabase } from 'src/app/components/layout/todos/ChecklistDatabase';

@NgModule({
  declarations: [
    TodosComponent,
    LayoutComponent,
    FormComponent

  ],
  exports: [
    TodosComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    FormsModule,
    MatTreeModule,
    SpeedDialModule,
    ToastModule,
    TreeModule,
    MatDialogModule,
    ReactiveFormsModule


  ],
  providers:[
    NodeService,
    ChecklistDatabase
  ]
})
export class TodoModule { }
