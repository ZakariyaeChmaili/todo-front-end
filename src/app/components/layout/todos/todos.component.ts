import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';
import { FormComponent } from 'src/app/components/layout/form/form.component';
import { NodeService } from 'src/app/components/layout/services/node.service';
import { TodoService } from 'src/app/components/layout/services/todo.service';

interface Todo {
  title: string;
  chileTask: {
    title: string;
    completed: boolean;
  };
  completed: boolean;
}

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class TodosComponent implements OnInit {
  files!: TreeNode[];
todos : TreeNode[]=[];
  selectedFiles: TreeNode[] = [];
  action:boolean = false;
  selectedNodes: TreeNode[] = [];
  constructor(private todoService: TodoService,private dialog:MatDialog) { }
 items = [
    {
        icon: 'pi pi-pencil',
        // command: () => {
        //     this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        // }
    },
    {
        icon: 'pi pi-refresh',
        // command: () => {
        //     this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        // }
    },
    {
        icon: 'pi pi-trash',
        // command: () => {
        //     this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        // }
    },
    {
        icon: 'pi pi-upload',
        routerLink: ['/fileupload']
    },
    {
        icon: 'pi pi-external-link',
        target: '_blank',
        url: 'http://angular.io'
    }
];
  ngOnInit() {



    this.todoService.getTodos().pipe(
      tap((todos: any) => console.log(todos)),
      map((todos: any[]) => {
        return todos.map((todo: any, index: number) => {
          const todoKey = `${index}`;
          todo.key = todoKey;
          todo.label = todo.task;
          todo.completed = todo.completed;
          todo.disabled = true;
          todo.children = todo.subtasks.map((subtask: any, subIndex: number) => {
            const subtaskKey = `${todoKey}-${subIndex}`;
            subtask.key = subtaskKey;
            subtask.label = subtask.task.subtask;
            subtask.completed = subtask.task.completed;
            return subtask;
          });
          return todo;
        });
      }),
      tap((todos: any) => console.log(todos))
    ).subscribe((res)=>{
      this.todos= res
    });


  }







addTodo(){
  let dialogFormRef = this.dialog.open(FormComponent,{
    position:{
      top:'8%',
    }
  });
}



selectedNode(node:any){

this.selectedNodes.push(node);
console.log(this.selectedNodes)
  console.log(node)
  if(this.selectedNodes.length>0){
    this.action = true;
  }

}

unselectNode(node:any){
  // this.selectedNodes = this.selectedNodes.filter((item:any)=>item.key !== node.key)
  this.selectedNodes.findIndex((item:any)=>item.key == node.key)
  this.selectedNodes.splice(this.selectedNodes.findIndex((item:any)=>item.key == node.key),1)
  if(this.selectedNodes.length==0){
    this.action = false;
  }
}

delete(){
  if(this.selectedNodes.length==1){
    let node :any = this.selectedNodes[0]
    console.log(node.node.key)
    this.todoService.deleteTodo(this.selectedNodes[0]).subscribe((res)=>{
      this.selectedNodes.splice(this.selectedNodes.findIndex((item:any)=>item.key == node.key),1)
      this.todos.forEach((item:any)=>{
        console.log(item.key)
        if(item.key==node.node.key){
          console.log("inside if ")
          let i = this.todos.findIndex((item: any) => item.key === node.node.key);
          this.todos.splice(i,1)
        }
      })
      console.log(res)
    })
  }else{
    this.todoService.deleteManyTodo(this.selectedNodes).subscribe((res)=>{
      this.selectedNodes.forEach((item:any)=>{
        this.todos.forEach((todo:any)=>{
          todo.children.forEach((subtask:any)=>{
            if(subtask.key==item.node.key){
              let i = todo.children.findIndex((item: any) => item.key === subtask.key);
              todo.children.splice(i,1)
            }
          })
        })
      })
      this.selectedNodes = [];
      this.action = false;
      console.log(res)
    })
  }
  console.log(this.selectedNodes)
}

}
