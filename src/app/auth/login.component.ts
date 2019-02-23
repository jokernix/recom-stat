import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login } from './store/auth.actions';

@Component({
  selector: 'rec-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {}

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: this.fb.control(null),
      password: this.fb.control(null)
    });
  }

  onSubmit() {
    const { email, password } = this.form.value;
    this.store.dispatch(new Login(email, password));
  }
}
