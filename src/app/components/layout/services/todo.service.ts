import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http : HttpClient) { }

  getTodos(){
    return this.http.get('http://localhost:8000/api/todos');
  }

  addTask(task : any){
    return this.http.post('http://localhost:8000/api/todos', task);
  }


  markAsDone(task : any){
    return this.http.put('http://localhost:8000/api/todos/'+task.id, task);
  }

  deleteTodo(task:any){
    console.log(task.node._id)
    return this.http.delete('http://localhost:8000/api/todos/'+task.node._id);
  }


  deleteManyTodo(tasks:any[]){
    let ids:any[] = [];
    tasks.forEach((item:any)=>{
      ids.push(item.node._id)
    })

    return this.http.post('http://localhost:8000/api/todos/deleteMany', ids);
  }
}


