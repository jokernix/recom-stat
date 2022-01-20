import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { LoginComponent } from './auth/login.component';
import { ThirdPartyComponent } from './auth/third-party.component';
import { ThirdPartyGuard } from './auth/third-party.guard';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'oauth',
    canActivate: [ThirdPartyGuard],
    component: ThirdPartyComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard').then((m) => m.DashboardModule),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatSidenavModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot({ collapsed: true }),
    NgxsStoragePluginModule.forRoot({ key: ['auth'] }),
    CoreModule,
    AuthModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
