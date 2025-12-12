import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  @Output() userAdded = new EventEmitter<any>();
  @Output() userCanceled = new EventEmitter<any>();
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      avatar: ['https://api.dicebear.com/9.x/dylan/png?seed=default'],
      purchases: [0, [Validators.min(0)]],
      created_at: [new Date().toISOString().split('T')[0]],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser = {
        ...this.userForm.value,
      };
      newUser.avatar='https://api.dicebear.com/9.x/dylan/png?seed='+newUser.email
      this.userAdded.emit(newUser);
      this.userForm.reset();
    }
  }
  onCancel() {
this.userCanceled.emit()}
}

