import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { AuthState } from './auth/store/auth.state';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetDayState } from './dashboard/widget-period/store/widget-day.state';
import { WidgetHalfState } from './dashboard/widget-period/store/widget-half.state';
import { WidgetMonthState } from './dashboard/widget-period/store/widget-month.state';
import { WidgetWeekState } from './dashboard/widget-period/store/widget-week.state';
import { WidgetPeriodComponent } from './dashboard/widget-period/widget-period.component';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { AppTokenInterceptor } from './interceptors/app-token.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { MaterialModule } from './material.module';
import { TimePipe } from './services/time.pipe';

@NgModule({
  declarations: [AppComponent, LoginComponent, DashboardComponent, TimePipe, WidgetPeriodComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxsModule.forRoot(
      [AuthState, WidgetDayState, WidgetWeekState, WidgetMonthState, WidgetHalfState],
      { developmentMode: !environment.production }
    ),
    NgxsStoragePluginModule.forRoot({
      key: ['auth.user']
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
