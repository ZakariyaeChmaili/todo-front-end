import { Component, OnInit, ViewEncapsulation,Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';
import { FormComponent } from 'src/app/components/layout/form/form.component';
import { NodeService } from 'src/app/components/layout/services/node.service';
import { TodoService } from 'src/app/components/layout/services/todo.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { TodoItemFlatNode, TodoItemNode, ChecklistDatabase } from 'src/app/components/layout/todos/ChecklistDatabase';

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
  // selectedFiles: TreeNode[] = [];
  action:boolean = false;
  selectedMulti :any=[];
  parentLength:number=0;
  parentChecked :boolean = false;
  showUpdate :boolean = false;




    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  
    /** A selected parent node to be inserted */
    selectedParent: TodoItemFlatNode | null = null;
  
    /** The new item's name */
    newItemName = '';
  
    treeControl: FlatTreeControl<TodoItemFlatNode>;
  
    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  
    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  
    /** The selection for checklist */
    public checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);



  constructor(private todoService: TodoService,private dialog:MatDialog,private _database: ChecklistDatabase) {

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    console.log(this.dataSource)
   }

  ngOnInit() {


  this._database.dataChange.subscribe(data => {
    this.dataSource.data = data;
    console.log(data)
  });


  }
  
  // getLevel = (node: TodoItemFlatNode) => node.level;

  getLevel(node: TodoItemFlatNode){
    return node.level
  }

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };




  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    console.log("inside the parent select ")

 
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    console.log(this.checklistSelection.selected)
    this.parentLength = this.checklistSelection.selected.length;
    this.parentChecked = this.checklistSelection.isSelected(node);

  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
      
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
  
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  // shouldShowUpdateButton(): boolean {
  //   console.log("inside the should show update button")
  //   let parentCount = 0;
  //   // console.log(this.checklistSelection.changed)
  //   this.checklistSelection.changed.subscribe((res)=>{
  //     // console.log("inside the subscribe")
  //     // console.log(res)
  //   })
  //   // console.log(this.checklistSelection)
  //   // console.log(this.parentChecked)
  //   // console.log(this.parentLength)
  //   if (this.checklistSelection.selected.length === 1) {
  //     return true; // Show the button when a single item is selected
  //   } else if (this.checklistSelection.selected.length > 0) {
  //     if(this.parentChecked && this.parentLength === this.checklistSelection.selected.length){
  //        this.checklistSelection.selected.forEach((item:any)=>{
  //       if(item.level === 0){
  //          parentCount++;
  //       }
  //      })
  //         console.log(parentCount)
  //       return parentCount==1;
  //     }
      
  //     // Check if any of the selected items have children
  //     // return this.checklistSelection.selected.some(node => node.expandable);
  //   }
  //   return false; // Hide the button when no items are selected
  // }
  
  


  // shouldShowUpdateButton2() {
  //   console.log("inside the should show update button2")
  //   let parentCount = 0;
  //   console.log(this.checklistSelection.changed)
  //   this.checklistSelection.changed.subscribe((res:any)=>{
  //     console.log("inside the subscribe")
  //     // console.log(res)
  //     if (res.added.length === 1) {
  //       this.showUpdate= true; // Show the button when a single item is selected
  //     } else if (res.added.length > 0) {
  //       if(this.parentChecked && this.parentLength === res.added.length){
  //          res.added.forEach((item:any)=>{
  //         if(item.level === 0){
  //            parentCount++;
  //         }
  //        })
  //           console.log(parentCount)
  //         this.showUpdate =  parentCount==1;
  //       }
        
  //       // Check if any of the selected items have children
  //       // return this.checklistSelection.selected.some(node => node.expandable);
  //     }
  //     else{
  //       this.showUpdate=false;
  //     }
  //   })

  // }
  



getTodos(){
  this._database.getTodo();
}


addTodo(){
  let dialogFormRef = this.dialog.open(FormComponent,{
    position:{
      top:'8%',
    }
  });
  dialogFormRef.afterClosed().subscribe((res)=>{
        this.getTodos();
  })
}




delete(){
  let ids = this.checklistSelection.selected.map((item:any)=>{return item.id})
    this.todoService.deleteManyTodo(ids).subscribe((res)=>{
      this.getTodos();
    })
    this.checklistSelection.clear();

}


update(){
  let todo = this.checklistSelection.selected[0];
  let dialogFormRef = this.dialog.open(FormComponent,{
    position:{
      top:'8%',
    },
    data:todo
  });

  dialogFormRef.afterClosed().subscribe((res)=>{
    this.getTodos();
  })

  this.checklistSelection.clear();

}


}
