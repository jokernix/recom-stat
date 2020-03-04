import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { TimePipe } from '../core/services/time.pipe';
import { DashboardComponent } from './dashboard.component';
import { WidgetDayState } from './widget-period/store/widget-day.state';
import { WidgetHalfState } from './widget-period/store/widget-half.state';
import { WidgetMonthState } from './widget-period/store/widget-month.state';
import { WidgetWeekState } from './widget-period/store/widget-week.state';
import { WidgetPeriodComponent } from './widget-period/widget-period.component';

const MaterialModules = [
  MatButtonModule,
  MatCardModule,
  // MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatToolbarModule,
  // MatListModule,
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
  declarations: [DashboardComponent, WidgetPeriodComponent, TimePipe],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    NgxsModule.forFeature([WidgetDayState, WidgetWeekState, WidgetMonthState, WidgetHalfState]),
    ...MaterialModules
  ],
  providers: [{ provide: DateAdapter, useClass: MyDateAdapter }]
})
export class DashboardModule {}
