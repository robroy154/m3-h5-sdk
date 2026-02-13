import {
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject,
} from "@angular/core";

@Component({
	selector: "counter",
	template: `
		<ids-layout-flex justify-content="center">
			<ids-layout-flex-item align-self="center">
				<ids-text font-size="16" font-weight="bold">
					{{ label }}
				</ids-text>
			</ids-layout-flex-item>
		</ids-layout-flex>

		<ids-layout-flex justify-content="center">
			<ids-layout-flex-item align-content="center">
				<ids-button icon="minus" (click)="minus.emit()"></ids-button>
				<span class="data-large vertical-middle">
					{{ value }}
				</span>
				<ids-button icon="add" (click)="plus.emit()"></ids-button>
			</ids-layout-flex-item>
		</ids-layout-flex>
	`,
	styles: [
		`
			:host {
				text-align: center;
			}
			.vertical-middle {
				vertical-align: middle;
			}
		`,
	],
	imports: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CounterComponent {
	@Input() value: number;
	@Input() label: string;
	@Output() plus = new EventEmitter();
	@Output() minus = new EventEmitter();
	elementRef = inject(ElementRef);
}
