import { Validators } from "@angular/forms";

export interface FormFields {
    name: string,
    label: string,
    type: string,
    icon?: string,
    validator: Validators[],
    errors?: {
      type: string,
      message: string
    }[]
}