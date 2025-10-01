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
  constructor() { }

  @HostListener('click')
  toggleActions() {
    if (this.menu) {
      this.destroyMenu();
      return;
    }

    this.menu = this.renderer.createElement('div');

    this.renderer.setStyle(this.menu, 'position', 'absolute');
    this.renderer.setStyle(this.menu, 'background', 'var(--dialog-color)');
    this.renderer.setStyle(this.menu, 'border', '1px solid var(--dropdown-border-color)');
    this.renderer.setStyle(this.menu, 'padding', '6px');
    this.renderer.setStyle(this.menu, 'border-radius', '6px');
    this.renderer.setStyle(this.menu, 'box-shadow', 'var(--dialog-box-shadow)');
    this.renderer.setStyle(this.menu, 'z-index', '1000');

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.menu, 'top', rect.bottom + 'px');
    this.renderer.setStyle(this.menu, 'left', rect.left + 'px');

    this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.content()!);
    this.embeddedViewRef.rootNodes.forEach(node => { this.renderer.appendChild(this.menu!, node); });

    this.renderer.appendChild(document.body, this.menu);

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
