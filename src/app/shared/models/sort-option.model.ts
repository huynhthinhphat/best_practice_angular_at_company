interface SortOption<T> {
  column: keyof T;
  direction: 'asc' | 'desc' | '';
}