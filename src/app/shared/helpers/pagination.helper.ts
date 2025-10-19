import { computed, effect, signal } from '@angular/core';

export class PaginatorHelper<T> {
    public startIndex = signal<number>(1);
    public endIndex = signal<number>(10);
    public quantityItem = signal<number>(10);
    public totalItem = signal<number>(0);
    public currentPageItems = computed(() => [...this.data()].slice(this.startIndex() - 1, this.endIndex()));

    constructor(private data: () => T[]) {
        effect(() => {
            const total = this.data().length;
            this.totalItem.set(total);

            if (total === 0) {
                this.startIndex.set(0)
                this.endIndex.set(0)
            }else {
                this.startIndex.set(1);
                this.endIndex.set(Math.min(this.quantityItem(), total));
            }
        });
    }

    public handleNavigation(direction: -1 | 1) {
        const quantity = this.quantityItem();
        const total = this.data().length;
        let steps = quantity * direction;

        let nextStart = this.startIndex() + steps;
        let nextEnd = this.endIndex() + steps;

        if (this.endIndex() === total) {
            nextEnd = nextStart + quantity - 1;
        } else if (nextEnd > total) {
            nextEnd = total;
        }

        this.startIndex.set(nextStart);
        this.endIndex.set(nextEnd);
    }

    public handleQuantityItem(quantityItem: number) {
        this.quantityItem.set(quantityItem);

        const total = this.data().length;
        const quantity = Math.min(quantityItem, total);

        if (quantity === 0) {
            this.startIndex.set(0);
        } else {
            this.startIndex.set(1);
        }

        this.endIndex.set(quantity);
    }
}
