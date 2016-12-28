import { Pipe, PipeTransform } from '@angular/core';

const _ =  window['_'];

@Pipe({name: 'sort'})
export class SortPipe implements PipeTransform {
  transform(ary: any[], sortProperty: string, desc: boolean = false): any[] {
    let ary2 = ary.slice(0);
    let nestedProperties = sortProperty.split('.');
    ary2.sort((a,b) => {
      let aVal = a;
      let bVal = b;
      _.each(nestedProperties, (p) => {
        aVal = aVal[p];
        bVal = bVal[p];
      });
      if(bVal === aVal) {
        return 0;
      }
      if (desc) {
        return bVal > aVal ? 1 : -1;
      } else {
        return bVal < aVal ? 1 : -1;
      }

    });
    return ary2;
  }
}
