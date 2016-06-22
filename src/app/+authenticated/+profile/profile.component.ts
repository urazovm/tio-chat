import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../shared/current-user/current-user.service';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { MdCard } from '@angular2-material/card';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { SortPipe } from '../../shared/pipes/sort.pipe';

const _ = window['_'];

@Component({
  moduleId: 'taranio',
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  directives: [MD_TABS_DIRECTIVES, MdCard],
  pipes: [ValuesPipe,SortPipe],
})
export class ProfileComponent {
  overwatchDataObservable: any;
  overwatchData: any;
  rankings: any = {};
  today: any = {};
  week: any = {};
  month: any = {};
  headers: any[] = [];
  rows: any[] = [];
  lastSort: string;
  scrollTop: number = 0;
  scrollLeft: number = 0;
  constructor(public currentUser: CurrentUserService) {

  }

  _createStatDiff(current, old) {
    const diff = _.cloneDeep(current);
    _.each(current, (champ, champKey) => {
      _.each(champ, (category,categoryKey) => {
        _.each(category, (stat, statKey) => {
          diff[champKey][categoryKey][statKey] = {};
          diff[champKey][categoryKey][statKey].current = stat;
          try {
            let oldStat = old[champKey] && [categoryKey] && [statKey] ?
            old[champKey][categoryKey][statKey] : '0';
            oldStat = parseFloat(oldStat.replace(/,/gi,''));
            let newStat = parseFloat(stat.replace(/,/gi,''));
            diff[champKey][categoryKey][statKey].change = Math.ceil((newStat - oldStat) * 100)/100;
          }
          catch(e) {
            //console.log(e);
          }
        });
      })

    });
    return diff;
  }

  _createRankings(current, rankings) {
    const diff = _.cloneDeep(current);
    _.each(current, (champ, champKey) => {
      _.each(champ, (category, categoryKey) => {
        _.each(category, (stat, statKey) => {
          try {
            let ranks = rankings[champKey][categoryKey][statKey].split('/');
            let color = 'black';
            if (ranks[0]/ranks[1] < .3) {
              color = 'green';
            } else if(ranks[0]/ranks[1]>.7) {
              color = 'red';
            }
            diff[champKey][categoryKey][statKey] = {
              current: stat,
              color: color,
              ranking: rankings[champKey][categoryKey][statKey],
            };
          }
          catch(e) {
            diff[champKey][categoryKey][statKey] = {
              current: stat,
              color: 'black',
              ranking: 'N/A',
            };
          }
        });
      });
    });
    return diff;
  }

  ngOnInit() {
    this.overwatchDataObservable = this.currentUser.getOverwatchData();
    this.overwatchDataObservable
      .subscribe( (data) => {
        if (!data) {
          return;
        }
        this.overwatchData = data;
        this.today = this._createStatDiff(data.current,data.day);
        this.week = this._createStatDiff(data.current,data.week);
        this.month = this._createStatDiff(data.current,data.month);
        this.rankings = this._createRankings(data.current,data.ranking);
        this._createTableData(data.current);
      });
  }

  sortTable(header) {
    const bDescending = this.lastSort === header;
    this.lastSort = header;
    this.rows = this.rows.slice().sort((a,b)=> {
      let aVal = a[header];
      let bVal = b[header]
      if(header !== 'name') {
        aVal = aVal ? parseFloat(aVal.replace(/,/g,'')) : 0;
        bVal = bVal ? parseFloat(bVal.replace(/,/g,'')) : 0;
      } else {
        if (bDescending) {
          if( a < b ) {
            return bDescending ? -1 : 1;
          }
          else if (a === b ) {
            return 0;
          }
          else {
            return bDescending ? 1 : -1;
          }
        }
      }
      if(bDescending) {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });
  }

  _createTableData(data) {
    let tmpHeaders = ['Name'];
    let headersMap = {'Name': 1};
    let rowData = [];
    _.each(data, (champ, champName) => {
      let record = {Name: champName};
      _.each(champ,(category, categoryName) => {
        _.each(category,(stat, statName) => {
          if(!headersMap[statName]) {
            headersMap[statName] = 1;
            tmpHeaders.push(statName);
          }
          record[statName]=stat;
        });
      });
      rowData.push(record);
    });
    this.headers = tmpHeaders;
    this.rows = rowData;
  }

  handleScroll(event) {
    let target = event.srcElement || event.target;
    this.scrollTop = target.scrollTop;
    this.scrollLeft = target.scrollLeft;
  }
  getChampImgPath(champ) {
    //fix soldier
    const strChamp = champ.replace(': ', '-').toLowerCase();
    return '/assets/img/' + strChamp + '.png';
  }
}
