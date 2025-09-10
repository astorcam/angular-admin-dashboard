import { Component, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, CdkDropList, CdkDrag, CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent {
  @Input() columns: string[] = []; 
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: { key: string, label: string }[] = [];

labelMap: Record<string, string> = {};

ngOnChanges() {
  this.labelMap = this.displayedColumns.reduce((acc, col) => {
    acc[col.key] = col.label;
    return acc;
  }, {} as Record<string, string>);
}   

drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}

