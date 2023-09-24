import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {env} from 'env';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private api : string = env.api;
  constructor(private http : HttpClient) { }

  getTodos(){
    return this.http.get(`${this.api}/api/todos`);
  }

  addTask(task : any){
    return this.http.post(`${this.api}/api/todos`, task);
  }


  markAsDone(task : any){
    return this.http.put(`${this.api}/api/todos/`+task.id, task);
  }

  deleteTodo(task:any){
    console.log(task.node._id)
    return this.http.delete(`${this.api}/api/todos/`+task.node._id);
  }


  deleteManyTodo(ids:any[]){
    return this.http.post(`${this.api}/api/todos/deleteMany`, ids);
  }

  updateTask(task:any,id:any){
    return this.http.put(`${this.api}/api/todos/`+id, task);

  }


}


