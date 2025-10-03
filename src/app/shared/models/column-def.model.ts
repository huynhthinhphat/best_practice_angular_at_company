export interface ColumnDef<T> {
    headerText?: string;
    field?: keyof T;
    columnType?: string;
    pipe?: string;
}