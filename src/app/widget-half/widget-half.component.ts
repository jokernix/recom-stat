import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { isWithinRange } from 'date-fns';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GetNextHalf, GetPrevHalf } from './store/widget-half.actions';
import { WidgetHalfModel, WidgetHalfState } from './store/widget-half.state';

@Component({
  selector: 'rec-widget-half',
  templateUrl: './widget-half.component.html',
  styleUrls: ['./widget-half.component.scss']
})
export class WidgetHalfComponent implements OnInit {
  half$: Observable<WidgetHalfModel>;
  isLastHalf: boolean;

  constructor(private store: Store) {}

  ngOnInit() {
    this.half$ = this.store.select(WidgetHalfState.getHalf).pipe(
      tap(data => {
        this.isLastHalf = isWithinRange(new Date(), data.start, data.end);
      })
    );
  }

  prevHalf() {
    this.store.dispatch(new GetPrevHalf());
  }

  nextHalf() {
    this.store.dispatch(new GetNextHalf());
  }
}
