import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetCachedDataOfHalf } from './store/widget-half.actions';
import { WidgetHalfModel, WidgetHalfState } from './store/widget-half.state';

@Component({
  selector: 'rec-widget-half',
  templateUrl: './widget-half.component.html',
  styleUrls: ['./widget-half.component.scss']
})
export class WidgetHalfComponent {
  @Select(WidgetHalfState.getHalf) half$: Observable<WidgetHalfModel>;

  today: Date = new Date();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver, private store: Store) {}

  changeDay({ value }: MatDatepickerInputEvent<Date>) {
    this.store.dispatch(new GetCachedDataOfHalf(value));
  }
}
