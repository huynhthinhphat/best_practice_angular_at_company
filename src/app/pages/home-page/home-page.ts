import { Component } from '@angular/core';
import { ProductListPage } from "../product-page/product-list-page/product-list-page";
import { LeftSidePage } from '../left-side-page/left-side-page';

@Component({
  selector: 'app-home-page',
  imports: [ProductListPage, LeftSidePage],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {

}
