import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(sec: number = 0): any {
    const value = Math.abs(sec);
    let hours: number | string = Math.floor(value / 3600);
    let minutes: number | string = Math.floor((value - hours * 3600) / 60);
    let seconds: number | string = value - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return `${hours}:${minutes}:${seconds}`;
  }
}
