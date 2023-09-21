import {BehaviorSubject} from 'rxjs';
import { Injectable } from '@angular/core';
import { TodoService } from 'src/app/components/layout/services/todo.service';



/**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[]= [];
    item: string="";
    id : string="";
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {
    item: string="";
    level: number=0;
    expandable: boolean=false;
    id : string="";
  }
  
  


@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(private todoService: TodoService) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    this.getTodo();
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }



  getTodo(){
    return     this.todoService.getTodos().subscribe((res:any)=>{
      console.log(res)
      let todos:any = [];
      res.forEach((item:any) => {
        let todo = {
          children:[],
          item:item.task,
          id:item._id
        };
        todo.item = item.task;
        if(item.subtasks.length>0){
          item.subtasks.forEach((subtask:any)=>{
            let subtodo: TodoItemNode = {
              children:[],
              item:subtask.task,
              id:subtask._id
            };
            (todo.children as TodoItemNode[]).push(subtodo)
            subtodo.item = subtask.task.subtask;
          })
        }
        todos.push(todo)

      });

    this.dataChange.next(todos);
      
        
    })
  }
}