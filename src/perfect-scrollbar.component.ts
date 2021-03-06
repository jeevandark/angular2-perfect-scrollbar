import * as Ps from 'perfect-scrollbar';

import { Component, DoCheck, OnDestroy, Input, Optional, ElementRef, AfterViewInit, ViewEncapsulation, NgZone } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  template: '<div class="ps-content"><ng-content></ng-content></div>',
  styles: [require('perfect-scrollbar/dist/css/perfect-scrollbar.min.css')],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'position: relative;'
  }
})
export class PerfectScrollbarComponent implements DoCheck, OnDestroy, AfterViewInit {
  private width: number;
  private height: number;

  private contentWidth: number;
  private contentHeight: number;

  @Input() config: PerfectScrollbarConfigInterface;
  @Input() runOutsideAngular: boolean = false;

  constructor( public elementRef: ElementRef, @Optional() private defaults: PerfectScrollbarConfig, private zone: NgZone ) {}

  ngDoCheck() {
    if (this.elementRef.nativeElement.children) {
      var width = this.elementRef.nativeElement.offsetWidth;
      var height = this.elementRef.nativeElement.offsetHeight;

      var contentWidth = this.elementRef.nativeElement.children[0].offsetWidth;
      var contentHeight = this.elementRef.nativeElement.children[0].offsetHeight;

      if (width !== this.width || height !== this.height || contentWidth !== this.contentWidth || contentHeight !== this.contentHeight) {
        this.width = width;
        this.height = height;

        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;

        Ps.update(this.elementRef.nativeElement);
      }
    }
  }

  ngOnDestroy() {
    Ps.destroy(this.elementRef.nativeElement);
  }

  ngAfterViewInit() {
    let config = new PerfectScrollbarConfig(this.defaults);

    config.assign(this.config);

    if (this.runOutsideAngular) {
      this.zone.runOutsideAngular(() => {
        Ps.initialize(this.elementRef.nativeElement, config);
      })
    }
    else {
      Ps.initialize(this.elementRef.nativeElement, config);
    }
  }

  update() {
    Ps.update(this.elementRef.nativeElement);
  }

  scrollTo(position: number) {
    this.elementRef.nativeElement.scrollTop = position;

    Ps.update(this.elementRef.nativeElement);
  }
}
