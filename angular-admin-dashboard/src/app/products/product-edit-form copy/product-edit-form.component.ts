import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-edit-form.component.html',
  styleUrl: './product-edit-form.component.scss'
})
export class ProductEditFormComponent {
  @Output() productEdited = new EventEmitter<any>();
  @Output() productCanceled = new EventEmitter<any>();
  @Input() name!: string; 
  @Input() category!: string; 
  @Input() price!: number; 
  @Input() stock!: number;
  @Input() id!: number;
  
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
        id: this.id,
        ...this.productForm.value
      };
      this.productEdited.emit(newProduct);
      this.productForm.reset();
    }
  }
  onCancel() {
  this.productCanceled.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.productForm.patchValue({
      name: this.name,
      category: this.category,
      price: this.price,
      stock: this.stock
    });
  }
}