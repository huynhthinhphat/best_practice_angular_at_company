import { Directive, ElementRef, EmbeddedViewRef, HostListener, inject, input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appActionMenuDirective]'
})
export class ActionMenuDirective {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  public content = input<TemplateRef<any> | null>(null);

  private menu: HTMLElement | null = null;
  private embeddedViewRef: EmbeddedViewRef<any> | null = null;
  private clickOutsideListener: (() => void) | null = null;

  @HostListener('click')
  toggleActions() {
    if (this.menu) {
      this.destroyMenu();
      return;
    }

    this.menu = this.renderer.createElement('div');

    this.renderer.addClass(this.menu, 'action-menu');

    this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.content()!);
    this.embeddedViewRef.rootNodes.forEach(node => { this.renderer.appendChild(this.menu!, node); });

    this.renderer.appendChild(this.elementRef.nativeElement, this.menu);

    this.clickOutsideListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target = event.target as Node;
      if (!this.menu?.contains(target) && !this.elementRef.nativeElement.contains(target)) {
        this.destroyMenu();
      }
    });
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
  }
}
