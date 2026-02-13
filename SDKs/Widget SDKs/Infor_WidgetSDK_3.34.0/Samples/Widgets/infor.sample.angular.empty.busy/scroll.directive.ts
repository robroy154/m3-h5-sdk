import {
	Directive,
	ElementRef,
	OnInit,
	OnDestroy,
	Output,
	EventEmitter,
	Input,
} from "@angular/core";

@Directive({
	selector: "[observeScroll]",
})
export class ScrollDirective implements OnInit, OnDestroy {
	private observer: IntersectionObserver;
	private scrollStart: HTMLElement;
	private scrollEnd: HTMLElement;

	@Output() scrollTop = new EventEmitter<void>();
	@Output() scrollBottom = new EventEmitter<void>();
	@Input() scrollThreshold = 1;

	constructor(private element: ElementRef<HTMLElement>) {}

	ngOnInit() {
		this.scrollStart = document.createElement("div");
		this.element.nativeElement.insertBefore(
			this.scrollStart,
			this.element.nativeElement.firstChild,
		);

		this.scrollEnd = document.createElement("div");
		this.element.nativeElement.appendChild(this.scrollEnd);

		this.observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						if (entry.target === this.scrollStart) {
							this.scrollTop.emit();
						} else if (entry.target === this.scrollEnd) {
							this.scrollBottom.emit();
						}
					}
				}
			},
			{
				root: this.element.nativeElement,
				rootMargin: `${this.scrollThreshold}px`,
			},
		);
		this.observer.observe(this.scrollStart);
		this.observer.observe(this.scrollEnd);
	}

	ngOnDestroy() {
		this.observer.disconnect();
		this.element.nativeElement.removeChild(this.scrollStart);
		this.element.nativeElement.removeChild(this.scrollEnd);
	}
}
