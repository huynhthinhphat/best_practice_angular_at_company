import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { Cloudinary } from '../../models/cloudinary.model';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http = inject(HttpClient);

  public previewUrl = signal<string>('');

  private createPreviewUrl(file: File | null): string {
    return file ? URL.createObjectURL(file) : '';
  }

  private isValidImage(file: File): Observable<boolean> {
    if (!file.type.startsWith('image/')) return throwError(() => new Error(ERROR_MESSAGES.INVALID_IMAGE));
    if (file.size / (1024 * 1024) >= 2) return throwError(() => new Error(ERROR_MESSAGES.OVERSIZE_IMAGE));

    return new Observable(sub => {
      sub.next(true);
    });
  }

  public handleImageEvent(event: Event): Observable<Cloudinary> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) return throwError(() => new Error(ERROR_MESSAGES.UPLOAD_FILE_FAILED));

    return this.isValidImage(file).pipe(
      tap(() => {
        this.previewUrl.set(this.createPreviewUrl(file));
      }),
      switchMap(() => this.uploadFile(file))
    )
  }

  public uploadFile(file: File): Observable<Cloudinary> {
    if (!file) return throwError(() => new Error(ERROR_MESSAGES.UPLOAD_FILE_FAILED));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    return this.http.post<Cloudinary>(environment.cloudinary.cloudinaryUrl, formData);
  }
}
