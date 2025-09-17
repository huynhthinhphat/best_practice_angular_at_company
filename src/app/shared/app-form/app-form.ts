import { CommonModule } from '@angular/common';
import { Component, input, output, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ERROR_MESSAGES } from '../constants/message.constants';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth-service/auth';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './app-form.html',
  styleUrl: './app-form.css',
  standalone: true
})
export class AppForm implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public formTitle = input<string>('Title');
  public fields = input<{ name: string, label: string, type: string, validator: any[] }[]>();
  public buttonLabel = input<string>('');
  public formMessage = input<string>('');
  public formLink = input<string>('');
  public formLinkText = input<string>('');
  public formValidator = input<ValidatorFn>();

  public submitForm = output<User>();

  public form!: FormGroup;
  public errorMessage = ERROR_MESSAGES;
  public errorSignal = this.authService.errorSignal;

  public ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const fields = this.fields();
    if (!fields) return;

    const controls = fields.reduce((acc, field) => {
      acc[field.name] = ['', [...field.validator, Validators.required]];
      return acc;
    }, {} as any)

    this.form = this.fb.group(controls, { validators: this.formValidator() });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }
}
