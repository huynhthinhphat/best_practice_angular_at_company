import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppPagination } from '../app-pagination/app-pagination';

@Component({
  selector: 'app-card-view',
  imports: [NgOptimizedImage, CurrencyPipe, RouterLink, AppPagination],
  templateUrl: './app-card-view.html',
  styleUrl: './app-card-view.scss'
})
export class AppCardView {
  public data = input<Product[]>([]);
  public maxHeight = input<number>(0);
  public emit = output<{ data: Product, action: string }>();

  public width = 200;

  public receivedData = signal<Product[]>([]);

  public handleEmit(action: string, index: number) {
    this.emit.emit({ data: this.data()[index], action: action });
  }

  public handleDataOutput(products: Product[]) {
    this.receivedData.set([...products]);
  }
}
