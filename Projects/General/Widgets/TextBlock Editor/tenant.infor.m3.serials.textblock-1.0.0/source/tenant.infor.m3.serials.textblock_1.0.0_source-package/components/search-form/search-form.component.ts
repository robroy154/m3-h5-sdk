import { CommonModule } from "@angular/common";
import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	inject,
	OnDestroy,
	OnInit,
	Output,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { WidgetFormBase } from "../../directives/base.directive";
import { DemoValueAccessorDirective } from "../../directives/value-accessor.directive";
import { MiUtilService } from "../../services/mi-util.service";

@Component({
	selector: "search-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, DemoValueAccessorDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./search-form.component.html",
	styleUrl: "./search-form.component.css",
})
export class SearchFormComponent
	extends WidgetFormBase
	implements OnInit, OnDestroy
{
	readonly miUtil = inject(MiUtilService);
	@Output() searchResult = new EventEmitter<any>();
	private subscriptions = new Subscription();

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			program: [""],
			table: [""],
		});
		this.subscriptions.add(
			this.form.valueChanges.subscribe((value) => {
				// console.log("Form changed:", value);
			}),
		);
	}

	protected onFormSubmit(): void {
		this.searchData(this.form.value.program);
	}

	searchData(program: string) {
		const parameters = {
			PGNM: program,
		};
		this.setBusy(true);
		this.subscriptions.add(
			this.miUtil
				.execute("BOOKMKMI", "GetParByPgm", parameters, 1, "", true)
				.subscribe({
					next: (resp) => {
						this.setBusy(false);
						const massaged = this.massageSearchData(resp);
						this.searchResult.emit(massaged);
					},
					error: (err) => {
						this.setBusy(false);
						// console.log("err ", err);
						// this.searchResult.emit({ error: err });
					},
				}),
		);
	}

	private massageSearchData(responseData: any): any {
		const result = { ...responseData };

		// Handle KF01-KF16 properties
		for (let i = 1; i <= 16; i++) {
			const kfKey = `KF${i.toString().padStart(2, "0")}`;
			const kvKey = `KV${i.toString().padStart(2, "0")}`;

			if (responseData[kfKey] !== "") {
				let value = responseData[kfKey];
				// If value is 6 characters, remove first 2 characters
				if (typeof value === "string" && value.length === 6) {
					value = value.slice(2);
				}
				result[kvKey] = value;
				delete result[kfKey]; // Remove original KF property
			}
		}

		return result;
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
