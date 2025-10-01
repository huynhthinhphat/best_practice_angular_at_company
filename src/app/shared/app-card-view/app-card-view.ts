import { Component, effect, inject, input, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { NgOptimizedImage } from '@angular/common';
import { AppDialog } from '../app-dialog/app-dialog';

@Component({
  selector: 'app-card-view',
  imports: [NgOptimizedImage, AppDialog],
  templateUrl: './app-card-view.html',
  styleUrl: './app-card-view.scss'
})
export class AppCardView {
  public data = input<Product[]>([]);
  public width = 200;
  public selectedData = signal<Product | null>(null);

  public showDialog(data: Product) {
    this.selectedData.set(data);
  }
}
