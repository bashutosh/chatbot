import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

  // @ts-ignore
  @Input() public appAutoFocus;

  public constructor(private el: ElementRef) {

  }

  public ngAfterContentInit(): void {

    setTimeout(() => {

      this.el.nativeElement.focus();

    }, 500);

  }

}
