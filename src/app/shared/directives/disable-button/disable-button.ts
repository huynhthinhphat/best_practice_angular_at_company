import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDisableButton]'
})
export class DisableButton<T> {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  public disable = input<T | null>(null, { alias: 'appDisableButton' });

  constructor() {
    effect(() => {
      const value = this.disable();
      const isDisabled = value !== null && value !== undefined && (Array.isArray(value) && value.length === 0);

      this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);

      if (isDisabled) {
        this.renderer.addClass(this.elementRef.nativeElement, 'no-active');
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, 'no-active');
      }
    });
  }
}
