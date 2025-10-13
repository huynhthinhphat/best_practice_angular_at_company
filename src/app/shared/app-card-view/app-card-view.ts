import { Component, input, output } from '@angular/core';
import { Product } from '../models/product.model';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-view',
  imports: [NgOptimizedImage, CurrencyPipe, RouterLink],
  templateUrl: './app-card-view.html',
  styleUrl: './app-card-view.scss'
})
export class AppCardView {
  public data = input<Product[]>([]);
  public maxHeight = input<number>(0);
  public width = 200;
  public emit = output<{ data: Product, action: string }>();

  public handleEmit(action: string, index: number) {
    this.emit.emit({ data: this.data()[index], action });
  }
}
