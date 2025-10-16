import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sale-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.scss'
})
export class SaleFormComponent {
  @Output() saleAdded = new EventEmitter<any>();
  @Output() saleCancel = new EventEmitter<void>();

  saleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.saleForm = this.fb.group({
      productId: [null, Validators.required],
      userId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['Completed', Validators.required]
    });
  }
  onSubmit() {
    if (this.saleForm.valid) {
      const newSale = {
        id: Date.now(), // genera un ID temporal
        ...this.saleForm.value
      };
      this.saleAdded.emit(newSale);
      this.saleForm.reset();
    }
  }

  onCancel() {
    this.saleForm.reset();
    this.saleCancel.emit(); // útil si quieres cerrar el formulario desde el padre
  }
}

