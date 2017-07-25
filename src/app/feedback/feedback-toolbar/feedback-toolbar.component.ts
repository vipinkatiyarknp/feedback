import { Component, ElementRef, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'feedback-toolbar',
  templateUrl: './feedback-toolbar.component.html',
  styleUrls: ['./feedback-toolbar.component.scss']
})

export class FeedbackToolbarComponent implements AfterViewInit {
  @Output()
  public manipulate = new EventEmitter<string>();
  public disableToolbarTips = false;
  @ViewChild('toggleMove')
  private toggleMoveBtn: ElementRef;
  constructor(public el: ElementRef) {}
  public ngAfterViewInit() {
    let elStyle = this.el.nativeElement.style;
    elStyle.position = 'absolute';
    elStyle.left = '43%';
    elStyle.top = '60%';
    this.addDragListenerOnMoveBtn();
  }
  public done() {
    this.manipulate.emit('done');
  }
  public toggleHighlight() {
    this.manipulate.emit('yellow');
  }
  public toggleHide() {
    this.manipulate.emit('black');
  }
  public addDragListenerOnMoveBtn() {
    let mouseUp = Observable.fromEvent(this.toggleMoveBtn.nativeElement, 'mouseup');
    let mouseMove = Observable.fromEvent(document.documentElement, 'mousemove');
    let mouseDown = Observable.fromEvent(this.toggleMoveBtn.nativeElement, 'mousedown');
    let mouseDrag = mouseDown.mergeMap((md: MouseEvent) => {
      let startX = md.offsetX;
      let startY = md.offsetY;
      this.disableToolbarTips = true;
      // Calculate dif with mousemove until mouseup
      return mouseMove
        .map((mm: MouseEvent) => {
          mm.preventDefault();
          return {
            left: mm.clientX - startX,
            top: mm.clientY - startY
          };
        })
        .finally(() => {
          this.disableToolbarTips = false;
        }).takeUntil(mouseUp);
    });
    mouseDrag.subscribe(
      (pos) => {
        this.el.nativeElement.style.left = pos.left + 'px';
        this.el.nativeElement.style.top = pos.top + 'px';
      });
  }
}
