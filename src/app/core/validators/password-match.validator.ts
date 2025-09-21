import { ValidatorFn, AbstractControl } from "@angular/forms";

export const PasswordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control) return null;
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
};
