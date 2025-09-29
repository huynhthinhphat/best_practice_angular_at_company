import { CommonModule } from '@angular/common';
import { Component, input, output, OnInit, inject, viewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ERROR_MESSAGES } from '../constants/message.constants';
import { User } from '../models/user.model';
import { PasswordMatchValidator } from '../../core/validators/password-match.validator';
import { FormFields } from '../models/form-field.model';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './app-form.html',
  styleUrl: './app-form.scss',
  standalone: true
})
export class AppForm implements OnInit, AfterViewInit {
  private inputs = viewChildren<ElementRef>('formInput');
  private formBuilder = inject(FormBuilder);

  public formTitle = input<string>('Title');
  public formFields = input<FormFields[]>([]);
  public buttonLabel = input<string>('');
  public formLinkMessage = input<string>('');
  public formLinkTitle = input<string>('');
  public formUrl = input<string>('');

  public submitForm = output<User>();
  public emitState = output<boolean>();

  public form!: FormGroup;

  public readonly errorMessage = ERROR_MESSAGES;

  public ngOnInit() {
    this.initForm();
  }

  public ngAfterViewInit() {
    const first = this.inputs()[0];
    if (first) first.nativeElement.focus();
  }

  private initForm() {
    const fields = this.formFields();
    if (!fields) return;

    const controls = fields.reduce((acc, field) => {
      acc[field.name] = ['', [...field.validator, Validators.required]];
      return acc;
    }, {} as any)

    this.form = this.formBuilder.group(
      controls,
      { validators: PasswordMatchValidator });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
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
    console.log(typeof(field))
    field.type = field.type === 'password' ? 'text' : 'password';
  }
}
