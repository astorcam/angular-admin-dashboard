import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-edit-form.component.html',
  styleUrl: './customer-edit-form.component.scss'
})
export class CustomerEditFormComponent {
  @Output() customerEdited = new EventEmitter<any>();
  @Output() customerCanceled = new EventEmitter<any>();
  @Input() name!: string; 
  @Input() country!: string; 
  @Input() email!: string; 
  @Input() id!: number;
  
  customerForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', Validators.required],
    });
  }
  
  onSubmit() {
    if (this.customerForm.valid) {
      const newCustomer = {
        id: this.id,
        ...this.customerForm.value
      };
      this.customerEdited.emit(newCustomer);
      this.customerForm.reset();
    }
  }
  onCancel() {
  this.customerCanceled.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.customerForm.patchValue({
      name: this.name,
      country: this.country,
      email: this.email,
    });
  }
}