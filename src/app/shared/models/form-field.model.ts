import { Validators } from "@angular/forms";
import { Category } from "./category.model";

export interface FormFields {
  name?: string,
  label?: string,
  type?: string,
  icon?: string,
  validator: Validators[],
  categories?: Category[],
  errors?: {
    type: string,
    message: string
  }[],
  defaultValue?: string | number | boolean | Date,
  isShow?: boolean
}