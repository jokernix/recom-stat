import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs';
import { DestroyService } from '../core/services/destroy.service';
import { Login } from './store/auth.actions';

@Component({
  selector: 'rec-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DestroyService],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private destroy$: DestroyService
  ) {}

  get token() {
    return this.form.get('token');
  }

  ngOnInit() {
    this.form = this.fb.group({
      token: this.fb.control('', Validators.required),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    const { token } = this.form.value;
    this.store
      .dispatch(new Login(token))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate(['/dashboard']));
  }
}
