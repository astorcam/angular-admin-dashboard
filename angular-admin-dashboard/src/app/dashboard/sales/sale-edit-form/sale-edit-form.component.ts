import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-sale-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-edit-form.component.html',
  styleUrl: './sale-edit-form.component.scss'
})
export class SaleEditFormComponent {
  @Output() saleEdited = new EventEmitter<any>();
  @Output() saleCancel = new EventEmitter<void>();
  @Input() usersList: any[] = [];
  @Input() productList: any[] = [];
  
  @Input() id!: number;
  @Input() productName!: string; 
  @Input() buyerName!: string; 
  @Input() quantity!: number; 
  @Input() total!: number;
  @Input() date!: string;
  @Input() status!: string;

  saleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.saleForm = this.fb.group({
      productName: ["", Validators.required],
      buyerName: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      status: ["", Validators.required]
    });
  }
  onSubmit() {
    if (this.saleForm.valid) {
      const newSale = {
        id: this.id,
        ...this.saleForm.value
      };
      this.saleEdited.emit(newSale);
      this.saleForm.reset();
    }
  }

  onCancel() {
    this.saleForm.reset();
    this.saleCancel.emit(); // útil si quieres cerrar el formulario desde el padre
  }

   ngOnChanges(changes: SimpleChanges) {
    this.saleForm.patchValue({
      productName: this.productName,
      buyerName: this.buyerName,
      total: this.total,
      quantity: this.quantity,
      date: this.date,
      status: this.status,
    });
  }
}

