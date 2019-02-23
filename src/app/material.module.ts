import { Injectable, NgModule } from '@angular/core';
import {
  DateAdapter,
  MatDatepickerModule,
  MatListModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  NativeDateAdapter
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule
];

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
  }
}

@NgModule({
  imports: [...materialModules],
  exports: [...materialModules],
  providers: [{ provide: DateAdapter, useClass: MyDateAdapter }]
})
export class MaterialModule {}
