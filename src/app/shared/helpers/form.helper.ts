import { FormFields } from "../models/form-field.model";

export function initForm<T>(fields: FormFields[], data: T | null): FormFields[]{
    return fields.map(field => {
        const value = field.defaultValue;

        if (data) {
            const dataValue = data[field.name as keyof T];
            
            if (typeof value === 'string' && typeof dataValue === 'string' ||
                typeof value === 'number' && typeof dataValue === 'number' ||
                typeof value === 'boolean' && typeof dataValue === 'boolean' ||
                value instanceof Date && dataValue instanceof Date) {
                field.defaultValue = dataValue;
            }
        } else {
            if (typeof value === 'string') {
                field.defaultValue = '';
            } else if (typeof value === 'number') {
                field.defaultValue = 0;
            } else if (typeof value === 'boolean') {
                field.defaultValue = false;
            }
        }
        return { ...field };
    })
} 