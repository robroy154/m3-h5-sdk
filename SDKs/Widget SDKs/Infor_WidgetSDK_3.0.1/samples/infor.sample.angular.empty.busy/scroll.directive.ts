import {
	Directive,
	ElementRef,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	inject,
} from "@angular/core";

@Directive({
	selector: "[observeScroll]",
})
export class ScrollDirective implements OnInit, OnDestroy {
	private element = inject(ElementRef);

	private mutationObserver: MutationObserver;
	private intersectionObserver: IntersectionObserver;

	@Output() scrollBottom = new EventEmitter<void>();

	ngOnInit() {
		// Watch for new elements being added, and observe the last one
		this.mutationObserver = new MutationObserver((mutations) => {
			const lastMutation = mutations[mutations.length - 1];
			const lastAddedNode =
				lastMutation.addedNodes[lastMutation.addedNodes.length - 1];
			if (lastAddedNode instanceof HTMLElement) {
				this.intersectionObserver.disconnect();
				this.intersectionObserver.observe(lastAddedNode);
			}
		});

		// When the last element is visible, we have scrolled to the bottom
		this.intersectionObserver = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				this.scrollBottom.emit();
			}
		});

		this.mutationObserver.observe(this.element.nativeElement, {
			childList: true,
		});
	}

	ngOnDestroy() {
		this.mutationObserver.disconnect();
		this.intersectionObserver.disconnect();
	}
}
