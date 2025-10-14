import { Component, EventEmitter, Input, Output, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';




@Component({
  selector: 'app-data-table',
  imports: [MatTableModule , CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent {
  @Input() type!: 'products' | 'users';
  @Output() addClicked = new EventEmitter<void>();
  @Input() columns: string[] = []; 
  @Input() displayedColumns: { key: string, label: string }[] = [];
  @Input() set dataSource(data: any[]) {
    this.tableDataSource.data = data; 
  }
  
  tableDataSource = new MatTableDataSource<any>([]);
  
  labelMap: Record<string, string> = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor() {
    // Assign the data to the data source for the table to render
    this.tableDataSource = new MatTableDataSource(this.dataSource);
  }
  
  ngOnChanges() {
    this.labelMap = this.displayedColumns.reduce((acc, col) => {
      acc[col.key] = col.label;
    return acc;
  }, {} as Record<string, string>);
}   

ngAfterViewInit() {
  this.tableDataSource.paginator = this.paginator;
  this.tableDataSource.sort = this.sort;
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.tableDataSource.filter = filterValue.trim().toLowerCase();
  
  if (this.tableDataSource.paginator) {
    this.tableDataSource.paginator.firstPage();
  }
}
onAdd() {
this.addClicked.emit();}
}

