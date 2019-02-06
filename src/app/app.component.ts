import { Component } from '@angular/core';

@Component({
  selector: 'rec-root',
  template: `
    <mat-sidenav-container>
      <router-outlet></router-outlet>
    </mat-sidenav-container>
  `
})
export class AppComponent {}
