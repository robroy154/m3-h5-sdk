import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
} from "@angular/core";
import { WidgetBase } from "../../directives/base.directive";
import { MiUtilService } from "../../services/mi-util.service";

@Component({
	selector: "autocomplete-input",
	standalone: true,
	imports: [CommonModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./autocomplete-input.component.html",
})
export class AutocompleteInputComponent
	extends WidgetBase
	implements OnInit, AfterViewInit
{
	readonly miUtil = inject(MiUtilService);
	@Input() label!: string;
	@Input() index!: number;
	@Output() selected = new EventEmitter<any>();

	value: any;
	private debounceTimer: any;

	constructor() {
		super();
	}

	ngOnInit(): void {
		// Component initialization
	}

	ngAfterViewInit(): void {
		this.setData();
	}

	private async setData(): Promise<void> {
		const input = document.querySelector<any>(
			`#AC${this.id}${this.instanceId}`,
		)!;

		// Get data from business context service
		this.ibcService.ibc$.subscribe((fields) => {
			const data = Array.from(fields.keys()).map((key) => ({
				id: key,
				value: key,
				label: key,
			}));

			input.data = data;
		});

		input.addEventListener("input", (event: any) => {
			const value = event.target.value;

			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			}

			this.debounceTimer = setTimeout(() => {
				if (value.length >= 3) {
					this.value = value;
					this.selected.emit(this.value);

					this.searchData(this.value).subscribe({
						next: (resp) => {
							input.data = resp?.map((item: any) => ({
								id: item.FILE,
								value: item.FILE,
								label: item.FILE,
							}));
						},
						error: (err) => {
							// console.log("err ", err);
						},
					});
				}
			}, 500);
		});
	}

	onValueChange(event: any): void {
		this.value = event.target?.value;
		this.selected.emit(this.value);
	}

	searchData(program: string) {
		const parameters = {
			PGNM: program,
		};
		return this.miUtil.execute(
			"BOOKMKMI",
			"GetParByPgm",
			parameters,
			30,
			"",
			true,
		);
	}
}
