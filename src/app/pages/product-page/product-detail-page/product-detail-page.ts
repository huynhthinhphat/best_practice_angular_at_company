import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.css'
})
export class ProductDetailPage {

}
