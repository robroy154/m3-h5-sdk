System.register(['tslib', '@angular/core', '@angular/forms', '@infor-lime/core', 'ids-enterprise-ng'], (function (exports) {
	'use strict';
	var __decorate, __metadata, Input, Component, inject, FormsModule, ReactiveFormsModule, IWidgetSettingsContext, CommonUtil, SohoButtonModule;
	return {
		setters: [function (module) {
			__decorate = module.__decorate;
			__metadata = module.__metadata;
		}, function (module) {
			Input = module.Input;
			Component = module.Component;
			inject = module.inject;
		}, function (module) {
			FormsModule = module.FormsModule;
			ReactiveFormsModule = module.ReactiveFormsModule;
		}, function (module) {
			IWidgetSettingsContext = module.IWidgetSettingsContext;
			CommonUtil = module.CommonUtil;
		}, function (module) {
			SohoButtonModule = module.SohoButtonModule;
		}],
		execute: (function () {

			let DemoTitleSettingFieldComponent = exports("DemoTitleSettingFieldComponent", class DemoTitleSettingFieldComponent {
			    constructor() {
			        this.widgetSettingsContext = inject(IWidgetSettingsContext);
			        this.label = "";
			        this.#context = this.widgetSettingsContext.getWidgetContext();
			        this.id = "demo-setting-title-field" + CommonUtil.random();
			        this.isTitleEditEnabled = this.#context.isTitleEditEnabled();
			        this.isTitleLocked = this.#context.isTitleLocked();
			        this.isTitleUnlockable = this.#context.isTitleUnlockable();
			        this.title = this.#context.getResolvedTitle(this.isTitleLocked);
			    }
			    #context;
			    get lockIcon() {
			        return this.isTitleLocked ? "locked" : "unlocked";
			    }
			    onLockClicked() {
			        this.isTitleLocked = !this.isTitleLocked;
			        if (this.isTitleLocked) {
			            this.title = this.widgetSettingsContext
			                .getWidgetContext()
			                .getStandardTitle();
			        }
			    }
			    save() {
			        this.#context.setTitleLocked(this.isTitleLocked);
			        if (this.isTitleEditEnabled) {
			            this.#context.setTitle(this.title);
			        }
			    }
			});
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], DemoTitleSettingFieldComponent.prototype, "label", void 0);
			exports("DemoTitleSettingFieldComponent", DemoTitleSettingFieldComponent = __decorate([
			    Component({
			        imports: [FormsModule, ReactiveFormsModule, SohoButtonModule],
			        selector: "demo-setting-title-field",
			        standalone: true,
			        template: `
		<div class="field">
			@if (label) {
				<label [for]="id">{{ label }}</label>
			}
			<input
				[readOnly]="!isTitleEditEnabled || isTitleLocked"
				[attr.id]="id"
				[name]="id"
				[(ngModel)]="title" />
			<button
				soho-button="icon"
				[icon]="lockIcon"
				[disabled]="!isTitleUnlockable"
				(click)="onLockClicked()"></button>
		</div>
	`,
			    })
			], DemoTitleSettingFieldComponent));

		})
	};
}));
