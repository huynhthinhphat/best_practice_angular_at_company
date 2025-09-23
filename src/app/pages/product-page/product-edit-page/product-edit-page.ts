import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { Product } from '../../../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { ImageService } from '../../../shared/services/image-service/image-service';
import { Cloudinary } from '../../../shared/models/cloudinary.model';
import { FormsModule } from '@angular/forms';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../shared/constants/message.constants';
import { Location } from '@angular/common';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-product-edit-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.css',
  standalone: true
})
export class ProductEditPage implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private toastrService = inject(ToastrService);
  private categoryService = inject(CategoryService);
  private imageService = inject(ImageService);
  private location = inject(Location);

  public previewImage = this.imageService.previewUrl;
  public product = signal<Product | null>(null);
  public categories = this.categoryService.categories;
  public productName: string = '';
  public price: number = 0;
  public description: string = '';
  public stock: number = 0;
  public categoryId: string = '';
  public categoryName: string = '';

  public ngOnInit() {
    this.loadProduct();
  }

  private loadProduct() {
    const product = this.route.snapshot.data['product'];
    if (product) {
      this.product.set(product);

      this.productName = this.product()?.name!;
      this.price = this.product()?.price!;
      this.description = this.product()?.description!;
      this.stock = this.product()?.stock!;
      this.categoryId = this.categories()[1].id!;
      this.categoryName = this.categories()[1].name!;
      return;
    }

    if (this.categories().length > 0) {
      const newProduct: Product = {
        name: this.productName,
        price: this.price,
        description: this.description,
        categoryId: this.categories()[1].id,
        categoryName: this.categories()[1].name,
        stock: this.stock,
        imageUrl: ''
      }

      this.product.set(newProduct);
    }
  }

  public onFileSelected(event: Event) {
    this.imageService.handleImageEvent(event).subscribe({
      next: ((res: Cloudinary) => {
        if (!res) return;

        const imageUrl = res.secure_url;
        if (!imageUrl) return;

        this.product.set({ ...this.product(), imageUrl: imageUrl });
        this.previewImage.set('');
      }),
      error: (error) => {
        this.toastrService.error(error.message);
        this.previewImage.set(this.product()?.imageUrl!);
      }
    })
  }

  public handleSelectedCategory(event: Event) {
    const target = event.target as HTMLSelectElement;

    const value = target.value;
    const text = target.selectedOptions[0].text;

    this.categoryId = value;
    this.categoryName = text;
  }

  public saveProduct(action: string) {
    if (this.productName.trim() === '') {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_PRODUCT_NAME);
      return;
    }

    if (this.price < 0) {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_PRICE);
      return;
    }

    if (this.stock < 0) {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_STOCK);
      return;
    }

    const product: Product = {
      ...this.product(),
      name: this.productName,
      price: this.price,
      description: this.description,
      stock: this.stock,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
    }

    this.productService.getProductByNameAndCategory(this.productName, this.categoryName).pipe(
      switchMap((res: Product[]) => {
        if ((this.product()?.name !== this.productName || this.product()?.categoryName !== this.categoryName) && res.length > 0)
          return throwError(() => new Error(ERROR_MESSAGES.EXISTDE_PRODUCT));
        return this.productService.saveProduct(product, action)
      })
    ).subscribe({
      next: ((res: Product) => {
        if (!res) return;

        if (action === 'update') {
          this.toastrService.success(SUCCESS_MESSAGES.UPDATE_PRODUCT);
        } else {
          this.toastrService.success(SUCCESS_MESSAGES.CREATE_PRODUCT);
        }
        this.location.back();
      }),
      error: ((error) => {
        this.toastrService.error(error.message);
      })
    })
  }

  public goBack() {
    this.location.back();
  }

  public ngOnDestroy() {
    URL.revokeObjectURL(this.previewImage());
  }
}
