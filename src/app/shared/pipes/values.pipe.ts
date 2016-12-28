import { Pipe, PipeTransform } from '@angular/core';

const _ =  window['_'];

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
  transform(obj: {}): any[] {
    let ary = [];
      _.each(obj, (val, key) => {
        ary.push( { key: key, value: val});
      });
    return ary;
  }
}
