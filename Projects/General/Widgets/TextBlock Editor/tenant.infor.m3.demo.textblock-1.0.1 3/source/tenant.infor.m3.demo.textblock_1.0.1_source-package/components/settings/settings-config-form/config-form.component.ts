import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import {
	FormArray,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { IWidgetSettings } from "@infor-lime/core";
import { SohoDropDownComponent, SohoDropDownModule } from "ids-enterprise-ng";
import { map, Observable, of, tap } from "rxjs";
import { USER_DROPDOWN_OPTIONS } from "../../../constant/user-dropdown-options.const";
import { WidgetFormBase } from "../../../directives/base.directive";
import { DemoValueAccessorDirective } from "../../../directives/value-accessor.directive";
import { TranslatePipe } from "../../../pipes/demo-translate-pipe";
import { ConfigFormValue, ITextBlock } from "../../../types/text-block.type";
import { AutocompleteInputComponent } from "../../autocomplete-input/autocomplete-input.component";
import { CustomDropdownControlComponent } from "../../custom-dropdown-control/custom-dropdown-control.component";
import { DropdownReactiveComponent } from "../../dropdown-reactive/dropdown-reactive.component";
import { SearchFormComponent } from "../../search-form/search-form.component";

@Component({
	selector: "app-config-form",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		DemoValueAccessorDirective,
		CommonModule,
		DropdownReactiveComponent,
		AutocompleteInputComponent,
		SearchFormComponent,
		CustomDropdownControlComponent,
		SohoDropDownModule,
		TranslatePipe,
		FormsModule,
	],
	providers: [TranslatePipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: "./config-form.component.html",
	styleUrl: "./config-form.component.css",
})
export class ConfigFormComponent
	extends WidgetFormBase
	implements OnInit, AfterViewInit
{
	@ViewChild(SohoDropDownComponent, { read: ElementRef })
	dropdownElement?: ElementRef;

	@Output() formValueChange = new EventEmitter();
	// readonly ibcService = inject(BusinessContextService);
	fields$: Observable<{ label: string; value: string }[]> = of([]);

	public model: Options = {
		value: ["AK"],
		options: [
			{ value: "AK", label: "Alaska", selected: true },
			{ value: "CA", label: "California", selected: true },
			{ value: "Pa", label: "California", selected: false },
		],
	};
	fielList$!: Observable<string[]>;
	fieldList!: any[];
	keyFieldOptions: { value: string; label: string; id: string }[] = [];

	constructor(private translatePipe: TranslatePipe) {
		super();
	}
	ngOnInit(): void {
		this.fields$ = this.ibcService.ibc$.pipe(
			map((value) => {
				return Array.from(value.keys()).map((key) => ({
					label: key,
					value: value.get(key) ?? "",
				}));
			}),
		);

		this.fieldList = this.ibcService.fieldListSubject.getValue();
		this.fieldList = this.fieldList.map((item) => ({
			value: item,
			label: item,
			selected: true,
		}));

		this.fieldList = [...USER_DROPDOWN_OPTIONS, ...this.fieldList];

		this.fielList$ = this.ibcService.fieldList$.pipe(
			tap((value) => {
				/* 		const KFLD = this.form.get("KFLD")?.value;
				this.form.get("KFLD")?.setValue(KFLD); */
				this.dropdownElement?.nativeElement.update();
			}),
		);
	}

	ngAfterViewInit(): void {
		const settings = this.widgetContext.getSettings();
		// const formData = MOCK_CONFIG;

		const form = this.formBuilder.group({
			FILE: [settings.get<string>("FILE", ""), [Validators.required]],
			TFIL: [settings.get<string>("TFIL", "")],
			LNCD: [settings.get<string>("LNCD", ""), [Validators.required]],
			TXEI: [settings.get<string>("TXEI", ""), [Validators.required]],
			// KFLD: [["ACDT", "ADID"], [Validators.required]],
			// KFLD: [["FNCN", "ADR2", "OPTN"], [Validators.required]],
			KFLD: [settings.get("KFLD", ""), [Validators.required]],
			keyValues: this.createKeyValuesArray(settings),
			/* 	keyValue: this.formBuilder.group({
1				FLDI: [formData.keyValue?.FLDI ?? "", [Validators.required]],
				KFLD: [formData.keyValue?.KFLD ?? "", [Validators.required]],
			}), */
		});

		form.valueChanges.subscribe((value: any) => {
			const keyValues = this.revertKeyValuesArray(value.keyValues);
			const merged = { ...value, ...keyValues };
			delete merged.keyValues;
			this.formValueChange.emit(merged);
		});

		this.form = form;

		this.updateKeyFieldOptions();
	}

	onChange(event?: any) {
		// console.log("this.model ", this.model);
		// console.log("event ", event);
	}

	removeIndex(index: number) {
		this.keyValues.removeAt(index);
		this.keyValues.markAsDirty();
		this.keyValues.updateValueAndValidity();
	}

	patchForm(formData: ITextBlock) {
		const patchData: any = {};
		if (formData.FILE !== undefined) patchData.FILE = formData.FILE + "00";
		if (formData.TFIL !== undefined) patchData.TFIL = formData.TFIL || "MSYTXH";
		if (formData.LNCD !== undefined) patchData.LNCD = formData.LNCD;
		if (formData.TXEI !== undefined) patchData.TXEI = formData.TXEI;
		// if (formData.KFLD !== undefined) patchData.KFLD = formData.KFLD;
		patchData.KFLD = "";

		// Patch keyValues array - update existing controls
		const kvValues = [];
		for (let i = 1; i <= 16; i++) {
			const keyPattern = `KV${i.toString().padStart(2, "0")}`;

			let value = (formData as any)[keyPattern];

			if (
				value === "CONO" ||
				value === "DIVI" ||
				value === "FACI" ||
				value === "WHLO"
			) {
				value = "USER-" + value;
				kvValues.push(value);
			} else if (value !== undefined) {
				kvValues.push((formData as any)[keyPattern]);
			}
		}

		const firstNonUserIndex = kvValues.findIndex(
			(value) => !value.startsWith("USER-"),
		);
		if (firstNonUserIndex !== -1) {
			const keyValue = `KV${(firstNonUserIndex + 1).toString().padStart(2, "0")}`;

			patchData.KFLD = keyValue;
		}

		this.form.patchValue(patchData);

		// Update existing controls or add new ones
		while (this.keyValues.length > kvValues.length) {
			this.keyValues.removeAt(this.keyValues.length - 1);
		}

		kvValues.forEach((value, index) => {
			if (index < this.keyValues.length) {
				this.keyValues.at(index).setValue([value]);
				this.keyValues.at(index).setValidators(Validators.required);
				this.keyValues.at(index).updateValueAndValidity();
			} else {
				this.keyValues.push(
					this.formBuilder.control([value], Validators.required),
				);
			}
		});

		this.updateKeyFieldOptions();
	}

	sourceAlpha = (response: any, searchTerm: any) => {
		// Source function for the dropdown - can be customized as needed

		response(this.model.options, true);
	};

	private revertKeyValuesArray(keyValues: any[]): Record<string, any> {
		const kvObject: Record<string, any> = {};

		for (let i = 1; i <= 16; i++) {
			const keyPattern = `KV${i.toString().padStart(2, "0")}`;
			const value = keyValues[i - 1];
			kvObject[keyPattern] = value && value.length ? value : [];
		}

		return kvObject;
	}

	private createKeyValuesArray(settings: IWidgetSettings): FormArray {
		const kvControls = [];
		for (let i = 1; i <= 16; i++) {
			const keyPattern = `KV${i.toString().padStart(2, "0")}`;
			let value: Array<string> = [];

			// Check direct key match first
			if (settings.get<Array<string>>(keyPattern)) {
				value = settings.get<Array<string>>(keyPattern, []);
			} else {
				// Check 6-character values by last 4 characters
				/* 	for (const [key, val] of Object.entries(formData)) {
					if (key.length === 6 && key.slice(-4) === keyPattern) {
						value = val as string;
						break;
					}
				} */
			}

			if (value.length || keyPattern === "KV01") {
				kvControls.push(this.formBuilder.control(value, Validators.required));
			}
		}
		return this.formBuilder.array(kvControls);
	}
	/* 	private createKeyValuesArray(formData: any): FormArray {
		const kvControls = [];
		for (let i = 1; i <= 14; i++) {
			const keyPattern = `KV${i.toString().padStart(2, "0")}`;
			let value = "";

			// Check direct key match first
			if (formData[keyPattern] !== undefined) {
				value = formData[keyPattern];
			} else {
				// Check 6-character values by last 4 characters
				for (const [key, val] of Object.entries(formData)) {
					if (key.length === 6 && key.slice(-4) === keyPattern) {
						value = val as string;
						break;
					}
				}
			}

			if (value) {
				kvControls.push(this.formBuilder.control(value, Validators.required));
			}
		}
		return this.formBuilder.array(kvControls);
	} */

	getKeyValueFieldByIndex(index: number): string {
		return ` (KV${index.toString().padStart(2, "0")})`;
	}

	getKeyValueLabel(index: number): string {
		return `${this.translatePipe.transform("keyValue")} ${index + 1}${this.getKeyValueFieldByIndex(index + 1)}`;
	}

	updateKeyFieldOptions() {
		this.keyFieldOptions = this.keyValues.controls.map((_, i) => ({
			value: `KV${(i + 1).toString().padStart(2, "0")}`,
			id: `KV${(i + 1).toString().padStart(2, "0")}`,
			label: `keyValue${i + 1}`,
		}));

		const KFLD = this.form.get("KFLD")?.value;

		setTimeout(() => {
			this.form.get("KFLD")?.setValue(KFLD);
		}, 100);
	}

	get keyValues(): FormArray {
		return this.form?.get("keyValues") as FormArray;
	}

	addKeyValueControl(): void {
		const newControl = this.formBuilder.control([], Validators.required);
		this.keyValues.push(newControl);
	}

	dropdownMultiValueToString(stringList = ""): string {
		return stringList
			.split(",")
			.map((item) => item.match(/'([^']+)'/)?.[1] || "")
			.join(",");
	}

	onFieldSelected(value: string): void {
		// Handle selected field value
	}

	protected onFormSubmit(): void {
		const formValue: ConfigFormValue = this.getFormValue();
		// console.log("Form submitted:", formValue);
		// Handle form submission logic here
	}
}
interface Options {
	value: any;
	options: Array<OptionValue>;
}

interface OptionValue {
	value: any;
	label: string;
	selected?: boolean;
}
