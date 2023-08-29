import { TodoService } from './../services/todo.service';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormComponent>,
    private todoService : TodoService
  ) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      task:[''],
      subtasks: this.fb.array([])
    });
  }

  get subTaskForms() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    let subTask = this.fb.group({
      subtask: ['']
    });
    this.subTaskForms.push(subTask);
    console.log(subTask.value);
    console.log(this.taskForm.value);

  }

  removeSubTask(i: number) {
    this.subTaskForms.removeAt(i);
  }

  addTask(){
    console.log(this.taskForm.value);
    console.log(this.taskForm.get('subtasks')?.value);
    this.todoService.addTask(this.taskForm.value).subscribe((res)=>{
      console.log(res);
    this.dialogRef.close();

    })

  }
}
