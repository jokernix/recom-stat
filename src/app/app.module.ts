import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthState } from './auth/auth.state';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatesState } from './dashboard/dates.state';
import { StatDayComponent } from './dashboard/stat-day/stat-day.component';
import { StatHalfComponent } from './dashboard/stat-half/stat-half.component';
import { StatMonthComponent } from './dashboard/stat-month/stat-month.component';
import { StatWeekComponent } from './dashboard/stat-week/stat-week.component';
import { ApiPrefixInterceptor } from './interceptors/api-prefix.interceptor';
import { AppTokenInterceptor } from './interceptors/app-token.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { MaterialModule } from './material.module';
import { TimePipe } from './services/time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TimePipe,
    StatDayComponent,
    StatWeekComponent,
    StatHalfComponent,
    StatMonthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxsModule.forRoot([AuthState, DatesState], { developmentMode: !environment.production }),
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
