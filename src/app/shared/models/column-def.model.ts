import { Actions } from "./actions.model";

export interface ColumnDef<T> {
    headerText: string;
    field?: keyof T;
    columnType?: string;
    actions?: Actions<T>[];
}