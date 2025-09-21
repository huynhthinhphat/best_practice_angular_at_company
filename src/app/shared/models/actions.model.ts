export interface Actions<T> {
    label: string;
    class?: string;
    icon?: string,
    tooltip?: string,
    disabled?: (data: T) => boolean
}