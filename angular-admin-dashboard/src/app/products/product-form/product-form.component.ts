import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  @Output() productAdded = new EventEmitter<any>();
  @Output() productCanceled = new EventEmitter<any>();
  productForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }
  
  onSubmit() {
    if (this.productForm.valid) {
      const newProduct = {
        id: Date.now(), // genera un ID temporal
        ...this.productForm.value
      };
      this.productAdded.emit(newProduct);
      this.productForm.reset();
    }
  }
  onCancel() {
  this.productCanceled.emit();
  }
}