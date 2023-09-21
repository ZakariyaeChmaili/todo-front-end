import { TodoService } from './../services/todo.service';
import {Component, Inject} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  taskForm!: FormGroup;
  taskFormUpdate!: FormGroup;
  update :boolean = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormComponent>,
    private todoService : TodoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    console.log(this.data)
    if(this.data){
      this.update = true;
    }
    this.taskForm = this.fb.group({
      task:[''],
      subtasks: this.fb.array([])
    });
    this.taskFormUpdate = this.fb.group({
      task:[this.data.item],
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


  updateTask(){
    console.log(this.taskFormUpdate.value);
    this.todoService.updateTask(this.taskFormUpdate.value,this.data.id).subscribe((res)=>{
      console.log(res);
    this.dialogRef.close();

    })

  }


}



