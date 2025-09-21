import { Component, effect, input, OnChanges } from '@angular/core';
import { PaginationResponse } from '../models/pagination-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './app-pagination.html',
  styleUrl: './app-pagination.css'
})
export class AppPagination<T> implements OnChanges{
  public pagination = input<PaginationResponse<T> | null>(null);
  public currentPage = input<number>(1);
  public onPageChange = input<(page: number) => void>();

  public start : number = 0;
  public end : number = 0;

  ngOnChanges() {
    if(this.pagination()){
      this.calculateRange(this.pagination()!);
    }
  }

  public goToPage(page: number) {
    this.onPageChange()?.(page);
  }

  public range(startPage: number, endPage: number): number[]{
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  private calculateRange(pagination: PaginationResponse<T>) {
    if (pagination.prev === null) {
      this.start = 1;
      this.end = pagination.pages! <= 2 ? 2 : 3;
      return;
    } 
    
    if (pagination.next === null) {
      this.start = pagination.pages! <= 2 ? pagination.prev! : pagination.last! - 2;
      this.end = pagination.last!;
      return;
    } 
    
    this.start = pagination.prev!;
    this.end = pagination.next!;
  }
}
