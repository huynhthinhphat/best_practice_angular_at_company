import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, inject, input, output, signal, viewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES } from '../constants/message.constants';
import { Cloudinary } from '../models/cloudinary.model';
import { FormFields } from '../models/form-field.model';
import { ImageService } from '../services/image-service/image-service';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './app-form.html',
  styleUrl: './app-form.scss',
  standalone: true
})
export class AppForm<T> implements OnInit, AfterViewInit {
  private imageService = inject(ImageService);
  private toastrService = inject(ToastrService);

  private inputs = viewChildren<ElementRef>('formInput');
  private formBuilder = inject(FormBuilder);

  public formTitle = input<string>('');
  public formFields = input<FormFields[]>([]);
  public buttonLabel = input<string>('');
  public formLinkMessage = input<string>('');
  public formLinkTitle = input<string>('');
  public formUrl = input<string>('');
  public showLabel = input<boolean>(false);
  public validators = input<ValidatorFn>();
  public submitForm = output<T>();

  public form!: FormGroup;
  public previewImage = this.imageService.previewUrl;
  public isLoading = signal<boolean>(false);
  public readonly errorMessage = ERROR_MESSAGES;

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    const first = this.inputs()[0];
    if (first) first.nativeElement.focus();
  }

  private initForm() {
    const fields = this.formFields();
    if (!fields) return;

    const controls = fields.reduce((acc, field) => {
      let defaultValue: string | number | boolean | Date | undefined = '';

      if (field.type === 'select' && field.categories) {
        if (field.defaultValue !== '') {
          defaultValue = field.defaultValue;
        } else {
          defaultValue = field.categories[0].id;
        }
      } else {
        defaultValue = field.defaultValue;
      }

      acc[field.name!] = [defaultValue ?? '', [...field.validator]];
      return acc;
    }, {} as any)

    this.form = this.formBuilder.nonNullable.group(controls, { validators: this.validators() });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value as T);
    }
  }

  public getError(fieldName: string) {
    if (!this.formFields()) return;

    const error = this.form.get(fieldName)?.errors;
    if (!error) return null;

    const field = this.formFields()!.find(f => f.name === fieldName);
    if (!field) return null;
    return field.errors?.find(err => error[err.type])?.message;
  }

  public showPassword(field: FormFields) {
    if (field.name !== 'password' && field.name !== 'confirmPassword') return;
    field.type = field.type === 'password' ? 'text' : 'password';
  }

  public onFileSelected(event: Event) {
    this.isLoading.set(true);

    this.imageService.handleImageEvent(event).subscribe({
      next: ((res: Cloudinary) => {
        if (!res) return;

        const imageUrl = res.secure_url;
        if (!imageUrl) return;

        this.formFields().find(field => field.type === 'image')!.defaultValue = imageUrl;
        this.form.get('imageUrl')?.setValue(imageUrl);
        this.imageService.previewUrl.set('');
        this.isLoading.set(false);
      }),
      error: () => {
        this.isLoading.set(false);
        this.toastrService.error(ERROR_MESSAGES.UPLOAD_FILE_FAILED);
      }
    })
  }
}
