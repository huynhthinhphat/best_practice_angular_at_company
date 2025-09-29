import { Component, ElementRef, inject, Renderer2, signal, viewChild } from '@angular/core';
import { ProductListPage } from "../product-page/product-list-page/product-list-page";
import { LeftSidePage } from '../left-side-page/left-side-page';

@Component({
  selector: 'app-home-page',
  imports: [ProductListPage, LeftSidePage],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePage {
  // private navigation = viewChild('navigation', { read: ElementRef });
  // private renderer = inject(Renderer2);

  // public isShowContent = signal<boolean>(true);

  // public handleEmit(event: boolean) {
  //   this.isShowContent.set(event);
  // }

  // public adjustCategorySize(event: boolean) {
  //   this.isShowContent.set(event);
    
  //   const nativeElement = this.navigation()?.nativeElement;
  //   if (!event) {
  //     this.renderer.setStyle(nativeElement, 'width', '50px');
  //   } else {
  //     this.renderer.setStyle(nativeElement, 'width', '250px');
  //   }
  // }
}
