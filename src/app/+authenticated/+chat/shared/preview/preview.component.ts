import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {AuthHttp} from 'angular2-jwt';
import { MdSpinner } from '@angular2-material/progress-circle';
import { MdInput } from '@angular2-material/input';
import { OptionsService } from '../../../../shared/options/options.service';

declare var _;
const imageTestRegex = /(?:\.jpg|\.png|\.gif)$/i;
const youtubeRegex = /youtube.com\/.*v=(.*)$/i;
@Component({
  moduleId: 'taranio',
  selector: 'preview',
  templateUrl: 'preview.component.html',
  styleUrls: ['preview.component.css'],
  directives: [CORE_DIRECTIVES, MdSpinner, MdInput],
})
export class PreviewComponent implements OnInit {
  type: string = '';
  @Input() url: string;
  @Output() rendered = new EventEmitter();
  urlMetadata: {} = null;
  allowNSFW: boolean = false;
  constructor(private authHttp: AuthHttp, public options: OptionsService) {

  }

  allow() {
    this.allowNSFW = true;
  }

  loaded() {
    this.rendered.emit({action: 'done'});
  }

  ngOnInit() {
    if (imageTestRegex.test(this.url) && this.options.showImagePreviews) {
      this.type = 'img';
      this.rendered.emit({action: 'loading'});
      this.authHttp.get('/image-test?url=' + encodeURIComponent(this.url))
        .map((resp) => {
          return resp.json();
        })
        .subscribe( (data)=>{
          this.urlMetadata = data;
        });
    } else if(youtubeRegex.test(this.url)) {
      this.type = 'youtube';
      let r = youtubeRegex.exec(this.url);
      this.urlMetadata = {
        url: this.url,
        video: r[1]
      }
    } else {
      this.urlMetadata = {
        url: this.url,
        exists: false,
        sfw: false,
      }
    }
  }

  getImageUrl() {
    return '/image?url=' + encodeURIComponent(this.url);
  }
}
