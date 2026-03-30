import { CommonModule } from "@angular/common";
import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	forwardRef,
	Input,
	Output,
	ViewChild,
} from "@angular/core";
import {
	AbstractControl,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from "@angular/forms";
import { SohoDropDownComponent, SohoDropDownModule } from "ids-enterprise-ng";

@Component({
	selector: "custom-dropdown-control",
	standalone: true,
	imports: [CommonModule, SohoDropDownModule, ReactiveFormsModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./custom-dropdown-control.component.html",
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomDropdownControlComponent),
			multi: true,
		},
	],
})
export class CustomDropdownControlComponent implements ControlValueAccessor {
	@ViewChild(SohoDropDownComponent, { read: ElementRef })
	dropdownElement?: ElementRef;

	@Input() label = "";
	@Input() id = "";
	@Input() name = "";
	@Input() multiple = false;
	@Input() showSearchUnderSelected = false;
	@Input() reload = "";
	@Input() required = false;
	@Input() showTags = true;
	@Input() moveSelected = "";
	@Input() source?: (response: any, searchTerm: any) => void;
	@Input() options: any[] = [];
	@Input() formControl!: AbstractControl;
	// @Input() formControlName?: string;
	@Input() removeable = false;
	@Output() removeIndex = new EventEmitter();
	public model!: Options;
	/* 	public model: Options = {
		value: [""],
		options: [
			{ value: "WR", label: "Wrightstown", selected: false },
			{ value: "BM", label: "Bellmawr", selected: false },
		],
	}; */

	private onChange = (value: any) => {};
	private onTouched = () => {};

	private aTowns: Array<OptionValue> = [
		{ value: "WR", label: "Wrightstown" },
		{ value: "BM", label: "Bellmawr" },
	];

	sourceAlpha = (response: any, searchTerm: any) => {
		const responseValues = [];
		const selectedValues = (
			this.dropdownElement as any
		).nativeElement.querySelectorAll("option:checked");

		for (let i = 0; i < selectedValues.length; i++) {
			const optionValue = selectedValues[i].value;
			const array = optionValue.split(":");
			const tempValue1 = array[1];
			const tempValue2 = tempValue1.split("'");
			const finalValue = tempValue2[1];

			responseValues.push({
				value: finalValue,
				label: selectedValues[i].label,
				selected: true,
			});
		}

		const diff = this.diffContains(this.aTowns, responseValues);
		const returnArray = diff.concat(this.aTowns);
		this.model.options = returnArray;
		response(returnArray, true);
	};

	onDropdownChange(event?: any) {
		/* 		if (!this.multiple && this.model.value.length > 1) {
			this.model.value.shift();
		} */
		this.onChange(this.model.value);
		this.onTouched();
	}

	writeValue(value: any): void {
		this.model = {
			value: value,
		};
		// this.model.value = typeof value === "string" ? [value] : value || [];
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	private diffContains(
		containsArray: any,
		valueArray: any,
	): Array<OptionValue> {
		let diffArray = [];
		if (containsArray.length < 1) {
			return valueArray;
		}

		diffArray = valueArray.filter(
			(x: any) => !this.arrayContains(containsArray, x.value),
		);
		return diffArray;
	}

	private arrayContains(array: any, value: any): boolean {
		return array.find((x: any) => x.value === value);
	}
}

interface Options {
	value: any;
	options?: Array<OptionValue>;
}

interface OptionValue {
	value: any;
	label: string;
	selected?: boolean;
}
