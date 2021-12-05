import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'days'
})
export class DaysPipe implements PipeTransform {
  transform(sec: number = 0): number {
    return Math.floor(Math.abs(sec) / (60 * 60 * 8));
  }
}
