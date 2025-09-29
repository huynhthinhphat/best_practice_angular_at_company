import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output, Renderer2 } from "@angular/core";
import { ResizeEvent } from "../../models/resize-event.model";

@Directive({
    selector: '[appResizable]'
})

export class ResizableDirective implements OnInit, OnDestroy { 
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);

    public minWidth = input<number>(100);
    public minHeight = input<number>(100);
    public maxWidth = input<number>(1500);
    public maxHeight = input<number>(1500);
    public directions = input<string[]>(['top', 'bottom', 'right', 'left']);

    private handles: HTMLElement[] = [];
    private isResizing = false;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;
    private startLeft: number = 0;
    private startTop: number = 0;
    private currentHandle!: HTMLElement;
    private resizeDirection: string = '';

    ngOnInit() {
        this.createHandles();
    }

    private createHandles() {
        this.directions().forEach(direction => {
            const handle = this.renderer.createElement('div');
            this.renderer.addClass(handle, 'resize-handle');
            this.renderer.addClass(handle, `resize-handle-${direction}`);
            this.renderer.setStyle(handle, 'position', 'absolute');
            this.renderer.setStyle(handle, 'cursor', this.getCursor(direction));

            switch (direction) {
            case 'top':
                this.renderer.setStyle(handle, 'top', '0');
                this.renderer.setStyle(handle, 'left', '0');
                this.renderer.setStyle(handle, 'width', '100%');
                this.renderer.setStyle(handle, 'height', '5px');
                break;
            case 'right':
                this.renderer.setStyle(handle, 'top', '0');
                this.renderer.setStyle(handle, 'right', '0');
                this.renderer.setStyle(handle, 'width', '5px');
                this.renderer.setStyle(handle, 'height', '100%');
                break;
            case 'bottom':
                this.renderer.setStyle(handle, 'bottom', '0');
                this.renderer.setStyle(handle, 'left', '0');
                this.renderer.setStyle(handle, 'width', '100%');
                this.renderer.setStyle(handle, 'height', '5px');
                break;
            case 'left':
                this.renderer.setStyle(handle, 'top', '0');
                this.renderer.setStyle(handle, 'left', '0');
                this.renderer.setStyle(handle, 'width', '5px');
                this.renderer.setStyle(handle, 'height', '100%');
                break;
            }

            this.renderer.appendChild(this.elementRef.nativeElement, handle);
            this.handles.push(handle);

            this.renderer.listen(handle, 'mousedown', (e: MouseEvent) => this.onMouseDown(e, direction));
        });
    }

    private getCursor(direction: string): string {
        switch (direction) {
        case 'top':
        case 'bottom': return 'row-resize';
        case 'left':
        case 'right': return 'col-resize';
        default: return 'default';
        }
    }

    private onMouseDown(event: MouseEvent, direction: string) {
        event.preventDefault();
        this.isResizing = true;
        this.resizeDirection = direction;
        this.currentHandle = event.target as HTMLElement;

        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.startLeft = rect.left;
        this.startTop = rect.top;

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.isResizing) return;

        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        let newLeft = this.startLeft;
        let newTop = this.startTop;

        const deltaX = event.clientX - this.startX;
        const deltaY = event.clientY - this.startY;

        switch (this.resizeDirection) {
        case 'right':
            newWidth = Math.max(this.minWidth(), Math.min(this.maxWidth(), this.startWidth + deltaX));
            break;
        case 'left':
            newWidth = Math.max(this.minWidth(), Math.min(this.maxWidth(), this.startWidth - deltaX));
            newLeft = this.startLeft + deltaX;
            break;
        case 'bottom':
            newHeight = Math.max(this.minHeight(), Math.min(this.maxHeight(), this.startHeight + deltaY));
            break;
        case 'top':
            newHeight = Math.max(this.minHeight(), Math.min(this.maxHeight(), this.startHeight - deltaY));
            newTop = this.startTop + deltaY;
            break;
        }

        this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${newWidth}px`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${newHeight}px`);
        
        if (this.resizeDirection === 'left' || this.resizeDirection === 'top') {
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${newLeft}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${newTop}px`);
        }
    }

    private onMouseUp() {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private removeHandles() {
        this.handles.forEach(handle => handle.remove());
    }

    ngOnDestroy() {
        this.removeHandles();
    }
}