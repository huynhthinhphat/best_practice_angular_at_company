import { AfterViewInit, Directive, ElementRef, EmbeddedViewRef, HostListener, inject, input, Renderer2, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appActionMenuDirective]'
})
export class ActionMenuDirective implements AfterViewInit {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  public content = input<TemplateRef<any> | null>(null);

  private menu: HTMLElement | null = null;
  private embeddedViewRef: EmbeddedViewRef<any> | null = null;
  private clickOutsideListener: (() => void) | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;

  private scrollContainer: HTMLElement | null = null;

  ngAfterViewInit() {
    this.scrollContainer = this.elementRef.nativeElement.closest('.table-container');
  }

  @HostListener('click')
  public toggleActions() {
    if (this.menu) {
      this.destroyMenu();
      return;
    }

    this.menu = this.renderer.createElement('div');

    this.renderer.addClass(this.menu, 'action-menu');

    this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.content()!);
    this.embeddedViewRef.rootNodes.forEach(node => { this.renderer.appendChild(this.menu!, node); });

    this.renderer.appendChild(document.body, this.menu);

    this.updatePosition();

    this.clickOutsideListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target = event.target as Node;
      if (!this.menu?.contains(target) && !this.elementRef.nativeElement.contains(target)) {
        this.destroyMenu();
      }
    });

    if (this.scrollContainer) {
      this.scrollListener = this.renderer.listen(this.scrollContainer, 'scroll', () => this.updatePosition());
      this.resizeListener = this.renderer.listen(this.scrollContainer, 'resize', () => this.updatePosition());
    } else {
      this.scrollListener = this.renderer.listen(window, 'scroll', () => this.updatePosition());
      this.resizeListener = this.renderer.listen(window, 'resize', () => this.updatePosition());
    }
  }

  private updatePosition() {
    if (!this.menu) return;

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const containerRect = this.scrollContainer?.getBoundingClientRect();

    if (!hostRect) return;

    if (containerRect) {
      const isOutOfTop = hostRect.top < containerRect.top;
      const isOutOfBottom = hostRect.bottom > containerRect.bottom;
      const isOutOfLeft = hostRect.left < containerRect.left;
      const isOutOfRight = hostRect.right > containerRect.right;

      if (isOutOfTop || isOutOfBottom || isOutOfLeft || isOutOfRight) {
        this.renderer.addClass(this.menu, 'hidden');
        return;
      } else {
        this.renderer.removeClass(this.menu, 'hidden');
      }
    }

    this.renderer.setStyle(this.menu, 'top', `${hostRect.bottom}px`);
    this.renderer.setStyle(this.menu, 'left', `${hostRect.left}px`);
  }

  private destroyMenu() {
    if (this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
      this.embeddedViewRef = null;
    }

    if (this.menu) {
      this.renderer.removeChild(document.body, this.menu);
      this.menu = null;
    }

    if (this.clickOutsideListener) {
      this.clickOutsideListener();
      this.clickOutsideListener = null;
    }

    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }

    if (this.resizeListener) {
      this.resizeListener();
      this.resizeListener = null;
    }
  }
}
