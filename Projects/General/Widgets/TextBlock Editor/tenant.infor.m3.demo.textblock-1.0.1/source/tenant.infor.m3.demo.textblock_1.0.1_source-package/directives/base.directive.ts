import { HttpErrorResponse } from "@angular/common/http";
import { Directive, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
	CommonUtil,
	DialogService,
	IToastOptions,
	IWidgetContext,
	IWidgetInstance,
	Log,
	WidgetMessageType,
	WidgetState,
} from "@infor-lime/core";
import IdsMessage, {
	IdsMessageSettings,
} from "ids-enterprise-wc/components/ids-message/ids-message";
import { TranslatePipe } from "../pipes/demo-translate-pipe";
import { BusinessContextService } from "../services/business-context.service";

const uniqueIds = new Set();
export function genUniqueId(prefix: string): string {
	const id = `${prefix}-${CommonUtil.random()}`;
	if (uniqueIds.has(id) || id.match(/^[0-9]/)) {
		return genUniqueId(prefix);
	}
	uniqueIds.add(id);
	return id;
}

@Directive()
export abstract class WidgetBase {
	readonly widgetContext = inject(IWidgetContext);
	readonly widgetInstance = inject(IWidgetInstance);
	readonly instanceId = this.widgetContext.getWidgetInstanceId();
	readonly ibcService = inject(BusinessContextService);
	readonly dialogService = inject(DialogService);

	readonly id = genUniqueId(this.constructor.name);
	protected readonly logPrefix = `[${this.widgetContext.getId()}][${this.constructor.name}] `;
	readonly lang = inject(TranslatePipe);

	protected setBusy(isBusy?: boolean): void {
		this.widgetContext.setState(
			isBusy ? WidgetState.busy : WidgetState.running,
		);
	}

	protected showToast(options: IToastOptions) {
		this.dialogService.showToast(options);
	}

	protected showWidgetMessage(message: string, type: WidgetMessageType) {
		this.removeWidgetMessage();
		this.widgetContext.showWidgetMessage({
			type,
			message,
		});
	}

	protected removeWidgetMessage() {
		this.widgetContext.removeWidgetMessage();
	}

	protected handleError(err: HttpErrorResponse) {
		const errorMessage = err.message ?? this.lang.get("unknownError");
		Log.error(this.logPrefix + JSON.stringify(err, null, "\t"));
		// this.showMessage(errorMessage, WidgetMessageType.Error);
		this.openMessage({
			message: errorMessage,
			status: "error",
			title: "Error",
		});
	}

	protected async openMessage(messageSettings: IdsMessageSettings) {
		const messageEl = document.createElement("ids-message") as IdsMessage;
		messageEl.id = "messageDialog-" + this.id;
		document.body.appendChild(messageEl);

		if (!messageSettings?.buttons?.length) {
			messageSettings.buttons = [
				{
					id: "btn-acknowledge",
					text: this.lang.get("ok"),
					click: async (e: Event, message: IdsMessage) => {
						await message.hide();
					},
					isDefault: true,
				},
			];
		}

		return messageEl.show(messageSettings);
	}

	protected async openDeleteMessage(
		messageSettings: IdsMessageSettings,
	): Promise<boolean> {
		return new Promise((resolve) => {
			const messageEl = document.createElement("ids-message") as IdsMessage;
			messageEl.id = "messageDialog-" + this.id;
			document.body.appendChild(messageEl);

			let result = false;

			messageEl.addEventListener("afterhide", () => {
				resolve(result);
			});

			if (!messageSettings?.buttons?.length) {
				messageSettings.buttons = [
					{
						id: "btn-delete",
						text: this.lang.get("delete"),
						click: (e: Event, message: IdsMessage) => {
							result = true;
							message.hide();
						},
						isDefault: true,
					},
					{
						id: "btn-cancel",
						text: this.lang.get("cancel"),
						click: (e: Event, message: IdsMessage) => {
							result = false;
							message.hide();
						},
						isDefault: false,
					},
				];
			}

			messageEl.show(messageSettings);
		});
	}
}

/* @Directive()
export abstract class BaseWithContext extends Base {
	readonly widgetContext = inject(IWidgetContext);
} */

/* @Directive()
export abstract class BaseWithLogPrefix extends BaseWithContext {
}

@Directive()
export abstract class BaseComponent extends BaseWithLogPrefix {
} */

/* @Directive()
export abstract class BaseService extends BaseWithLogPrefix {
	protected createRequest(method: "GET" | "POST", url: string) {
		return {
			method,
			url,
			cache: false,
			headers: { "Content-Type": "application/json" },
		} as IIonApiRequestOptions;
	}

	protected executeIonApiAsync<T>(request: IIonApiRequestOptions) {
		return this.widgetContext.executeIonApiAsync<T>(request).pipe(
			map((response) => this.handleResponse<T>(response)),
			catchError((error: HttpErrorResponse) => this.handleError(error)),
		);
	}

	protected handleError(err: HttpErrorResponse) {
		Log.error(this.logPrefix + JSON.stringify(err, null, "\t"));
		this.showError(err.message);
		return throwError(() => new Error(err.message));
	}

	protected handleResponse<T>(response: IIonApiResponse<T>) {
		return response.data;
	}

	protected showError(message: string) {
		this.widgetContext.showWidgetMessage({
			type: WidgetMessageType.Error,
			message,
		});
	}
} */
@Directive()
export abstract class WidgetFormBase extends WidgetBase {
	readonly #fb = inject(FormBuilder);

	form!: FormGroup;

	protected get formBuilder(): FormBuilder {
		return this.#fb;
	}

	protected markFormGroupTouched(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach((key) => {
			const control = formGroup.get(key);
			control?.markAsTouched();
			if (control instanceof FormGroup) {
				this.markFormGroupTouched(control);
			}
		});
	}

	protected resetForm(): void {
		this.form.reset();
	}

	protected isFormValid(): boolean {
		return this.form.valid;
	}

	protected getFormValue(): any {
		return this.form.value;
	}

	protected handleFormSubmit(): void {
		if (this.form.valid) {
			this.onFormSubmit();
		} else {
			this.markFormGroupTouched(this.form);
			this.showWidgetMessage(
				this.lang.get("formValidationError"),
				WidgetMessageType.Alert,
			);
		}
	}

	protected abstract onFormSubmit(): void;
}
