import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxsModule } from '@ngxs/store';
import { LoginComponent } from './login.component';
import { AuthState } from './store/auth.state';
import { ThirdPartyComponent } from './third-party.component';

const MaterialModules = [
  MatCardModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
];

@NgModule({
  declarations: [LoginComponent, ThirdPartyComponent],
  imports: [CommonModule, NgxsModule.forFeature([AuthState]), ...MaterialModules],
  exports: [LoginComponent, ThirdPartyComponent],
})
export class AuthModule {}
