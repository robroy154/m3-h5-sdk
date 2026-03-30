import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	OnInit,
} from "@angular/core";
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
} from "@angular/forms";
import IdsDropdown from "ids-enterprise-wc/components/ids-dropdown/ids-dropdown";
import { USER_DROPDOWN_OPTIONS } from "../../constant/user-dropdown-options.const";
import { WidgetBase } from "../../directives/base.directive";
import { DemoValueAccessorDirective } from "../../directives/value-accessor.directive";

@Component({
	selector: "dropdown-reactive",
	standalone: true,
	imports: [CommonModule, FormsModule, DemoValueAccessorDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./dropdown-reactive.component.html",
	providers: [
		DemoValueAccessorDirective,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: DropdownReactiveComponent,
			multi: true,
		},
	],
})
export class DropdownReactiveComponent
	extends WidgetBase
	implements ControlValueAccessor, OnInit, AfterViewInit
{
	@Input() label!: string;
	@Input() required = false;
	@Input() size = "md";
	// @Input() instanceId!: string;
	@Input() index!: number;

	USER_DROPDOWN_OPTIONS = USER_DROPDOWN_OPTIONS;

	value: any;
	selectedValue = "";
	disabled = false;

	private onChange = (value: any) => {};
	private onTouched = () => {};

	ngOnInit(): void {
		// Component initialization
	}

	ngAfterViewInit(): void {
		const element = document.querySelector<IdsDropdown>(
			`#KV${this.id}${this.instanceId}`,
		)!;

		this.ibcService.ibc$.subscribe((fields) => {
			// Handle fields change

			const options = Array.from(fields.keys()).map((key) => ({
				label: key,
				value: key ?? "",
				// isCheckbox: true,
				id: key,
			}));

			const headerOption = {
				label: "Header",
				value: "header",
				// isCheckbox: true,
				groupLabel: true,
				id: "header",
			};

			options.unshift(headerOption);
			element.data = [...options, ...USER_DROPDOWN_OPTIONS];

			setTimeout(() => {
				element.value = element.value ?? this.value;
			}, 10);
		});

		/* 		const fieldDropdown = this.shadowRoot?.getElementById(
				"KV" + this.index + this.instanceId,
			) as IdsDropdown; */

		/* element.data = [
			{ label: "tete", value: "asdada" },
			{ label: "t", value: "a" },
		]; */
		/* element.addEventListener("change", () => {
			element.value = element.value ?? "";
		}); */
	}

	writeValue(value: string): void {
		this.value = value;
		if (!this.id || !this.instanceId) return;

		setTimeout(() => {
			const element = document?.querySelector<IdsDropdown>(
				`#KV${this.id}${this.instanceId}`,
			);
			if (element) {
				element.value = value;
			}
		}, 0);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn || (() => {});
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn || (() => {});
	}

	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}

	onValueChange(event: any): void {
		this.value = event.target?.value;
		this.onChange(this.value);
		this.onTouched();
	}
}
