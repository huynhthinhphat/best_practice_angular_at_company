import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { ORDER_STATUS } from '../../constants/order-status.constants';

@Directive({
  selector: '[appStatusIcon]',
  standalone: true
})
export class StatusIcon {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  public status = input<string>('', { alias: 'appStatusIcon' });

  constructor() {
    effect(() => {
      const currentStatus = this.status();
      let icon = '';

      switch (currentStatus) {
        case ORDER_STATUS.PENDING:
          icon = '⏳';
          break;
        case ORDER_STATUS.RETURNING:
          icon = '🔄';
          break;
        case ORDER_STATUS.DELIVERED:
          icon = '🚚';
          break;
        case ORDER_STATUS.COMPLETED:
        case ORDER_STATUS.RECEIVED:
        case ORDER_STATUS.REFUNDED:
          icon = '✅';
          break;
        case ORDER_STATUS.CANCELLED:
          icon = '❌';
          break;
        default:
          icon = '';
          break;
      }

      this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', icon);
    })
  }
}
