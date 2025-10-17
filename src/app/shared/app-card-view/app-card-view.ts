import { Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
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
export class AppCardView implements OnInit{
  public data = input<Product[]>([]);
  public maxHeight = input<number>(0);
  public emit = output<{ data: Product, action: string }>();

  public width = 200;
  
  public allData = signal<Product[]>([]);
  public startIndex = signal<number>(1);
  public endIndex = signal<number>(10);
  public quantityItem = signal<number>(10);
  public filteredData = computed(() => [...this.allData()].slice(this.startIndex() - 1, this.endIndex()));

  constructor(){
    effect(() => {
      if(this.allData().length === 0){
        this.allData.set(this.data())
      }
    })
  }

  ngOnInit() {
      
  }

  public handleEmit(action: string, index: number) {
    this.emit.emit({ data: this.data()[index], action });
  }

  public handleNavigation(direction: -1 | 1) {
    let quantity = this.quantityItem();
    let total = this.data().length;
    let steps = quantity * direction;

    let nextStart = this.startIndex() + steps;
    let nextEnd = this.endIndex() + steps;

    if (this.endIndex() === total) {
      nextEnd = nextStart + quantity - 1;
    } else if (nextEnd > total) {
      nextEnd = total;
    }

    this.startIndex.set(nextStart);
    this.endIndex.set(nextEnd);
  }

  public handleQuantityItem(quantityItem: number) {
    this.quantityItem.set(quantityItem)

    let total = this.data().length;
    let quantity = quantityItem > total ? total : quantityItem;

    this.startIndex.set(1);
    this.endIndex.set(quantity)
  }
}
