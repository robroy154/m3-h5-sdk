System.register(['tslib', '@angular/core', '@infor-lime/core', 'rxjs', '@angular/common', '@angular/forms', 'ids-enterprise-ng', 'rxjs/operators'], (function (exports) {
	'use strict';
	var __decorate, __metadata, __param, Pipe, inject, Injectable, Inject, Directive, forwardRef, Input, Output, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, ViewChild, ElementRef, signal, IWidgetContext, EmptyStateIcon, widgetContextInjectionToken, IWidgetInstance, DialogService, WidgetState, Log, WidgetMessageType$1, CommonUtil, IWidgetSettingsContext, IWidgetSettingsInstance, switchMap, throwError, of, map, Subscription, BehaviorSubject, forkJoin, tap$1, concatMap, catchError$1, delay, from, mergeMap, toArray, lastValueFrom, CommonModule, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, DefaultValueAccessor, AbstractControl, ReactiveFormsModule, FormsModule, Validators, SohoDropDownComponent, SohoDropDownModule, SohoButtonModule, SohoTextAreaModule, catchError, tap, map$1;
	return {
		setters: [function (module) {
			__decorate = module.__decorate;
			__metadata = module.__metadata;
			__param = module.__param;
		}, function (module) {
			Pipe = module.Pipe;
			inject = module.inject;
			Injectable = module.Injectable;
			Inject = module.Inject;
			Directive = module.Directive;
			forwardRef = module.forwardRef;
			Input = module.Input;
			Output = module.Output;
			Component = module.Component;
			CUSTOM_ELEMENTS_SCHEMA = module.CUSTOM_ELEMENTS_SCHEMA;
			EventEmitter = module.EventEmitter;
			ViewChild = module.ViewChild;
			ElementRef = module.ElementRef;
			signal = module.signal;
		}, function (module) {
			IWidgetContext = module.IWidgetContext;
			EmptyStateIcon = module.EmptyStateIcon;
			widgetContextInjectionToken = module.widgetContextInjectionToken;
			IWidgetInstance = module.IWidgetInstance;
			DialogService = module.DialogService;
			WidgetState = module.WidgetState;
			Log = module.Log;
			WidgetMessageType$1 = module.WidgetMessageType;
			CommonUtil = module.CommonUtil;
			IWidgetSettingsContext = module.IWidgetSettingsContext;
			IWidgetSettingsInstance = module.IWidgetSettingsInstance;
		}, function (module) {
			switchMap = module.switchMap;
			throwError = module.throwError;
			of = module.of;
			map = module.map;
			Subscription = module.Subscription;
			BehaviorSubject = module.BehaviorSubject;
			forkJoin = module.forkJoin;
			tap$1 = module.tap;
			concatMap = module.concatMap;
			catchError$1 = module.catchError;
			delay = module.delay;
			from = module.from;
			mergeMap = module.mergeMap;
			toArray = module.toArray;
			lastValueFrom = module.lastValueFrom;
		}, function (module) {
			CommonModule = module.CommonModule;
		}, function (module) {
			FormBuilder = module.FormBuilder;
			FormGroup = module.FormGroup;
			NG_VALUE_ACCESSOR = module.NG_VALUE_ACCESSOR;
			DefaultValueAccessor = module.DefaultValueAccessor;
			AbstractControl = module.AbstractControl;
			ReactiveFormsModule = module.ReactiveFormsModule;
			FormsModule = module.FormsModule;
			Validators = module.Validators;
		}, function (module) {
			SohoDropDownComponent = module.SohoDropDownComponent;
			SohoDropDownModule = module.SohoDropDownModule;
			SohoButtonModule = module.SohoButtonModule;
			SohoTextAreaModule = module.SohoTextAreaModule;
		}, function (module) {
			catchError = module.catchError;
			tap = module.tap;
			map$1 = module.map;
		}],
		execute: (function () {

			exports("widgetFactory", widgetFactory);

			const USER_DROPDOWN_OPTIONS = [
			    {
			        label: "User - User - Company number",
			        value: "USER-CONO",
			        icon: "user-profile",
			        selected: false,
			    },
			    {
			        label: "User - Division",
			        value: "USER-DIVI",
			        icon: "user-profile",
			        selected: false,
			    },
			    {
			        label: "User - Facility",
			        value: "USER-FACI",
			        icon: "user-profile",
			        selected: false,
			    },
			    {
			        label: "User - Warehouse",
			        value: "USER-WHLI",
			        icon: "user-profile",
			        selected: false,
			    },
			];

			let TranslatePipe = class TranslatePipe {
			    #context = inject(IWidgetContext);
			    #lang;
			    constructor() {
			        this.#lang = this.#context.getLanguage();
			    }
			    format(text, value) {
			        return this.#lang.format(text, value);
			    }
			    get(id) {
			        return this.#lang.get(id) || id;
			    }
			    transform(text, value) {
			        const constant = this.get(text);
			        return value || value === "" ? this.format(constant, value) : constant;
			    }
			};
			TranslatePipe = __decorate([
			    Pipe({ name: "t", standalone: true }),
			    __metadata("design:paramtypes", [])
			], TranslatePipe);

			var Mode;
			(function (Mode) {
			    Mode[Mode["Display"] = 0] = "Display";
			    Mode[Mode["Edit"] = 1] = "Edit";
			    Mode[Mode["New"] = 2] = "New";
			})(Mode || (Mode = {}));
			var State;
			(function (State) {
			    State[State["ErrorLoading"] = 0] = "ErrorLoading";
			    State[State["NoData"] = 1] = "NoData";
			    State[State["WaitingForContext"] = 2] = "WaitingForContext";
			    State[State["Ok"] = 3] = "Ok";
			    State[State["Editing"] = 4] = "Editing";
			    State[State["New"] = 5] = "New";
			})(State || (State = {}));
			var WidgetMessageType;
			(function (WidgetMessageType) {
			    WidgetMessageType[WidgetMessageType["Info"] = 0] = "Info";
			    WidgetMessageType[WidgetMessageType["Alert"] = 1] = "Alert";
			    WidgetMessageType[WidgetMessageType["Error"] = 2] = "Error";
			})(WidgetMessageType || (WidgetMessageType = {}));

			const EMPTY_STATE = {
			    [State.ErrorLoading]: {
			        icon: EmptyStateIcon.ErrorLoading + "-new",
			        info: "empty-error-loading-info",
			        title: "empty-error-loading-title",
			    },
			    [State.NoData]: {
			        icon: EmptyStateIcon.NoData + "-new",
			        info: "",
			        title: "empty-no-data-title",
			    },
			    [State.WaitingForContext]: {
			        icon: EmptyStateIcon.Generic + "-new",
			        info: "",
			        title: "empty-generic-title",
			    },
			};

			const MOCK_DATA_PMS100 = {
			    screenId: "m3_PMS100_E",
			    entities: [
			        {
			            entityType: "InforProductNumber",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "15402000",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforProductionOrder",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "2600012961",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforWorkOrderNumber",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "2600012961",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforUser",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "DASCAL0",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforWarehouse",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "210",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforLotNumber",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "2508041001",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforSerialNumber",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "2508041001",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "200",
			        panel: "PMA100E0",
			        iid: "676d9ac24eb3a3b43855b154da020925",
			        lng: "GB",
			        jobid: "",
			        chgby: "",
			        url: "",
			        dsep: "",
			        moddate: "",
			        user: "Alfred Norlander",
			        userid: "NORALF0",
			        df: "",
			        regdate: "",
			    },
			    program: "PMS100",
			    panel: "E",
			    screenIdBase: "PMS100",
			    logicalId: "lid://infor.m3.m3",
			    supportProductId: "109562",
			};
			const MOCK_DATA_QMS400 = {
			    screenId: "m3_QMS400_B1",
			    entities: [
			        {
			            entityType: "InforQITest",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "MICROBIO01",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforFacility",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "D10",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforProductStructure",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "D10",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforProductionComponent",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "D10",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforProductionOperation",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "D10",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforQIRequest",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "00003604",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforItemCustomerMaster",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "FS10002",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforItemMaster",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "FS10002",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforItemSpecifications",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "FS10002",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforStockIdentity",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "FS10002",
			            id4: "0003008306",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforLotNumber",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id2: "FS10002",
			            id1: "0003008306",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforLot",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "0003008306",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			        {
			            entityType: "InforLotMaster",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "0003008306",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS400&fieldNames=WBFACI%2CD10%2CWBFTST%2C%2520%2CWB2TST%2C%2520%2CWBQRID%2C00003123%2CWBSPEC%2C%2520%2CWBTCLS%2C%2520%2CWBLABO%2C%2520%2CW1OBKV%2C%2520%2CW3OBKV%2C%2520&tableName=QMSTRS&keys=RRCONO%2C400%2CRRFACI%2C%2B%2CRRQRID%2C%2B%2CRRQTST%2C%20%2CRRTSTY%2C%2B%2CRRTSEQ%2C%20&name=QMS400%2FB&description=QMS400%20QI%20Test%20Results.%20Open&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=STD01-01G2&parameters=XXFACI%2CD10%2CXXQRID%2C00003123",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "FR1",
			        panel: "QMA400BC",
			        iid: "b455cb66fc33e8f26d0cc782c1bd3a27",
			        lng: "GB",
			        jobid: "",
			        chgby: "",
			        url: "",
			        dsep: "",
			        moddate: "",
			        user: "Alfred Norlander",
			        userid: "NORALF0",
			        df: "",
			        regdate: "",
			    },
			    program: "QMS400",
			    panel: "B",
			    screenIdBase: "QMS400",
			    supportProductId: "109562",
			};
			const MOCK_DATA_QMS201 = {
			    screenId: "m3_QMS201_B",
			    entities: [
			        {
			            entityType: "InforQITest",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "MICROBIO01",
			            id2: "FOOD-SUPPL",
			            id3: "FOOD-SUPPL-FG",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS201&fieldNames=W1OBKV%2CFOOD-SUPPL%2CW6OBKV%2C%2520%2CW2OBKV%2C%2520%2CW8OBKV%2C%2520%2CW9OBKV%2C%2520%2CW7OBKV%2C%2520&tableName=QMSTST&keys=QSCONO%2C400%2CQSITNO%2C%2B%2CQSQMGP%2C%2B%2CQSSPEC%2C%20%2CQSQSE1%2C%2B%2CQSQSE2%2C%2B%2CQSQTST%2C%20%2CQSTSTY%2C%20%2CQSQTE1%2C%20%2CQSQTE2%2C%20&name=QMS201%2FB&description=QMS201%20Specification%20Test&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=6&view=F06-01GDE",
			        },
			        {
			            entityType: "InforSpecificationTest",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id3: "MICROBIO01",
			            id1: "FOOD-SUPPL-FG",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS201&fieldNames=W1OBKV%2CFOOD-SUPPL%2CW6OBKV%2C%2520%2CW2OBKV%2C%2520%2CW8OBKV%2C%2520%2CW9OBKV%2C%2520%2CW7OBKV%2C%2520&tableName=QMSTST&keys=QSCONO%2C400%2CQSITNO%2C%2B%2CQSQMGP%2C%2B%2CQSSPEC%2C%20%2CQSQSE1%2C%2B%2CQSQSE2%2C%2B%2CQSQTST%2C%20%2CQSTSTY%2C%20%2CQSQTE1%2C%20%2CQSQTE2%2C%20&name=QMS201%2FB&description=QMS201%20Specification%20Test&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=6&view=F06-01GDE",
			        },
			        {
			            entityType: "InforQualityGroup",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "FOOD-SUPPL",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS201&fieldNames=W1OBKV%2CFOOD-SUPPL%2CW6OBKV%2C%2520%2CW2OBKV%2C%2520%2CW8OBKV%2C%2520%2CW9OBKV%2C%2520%2CW7OBKV%2C%2520&tableName=QMSTST&keys=QSCONO%2C400%2CQSITNO%2C%2B%2CQSQMGP%2C%2B%2CQSSPEC%2C%20%2CQSQSE1%2C%2B%2CQSQSE2%2C%2B%2CQSQTST%2C%20%2CQSTSTY%2C%20%2CQSQTE1%2C%20%2CQSQTE2%2C%20&name=QMS201%2FB&description=QMS201%20Specification%20Test&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=6&view=F06-01GDE",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "FR1",
			        panel: "QMA201BC",
			        iid: "1352fecb9843a06d943cf275ed2911eb",
			        lng: "GB",
			        jobid: "",
			        chgby: "",
			        url: "",
			        dsep: "",
			        moddate: "",
			        user: "Alfred Norlander",
			        userid: "NORALF0",
			        df: "",
			        regdate: "",
			    },
			    program: "QMS201",
			    panel: "B",
			    screenIdBase: "QMS201",
			    supportProductId: "109562",
			};
			const MOCK_DATA_QMS201_ERROR = {
			    screenId: "m3_QMS201_B",
			    entities: [
			        {
			            entityType: "InforQITest",
			            accountingEntity: "400_FR1",
			            visible: true,
			            id1: "VETERINAR",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=QMS201&fieldNames=W1OBKV%2C%2520%2CW2OBKV%2CFOOD-SUPPL%2CW3OBKV%2CFOOD-SUPPL-FG%2CW4OBKV%2C220101%2CW5OBKV%2C0%2CW6OBKV%2C%2520%2CW7OBKV%2C%2520%2CW8OBKV%2C%2520%2CW9OBKV%2C%2520&tableName=QMSTST&keys=QSCONO%2C400%2CQSITNO%2C%2B%2CQSQMGP%2C%2B%2CQSSPEC%2C%2B%2CQSQSE1%2C%2B%2CQSQSE2%2C%2B%2CQSQTST%2C%20%2CQSTSTY%2C%20%2CQSQTE1%2C%20%2CQSQTE2%2C%20&name=QMS201%2FB&description=QMS201%20Specification%20Test&includeStartPanel=True&source=MForms&requirePanel=True&startPanel=B&sortingOrder=1&view=F01-01GDE",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "FR1",
			        panel: "QMA201BC",
			        iid: "4627da8724b7906814a473fbbbc65608",
			        lng: "GB",
			        jobid: "",
			        chgby: "",
			        url: "",
			        dsep: "",
			        moddate: "",
			        user: "Alfred Norlander",
			        userid: "NORALF0",
			        df: "",
			        regdate: "",
			    },
			    program: "QMS201",
			    panel: "B",
			    screenIdBase: "QMS201",
			    supportProductId: "109562",
			};
			const CREDIT_MANAGER_TOOLBOX = {
			    screenId: "<TBC>",
			    program: "<TBC>",
			    entities: [
			        {
			            accountingEntity: "400_AAA",
			            entityType: "InforBillToPartyMaster",
			            visible: true,
			            drillbackURL: "",
			            id1: "MMUSCUST",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "AAA",
			    },
			};
			const MOCK_MMS001 = {
			    screenId: "m3_MMS001_E",
			    entities: [
			        {
			            entityType: "InforItemMaster",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "0110012",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=MMS001&tableName=MITMAS&keys=MMCONO%2C400%2CMMITNO%2C11011000%2B%2B%2B%2B%2B%2B%2B&option=5&name=MMS001%2FE&description=MMS001%20Item.%20Open&panel=E",
			        },
			        {
			            entityType: "InforUser",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "FABPLANNER",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=MMS001&tableName=MITMAS&keys=MMCONO%2C400%2CMMITNO%2C11011000%2B%2B%2B%2B%2B%2B%2B&option=5&name=MMS001%2FE&description=MMS001%20Item.%20Open&panel=E",
			        },
			        {
			            entityType: "InforProductGroup",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "1100",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=MMS001&tableName=MITMAS&keys=MMCONO%2C400%2CMMITNO%2C11011000%2B%2B%2B%2B%2B%2B%2B&option=5&name=MMS001%2FE&description=MMS001%20Item.%20Open&panel=E",
			        },
			        {
			            entityType: "InforCustomerPartyMaster",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "1133000001",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=CRS610&tableName=OCUSMA&keys=OKCONO%2C400%2COKCUNO%2C9901%2B%2B%2B%2B%2B%2B&option=5&name=CRS610%2FE&description=CRS610%20Customer.%20Open&panel=E",
			        },
			        {
			            entityType: "InforProductNumber",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "15401002",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			        {
			            entityType: "InforProductionOrder",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "2600012886",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=PMS100&tableName=MWOHED&keys=VHCONO%2C400%2CVHFACI%2C210%2CVHPRNO%2C15401002%2B%2B%2B%2B%2B%2B%2B%2CVHMFNO%2C2600012886&option=5&name=PMS100%2FE&description=PMS100%20Manufacturing%20Order.%20Open&panel=E",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "200",
			        panel: "MMA001E0",
			        iid: "f74ce21b8b23ded7fb99e28af66ff2d5",
			        lng: "GB",
			        jobid: "",
			        chgby: "",
			        url: "",
			        dsep: "",
			        moddate: "",
			        user: "Alfred Norlander",
			        userid: "NORALF0",
			        df: "",
			        regdate: "",
			    },
			    program: "MMS001",
			    panel: "E",
			    screenIdBase: "MMS001",
			    logicalId: "lid://infor.m3.m3",
			    supportProductId: "109562",
			};
			const MOCK_CRS610 = {
			    screenId: "m3_CRS610_E",
			    entities: [
			        {
			            entityType: "InforCustomerPartyMaster",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "1133000001",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=CRS610&tableName=OCUSMA&keys=OKCONO%2C400%2COKCUNO%2C9901%2B%2B%2B%2B%2B%2B&option=5&name=CRS610%2FE&description=CRS610%20Customer.%20Open&panel=E",
			        },
			        {
			            entityType: "InforAddress",
			            accountingEntity: "400_200",
			            visible: true,
			            id1: "Address 1",
			            id2: "Address 2",
			            id3: "Hartford CT 06053",
			            id4: "United States",
			            drillbackURL: "?LogicalId=lid://infor.m3.m3&program=CRS610&tableName=OCUSMA&keys=OKCONO%2C400%2COKCUNO%2C9901%2B%2B%2B%2B%2B%2B&option=5&name=CRS610%2FE&description=CRS610%20Customer.%20Open&panel=E",
			        },
			    ],
			    session: {
			        cono: "400",
			        divi: "200",
			        panel: "CRA610E0",
			        iid: "ccd6d875b89004d2ce75236828858b0f",
			        lng: "GB",
			        jobid: "",
			        chgby: "",
			        url: "",
			        dsep: "",
			        moddate: "",
			        user: "Alfred Norlander",
			        userid: "NORALF0",
			        df: "",
			        regdate: "",
			    },
			    program: "CRS610",
			    panel: "E",
			    screenIdBase: "CRS610",
			    logicalId: "lid://infor.m3.m3",
			    supportProductId: "109562",
			};

			const TEXTBLOCK_SEPARATORS = [
			    " ",
			    "、",
			    "。",
			    "，",
			    "。",
			    "；",
			    "：",
			    "！",
			    "？",
			    "（",
			    "）",
			];

			var _a$6;
			let MiUtilService = class MiUtilService {
			    constructor(widgetContext) {
			        this.widgetContext = widgetContext;
			    }
			    isDateInRange(fromDateStr, toDateStr) {
			        const fromDate = this.parseDate(fromDateStr);
			        const toDate = this.parseDate(toDateStr);
			        const todayStr = this.getTodayDateYYYYMMDD();
			        const todayDate = this.parseDate(todayStr);
			        return fromDate <= todayDate && todayDate <= toDate;
			    }
			    parseDate(dateStr) {
			        const year = parseInt(dateStr.substring(0, 4), 10);
			        const month = parseInt(dateStr.substring(4, 6), 10) - 1;
			        const day = parseInt(dateStr.substring(6, 8), 10);
			        return new Date(year, month, day);
			    }
			    getTodayDateYYYYMMDD() {
			        const today = new Date();
			        const year = today.getFullYear();
			        const month = (today.getMonth() + 1).toString().padStart(2, "0");
			        const day = today.getDate().toString().padStart(2, "0");
			        return `${year}${month}${day}`;
			    }
			    formatDate(date) {
			        const year = date.getFullYear();
			        const month = (date.getMonth() + 1).toString().padStart(2, "0");
			        return `${year}${month}`;
			    }
			    getM3User() {
			        const request = this.createRequest("MNS150MI", "GetUserData", {}, 1);
			        return this.widgetContext.executeIonApiAsync(request).pipe(switchMap((response) => {
			            return this.handleResponse(response, 1);
			        }), catchError((error) => this.handleError(error)));
			    }
			    handleError(error) {
			        const errorMessage = error.message ?? "";
			        return throwError(() => new Error(errorMessage));
			    }
			    handleResponse(response, responseLength) {
			        const data = response.data?.results?.length
			            ? response.data.results[0]
			            : null;
			        if (data?.errorMessage) {
			            const errorMessage = `${data["errorMessage"]} ${data["errorField"] ? "(" + data["errorField"] + ")" : ""}`;
			            return throwError(() => new Error(errorMessage));
			        }
			        const records = data?.records?.length
			            ? this.removePrefix(data.records)
			            : [];
			        if (responseLength === 1) {
			            return of(records[0]);
			        }
			        return of(records);
			    }
			    removePrefix(items) {
			        if (!items.length) {
			            return items;
			        }
			        items.forEach((obj) => {
			            Object.entries(obj).forEach(([key, value], i) => {
			                if (key.length === 6) {
			                    obj[key.slice(2)] = value;
			                    delete obj[key];
			                    obj["id"] = i;
			                }
			            });
			        });
			        return items;
			    }
			    execute(program, transaction, parameters = {}, maxReturnRecords = 0, outputData, ignoreError = false) {
			        const request = this.createRequest(program, transaction, parameters, maxReturnRecords, outputData);
			        return this.widgetContext.executeIonApiAsync(request).pipe(switchMap((response) => {
			            return this.handleResponse(response, maxReturnRecords);
			        }), catchError((error) => ignoreError ? of([]) : this.handleError(error)));
			    }
			    createRequest(program, transaction, parameters = {}, maxReturnRecords = 0, outputData) {
			        const max = maxReturnRecords
			            ? `maxrecs=${maxReturnRecords};`
			            : `maxrecs=6000;`;
			        const output = outputData ? `returncols=${outputData};` : "";
			        return {
			            method: "GET",
			            url: `/M3/m3api-rest/v2/execute/${program}/${transaction};${max}${output}`,
			            params: parameters,
			            cache: false,
			            headers: {
			                Accept: "application/json",
			            },
			        };
			    }
			};
			MiUtilService = __decorate([
			    Injectable({
			        providedIn: "root",
			    }),
			    __param(0, Inject(widgetContextInjectionToken)),
			    __metadata("design:paramtypes", [typeof (_a$6 = typeof IWidgetContext !== "undefined" && IWidgetContext) === "function" ? _a$6 : Object])
			], MiUtilService);

			let TextBlockParameterService = class TextBlockParameterService {
			    #miUtil = inject(MiUtilService);
			    getParByPgm(program) {
			        const parameters = {
			            PGNM: program,
			        };
			        return this.#miUtil
			            .execute("BOOKMKMI", "GetParByPgm", parameters, 1, "", true)
			            .pipe(map((resp) => this.massageSearchData(resp)));
			    }
			    massageSearchData(responseData) {
			        if (!responseData)
			            return null;
			        const result = {};
			        let firstNonExcludedKvKey = null;
			        for (let i = 1; i <= 16; i++) {
			            const kfKey = `KF${i.toString().padStart(2, "0")}`;
			            const kvKey = `KV${i.toString().padStart(2, "0")}`;
			            if (responseData[kfKey] !== "") {
			                let value = responseData[kfKey];
			                if (typeof value === "string" && value.length === 6) {
			                    value = value.slice(2);
			                }
			                if (value) {
			                    if (!firstNonExcludedKvKey &&
			                        !["CONO", "DIVI", "FACI", "WHLO"].includes(value)) {
			                        firstNonExcludedKvKey = kvKey;
			                    }
			                    else if (["CONO", "DIVI", "FACI", "WHLO"].includes(value)) {
			                        value = "USER-" + value;
			                    }
			                    result[kvKey] = [value];
			                }
			            }
			        }
			        if (firstNonExcludedKvKey) {
			            result.KFLD = firstNonExcludedKvKey;
			        }
			        result["FILE"] = responseData.FILE;
			        return result;
			    }
			};
			TextBlockParameterService = __decorate([
			    Injectable({
			        providedIn: "root",
			    })
			], TextBlockParameterService);

			let UserService = class UserService {
			    constructor() {
			        this.miUtil = inject(MiUtilService);
			        this.userMap = new Map();
			    }
			    init() {
			        return this.miUtil.execute("MNS150MI", "GetUserData", {}, 1).pipe(tap((result) => {
			            Object.keys(result).forEach((key) => {
			                this.userMap.set("USER-" + key, result[key]);
			            });
			            this.user = result;
			        }), map$1(() => void 0));
			    }
			};
			UserService = __decorate([
			    Injectable()
			], UserService);

			let BusinessContextService = class BusinessContextService {
			    #textBlockParameterService;
			    constructor() {
			        this.subscriptions = new Subscription();
			        this.ibcSubject = new BehaviorSubject(new Map());
			        this.ibc$ = this.ibcSubject.asObservable();
			        this.USER_DROPDOWN_OPTIONS = USER_DROPDOWN_OPTIONS;
			        this.fieldListSubject = new BehaviorSubject([]);
			        this.fieldList$ = this.fieldListSubject.asObservable();
			        this.MOCK_DATA_QMS201 = MOCK_DATA_QMS201;
			        this.MOCK_DATA_QMS400 = MOCK_DATA_QMS400;
			        this.CREDIT_MANAGER_TOOLBOX = CREDIT_MANAGER_TOOLBOX;
			        this.MOCK_DATA_QMS201_ERROR = MOCK_DATA_QMS201_ERROR;
			        this.MOCK_DATA_PMS100 = MOCK_DATA_PMS100;
			        this.MOCK_MMS001 = MOCK_MMS001;
			        this.MOCK_CRS610 = MOCK_CRS610;
			        this.valueMap = new Map();
			        this.widgetContext = inject(IWidgetContext);
			        this.widgetInstance = inject(IWidgetInstance);
			        this.miUtil = inject(MiUtilService);
			        this.userService = inject(UserService);
			        this.#textBlockParameterService = inject(TextBlockParameterService);
			    }
			    setEventHandlers() {
			        this.registerMessageHandlers();
			        this.widgetInstance.activated = () => {
			            this.registerMessageHandlers();
			        };
			        this.widgetInstance.deactivated = () => this.unregisterMessageHandlers();
			    }
			    registerMessageHandlers() {
			        this.subscriptions.unsubscribe();
			        this.subscriptions = new Subscription();
			        const ibcSub = this.widgetContext
			            .receive("inforBusinessContext")
			            .subscribe((data) => this.handleMessage(data));
			        this.subscriptions.add(ibcSub);
			        const iwcSub = this.widgetContext
			            .receive("inforWidgetContext")
			            .subscribe((data) => this.handleMessage(data));
			        this.subscriptions.add(iwcSub);
			    }
			    unregisterMessageHandlers() {
			        this.subscriptions.unsubscribe();
			    }
			    handleMessage(data) {
			        this.valueMap.clear();
			        this.valueMap.set("program", data?.program ?? "");
			        for (const [key, value] of this.userService.userMap) {
			            this.valueMap.set(key, value);
			        }
			        const entities = data?.entities ?? [];
			        if (!entities?.length) {
			            return;
			        }
			        const mappedEntities = new Map();
			        entities.forEach((entity) => {
			            const entityType = entity.entityType;
			            const groupedEntity = this.groupedEntities[entityType];
			            const newProperties = {};
			            if (groupedEntity) {
			                groupedEntity.forEach((group) => {
			                    const idKey = `id${group.SQNR}`;
			                    if (entity[idKey] !== undefined) {
			                        this.valueMap.set(group.FLDI, entity[idKey]);
			                        newProperties[group.FLDI] = entity[idKey];
			                    }
			                });
			            }
			            mappedEntities.set(entityType, { ...entity, ...newProperties });
			        });
			        if (data?.program === "QMS201" &&
			            (!this.valueMap.has("QMGP") || !this.valueMap.has("SPEC"))) {
			            this.parseDrillbackUrl(entities);
			        }
			        const settings = this.widgetContext.getSettings();
			        const autoMode = settings.get("autoMode");
			        if (autoMode && this.valueMap.get("program")) {
			            this.getByProgram();
			        }
			        else if (!autoMode) {
			            this.updateKeyValueMap();
			        }
			    }
			    getByProgram() {
			        const program = this.valueMap.get("program") ?? "";
			        if (!program)
			            return;
			        this.#textBlockParameterService.getParByPgm(program).subscribe({
			            next: (resp) => {
			                this.updateKeyValueMap(resp);
			            },
			            error: (err) => {
			            },
			        });
			    }
			    removeExistingKeyValueMap() {
			        const settingsToCheck = ["KFLD"];
			        for (let i = 1; i <= 16; i++) {
			            settingsToCheck.push(`KV${i.toString().padStart(2, "0")}`);
			        }
			        settingsToCheck.forEach((settingKey) => {
			            this.valueMap.delete(settingKey);
			        });
			    }
			    updateKeyValueMap(keyValueSettings) {
			        this.removeExistingKeyValueMap();
			        const settings = this.widgetContext.getSettings();
			        const keyValueMap = new Map();
			        keyValueSettings = keyValueSettings ?? this.keyValueSettings;
			        const keyValues = Object.keys(keyValueSettings ?? this.keyValueSettings);
			        keyValues.forEach((settingKey) => {
			            let keyArray;
			            if (settingKey === "KFLD") {
			                keyArray =
			                    keyValueSettings[keyValueSettings["KFLD"]] ??
			                        settings.get(settings.get("KFLD") ?? "");
			            }
			            else {
			                keyArray = keyValueSettings[settingKey] ?? settings.get(settingKey);
			            }
			            if (Array.isArray(keyArray)) {
			                const foundKey = keyArray.find((key) => this.valueMap.has(key));
			                if (foundKey && this.valueMap.get(foundKey)) {
			                    keyValueMap.set(settingKey, this.valueMap.get(foundKey));
			                }
			            }
			            if (settingKey === "FILE" && keyValueSettings[settingKey]) {
			                const file = keyValueSettings[settingKey].endsWith("00")
			                    ? keyValueSettings[settingKey]
			                    : keyValueSettings[settingKey] + "00";
			                keyValueMap.set("FILE", file);
			            }
			        });
			        const valid = keyValues.length === keyValueMap.size;
			        if (valid) {
			            this.valueMap = new Map([...this.valueMap, ...keyValueMap]);
			        }
			        this.ibcSubject.next(valid ? this.valueMap : new Map());
			    }
			    get keyValueSettings() {
			        const settings = this.widgetContext.getSettings();
			        const settingsValue = settings.getValues();
			        const result = {};
			        const keys = ["KFLD"];
			        for (let i = 1; i <= 16; i++) {
			            keys.push(`KV${i.toString().padStart(2, "0")}`);
			        }
			        keys.forEach((key) => {
			            const value = settingsValue[key];
			            if (Array.isArray(value) && value.length > 0) {
			                result[key] = value;
			            }
			        });
			        const kfldValue = settings.get("KFLD", "");
			        result["KFLD"] = result[kfldValue];
			        return result;
			    }
			    parseDrillbackUrl(enteties) {
			        const entityInforQITest = enteties.find((e) => e.entityType === "InforQITest");
			        if (!entityInforQITest?.drillbackURL)
			            return;
			        const drillbackURL = entityInforQITest.drillbackURL;
			        if (!drillbackURL) {
			            return "";
			        }
			        const decodedUrl = decodeURIComponent(drillbackURL);
			        const urlParams = new URLSearchParams(decodedUrl);
			        const fieldNames = urlParams.get("fieldNames");
			        if (!fieldNames) {
			            return "";
			        }
			        const fields = fieldNames.split(",");
			        const values = {};
			        for (let i = 0; i < fields.length; i += 2) {
			            const field = fields[i];
			            const value = fields[i + 1];
			            if (field && ["W1OBKV", "W2OBKV", "W3OBKV", "W4OBKV"].includes(field)) {
			                values[field] = value.trim();
			            }
			        }
			        if (!this.valueMap.has("ITNO") && values["W1OBKV"])
			            this.valueMap.set("ITNO", values["W1OBKV"]);
			        if (!this.valueMap.has("QMGP") && values["W2OBKV"])
			            this.valueMap.set("QMGP", values["W2OBKV"]);
			        if (!this.valueMap.has("SPEC") && values["W3OBKV"])
			            this.valueMap.set("SPEC", values["W3OBKV"]);
			        return;
			    }
			    init() {
			        return forkJoin([this.setEntities(), this.userService.init()]).pipe(map$1(() => void 0));
			    }
			    createUniqueKeysMap(entities) {
			        const uniqueMap = new Map();
			        entities.forEach((entity) => {
			            Object.entries(entity).forEach(([key, value]) => {
			                if (value && !uniqueMap.has(key)) {
			                    uniqueMap.set(key, String(value));
			                }
			            });
			        });
			        return uniqueMap;
			    }
			    getUniqueFLDIValues(response) {
			        return [
			            ...new Set(response.map((entity) => entity.FLDI).filter(Boolean)),
			        ].sort();
			    }
			    setEntities() {
			        return this.miUtil.execute("MNS035MI", "LstByEntity").pipe(tap((response) => {
			            const uniqueFLDIValues = this.getUniqueFLDIValues(response);
			            this.fieldListSubject.next(uniqueFLDIValues);
			            const groupedEntities = response.reduce((acc, entity) => {
			                const key = entity.ISEC;
			                if (!acc[key]) {
			                    acc[key] = [];
			                }
			                acc[key].push(entity);
			                return acc;
			            }, {});
			            this.groupedEntities = groupedEntities;
			            this.setEventHandlers();
			            if (this.widgetContext.isDev()) {
			                setTimeout(() => {
			                    this.handleMessage(this.MOCK_DATA_PMS100);
			                }, 1000);
			            }
			        }), map$1(() => void 0));
			    }
			};
			BusinessContextService = __decorate([
			    Injectable(),
			    __metadata("design:paramtypes", [])
			], BusinessContextService);

			const uniqueIds = new Set();
			function genUniqueId(prefix) {
			    const id = `${prefix}-${CommonUtil.random()}`;
			    if (uniqueIds.has(id) || id.match(/^[0-9]/)) {
			        return genUniqueId(prefix);
			    }
			    uniqueIds.add(id);
			    return id;
			}
			let WidgetBase = class WidgetBase {
			    constructor() {
			        this.widgetContext = inject(IWidgetContext);
			        this.widgetInstance = inject(IWidgetInstance);
			        this.instanceId = this.widgetContext.getWidgetInstanceId();
			        this.ibcService = inject(BusinessContextService);
			        this.dialogService = inject(DialogService);
			        this.id = genUniqueId(this.constructor.name);
			        this.logPrefix = `[${this.widgetContext.getId()}][${this.constructor.name}] `;
			        this.lang = inject(TranslatePipe);
			    }
			    setBusy(isBusy) {
			        this.widgetContext.setState(isBusy ? WidgetState.busy : WidgetState.running);
			    }
			    showToast(options) {
			        this.dialogService.showToast(options);
			    }
			    showWidgetMessage(message, type) {
			        this.removeWidgetMessage();
			        this.widgetContext.showWidgetMessage({
			            type,
			            message,
			        });
			    }
			    removeWidgetMessage() {
			        this.widgetContext.removeWidgetMessage();
			    }
			    handleError(err) {
			        const errorMessage = err.message ?? this.lang.get("unknownError");
			        Log.error(this.logPrefix + JSON.stringify(err, null, "\t"));
			        this.openMessage({
			            message: errorMessage,
			            status: "error",
			            title: "Error",
			        });
			    }
			    async openMessage(messageSettings) {
			        const messageEl = document.createElement("ids-message");
			        messageEl.id = "messageDialog-" + this.id;
			        document.body.appendChild(messageEl);
			        if (!messageSettings?.buttons?.length) {
			            messageSettings.buttons = [
			                {
			                    id: "btn-acknowledge",
			                    text: this.lang.get("ok"),
			                    click: async (e, message) => {
			                        await message.hide();
			                    },
			                    isDefault: true,
			                },
			            ];
			        }
			        return messageEl.show(messageSettings);
			    }
			    async openDeleteMessage(messageSettings) {
			        return new Promise((resolve) => {
			            const messageEl = document.createElement("ids-message");
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
			                        click: (e, message) => {
			                            result = true;
			                            message.hide();
			                        },
			                        isDefault: true,
			                    },
			                    {
			                        id: "btn-cancel",
			                        text: this.lang.get("cancel"),
			                        click: (e, message) => {
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
			};
			WidgetBase = __decorate([
			    Directive()
			], WidgetBase);
			let WidgetFormBase = class WidgetFormBase extends WidgetBase {
			    #fb = inject(FormBuilder);
			    get formBuilder() {
			        return this.#fb;
			    }
			    markFormGroupTouched(formGroup) {
			        Object.keys(formGroup.controls).forEach((key) => {
			            const control = formGroup.get(key);
			            control?.markAsTouched();
			            if (control instanceof FormGroup) {
			                this.markFormGroupTouched(control);
			            }
			        });
			    }
			    resetForm() {
			        this.form.reset();
			    }
			    isFormValid() {
			        return this.form.valid;
			    }
			    getFormValue() {
			        return this.form.value;
			    }
			    handleFormSubmit() {
			        if (this.form.valid) {
			            this.onFormSubmit();
			        }
			        else {
			            this.markFormGroupTouched(this.form);
			            this.showWidgetMessage(this.lang.get("formValidationError"), WidgetMessageType$1.Alert);
			        }
			    }
			};
			WidgetFormBase = __decorate([
			    Directive()
			], WidgetFormBase);

			let DemoValueAccessorDirective = class DemoValueAccessorDirective extends DefaultValueAccessor {
			};
			DemoValueAccessorDirective = __decorate([
			    Directive({
			        selector: "ids-input[formControlName], ids-trigger-field[ngModel], ids-textarea[formControlName], ids-dropdown[formControl], ids-dropdown[formControlName],ids-dropdown[ngModel],ids-multiselect[formControlName], soho-dropdown[formControl], soho-dropdown[formControlName],soho-dropdown[ngModel]",
			        providers: [
			            {
			                provide: NG_VALUE_ACCESSOR,
			                useExisting: forwardRef(() => DemoValueAccessorDirective),
			                multi: true,
			            },
			        ],
			        standalone: true
			    })
			], DemoValueAccessorDirective);

			let AutocompleteInputComponent = class AutocompleteInputComponent extends WidgetBase {
			    constructor() {
			        super();
			        this.miUtil = inject(MiUtilService);
			        this.selected = new EventEmitter();
			    }
			    ngOnInit() {
			    }
			    ngAfterViewInit() {
			        this.setData();
			    }
			    async setData() {
			        const input = document.querySelector(`#AC${this.id}${this.instanceId}`);
			        this.ibcService.ibc$.subscribe((fields) => {
			            const data = Array.from(fields.keys()).map((key) => ({
			                id: key,
			                value: key,
			                label: key,
			            }));
			            input.data = data;
			        });
			        input.addEventListener("input", (event) => {
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
			                            input.data = resp?.map((item) => ({
			                                id: item.FILE,
			                                value: item.FILE,
			                                label: item.FILE,
			                            }));
			                        },
			                        error: (err) => {
			                        },
			                    });
			                }
			            }, 500);
			        });
			    }
			    onValueChange(event) {
			        this.value = event.target?.value;
			        this.selected.emit(this.value);
			    }
			    searchData(program) {
			        const parameters = {
			            PGNM: program,
			        };
			        return this.miUtil.execute("BOOKMKMI", "GetParByPgm", parameters, 30, "", true);
			    }
			};
			__decorate([
			    Input(),
			    __metadata("design:type", String)
			], AutocompleteInputComponent.prototype, "label", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Number)
			], AutocompleteInputComponent.prototype, "index", void 0);
			__decorate([
			    Output(),
			    __metadata("design:type", Object)
			], AutocompleteInputComponent.prototype, "selected", void 0);
			AutocompleteInputComponent = __decorate([
			    Component({
			        selector: "autocomplete-input",
			        standalone: true,
			        imports: [CommonModule],
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        template: "<ids-input\n\t[id]=\"'AC' + id + instanceId\"\n\t[label]=\"label || 'Search Fields'\"\n\t[value]=\"value\"\n\tautocomplete\n\tsearch-field=\"label\"\n\tclearable\n\t(change)=\"onValueChange($event)\">\n</ids-input>\n",
			    }),
			    __metadata("design:paramtypes", [])
			], AutocompleteInputComponent);

			var _a$5, _b$1;
			let CustomDropdownControlComponent = class CustomDropdownControlComponent {
			    constructor() {
			        this.label = "";
			        this.id = "";
			        this.name = "";
			        this.multiple = false;
			        this.showSearchUnderSelected = false;
			        this.reload = "";
			        this.required = false;
			        this.showTags = true;
			        this.moveSelected = "";
			        this.options = [];
			        this.removeable = false;
			        this.removeIndex = new EventEmitter();
			        this.onChange = (value) => { };
			        this.onTouched = () => { };
			        this.aTowns = [
			            { value: "WR", label: "Wrightstown" },
			            { value: "BM", label: "Bellmawr" },
			        ];
			        this.sourceAlpha = (response, searchTerm) => {
			            const responseValues = [];
			            const selectedValues = this.dropdownElement.nativeElement.querySelectorAll("option:checked");
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
			    }
			    onDropdownChange(event) {
			        this.onChange(this.model.value);
			        this.onTouched();
			    }
			    writeValue(value) {
			        this.model = {
			            value: value,
			        };
			    }
			    registerOnChange(fn) {
			        this.onChange = fn;
			    }
			    registerOnTouched(fn) {
			        this.onTouched = fn;
			    }
			    diffContains(containsArray, valueArray) {
			        let diffArray = [];
			        if (containsArray.length < 1) {
			            return valueArray;
			        }
			        diffArray = valueArray.filter((x) => !this.arrayContains(containsArray, x.value));
			        return diffArray;
			    }
			    arrayContains(array, value) {
			        return array.find((x) => x.value === value);
			    }
			};
			__decorate([
			    ViewChild(SohoDropDownComponent, { read: ElementRef }),
			    __metadata("design:type", typeof (_a$5 = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a$5 : Object)
			], CustomDropdownControlComponent.prototype, "dropdownElement", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "label", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "id", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "name", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "multiple", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "showSearchUnderSelected", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "reload", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "required", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "showTags", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "moveSelected", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Function)
			], CustomDropdownControlComponent.prototype, "source", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Array)
			], CustomDropdownControlComponent.prototype, "options", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", typeof (_b$1 = typeof AbstractControl !== "undefined" && AbstractControl) === "function" ? _b$1 : Object)
			], CustomDropdownControlComponent.prototype, "formControl", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "removeable", void 0);
			__decorate([
			    Output(),
			    __metadata("design:type", Object)
			], CustomDropdownControlComponent.prototype, "removeIndex", void 0);
			CustomDropdownControlComponent = __decorate([
			    Component({
			        selector: "custom-dropdown-control",
			        standalone: true,
			        imports: [CommonModule, SohoDropDownModule, ReactiveFormsModule, FormsModule],
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        template: "<div class=\"field\">\n\t<label soho-label [for]=\"id\" [class.required]=\"required\">{{ label }}</label>\n\t<select\n\t\tsoho-dropdown\n\t\t[id]=\"id\"\n\t\t[multiple]=\"multiple\"\n\t\t[showSearchUnderSelected]=\"showSearchUnderSelected\"\n\t\t[showTags]=\"showTags\"\n\t\treload=\"typeahead\"\n\t\tmoveSelected=\"all\"\n\t\t[showEmptyGroupHeaders]=\"true\"\n\t\t[(ngModel)]=\"model.value\"\n\t\tsoho-tooltip\n\t\t(change)=\"onDropdownChange($event)\">\n\t\t@for (option of options; track option.value) {\n\t\t\t<option\n\t\t\t\t[id]=\"option.label\"\n\t\t\t\tselected=\"{{ option.selected }}\"\n\t\t\t\t[value]=\"option.value\">\n\t\t\t\t{{ option.label }}\n\t\t\t</option>\n\t\t}\n\t</select>\n\t<ids-button\n\t\t[id]=\"'delete' + id\"\n\t\t*ngIf=\"removeable\"\n\t\ticon=\"delete\"\n\t\t(click)=\"removeIndex.emit()\"></ids-button>\n</div>\n",
			        providers: [
			            {
			                provide: NG_VALUE_ACCESSOR,
			                useExisting: forwardRef(() => CustomDropdownControlComponent),
			                multi: true,
			            },
			        ],
			    })
			], CustomDropdownControlComponent);

			let DropdownReactiveComponent = class DropdownReactiveComponent extends WidgetBase {
			    constructor() {
			        super(...arguments);
			        this.required = false;
			        this.size = "md";
			        this.USER_DROPDOWN_OPTIONS = USER_DROPDOWN_OPTIONS;
			        this.selectedValue = "";
			        this.disabled = false;
			        this.onChange = (value) => { };
			        this.onTouched = () => { };
			    }
			    ngOnInit() {
			    }
			    ngAfterViewInit() {
			        const element = document.querySelector(`#KV${this.id}${this.instanceId}`);
			        this.ibcService.ibc$.subscribe((fields) => {
			            const options = Array.from(fields.keys()).map((key) => ({
			                label: key,
			                value: key ?? "",
			                id: key,
			            }));
			            const headerOption = {
			                label: "Header",
			                value: "header",
			                groupLabel: true,
			                id: "header",
			            };
			            options.unshift(headerOption);
			            element.data = [...options, ...USER_DROPDOWN_OPTIONS];
			            setTimeout(() => {
			                element.value = element.value ?? this.value;
			            }, 10);
			        });
			    }
			    writeValue(value) {
			        this.value = value;
			        if (!this.id || !this.instanceId)
			            return;
			        setTimeout(() => {
			            const element = document?.querySelector(`#KV${this.id}${this.instanceId}`);
			            if (element) {
			                element.value = value;
			            }
			        }, 0);
			    }
			    registerOnChange(fn) {
			        this.onChange = fn || (() => { });
			    }
			    registerOnTouched(fn) {
			        this.onTouched = fn || (() => { });
			    }
			    setDisabledState(disabled) {
			        this.disabled = disabled;
			    }
			    onValueChange(event) {
			        this.value = event.target?.value;
			        this.onChange(this.value);
			        this.onTouched();
			    }
			};
			__decorate([
			    Input(),
			    __metadata("design:type", String)
			], DropdownReactiveComponent.prototype, "label", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], DropdownReactiveComponent.prototype, "required", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], DropdownReactiveComponent.prototype, "size", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Number)
			], DropdownReactiveComponent.prototype, "index", void 0);
			DropdownReactiveComponent = __decorate([
			    Component({
			        selector: "dropdown-reactive",
			        standalone: true,
			        imports: [CommonModule, FormsModule, DemoValueAccessorDirective],
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        template: "<div class=\"form-field\">\n\t<ids-dropdown\n\t\t[id]=\"'KV' + id + instanceId\"\n\t\t[isFormComponent]=\"true\"\n\t\t[label]=\"\n\t\t\tlabel\n\t\t\t\t? label\n\t\t\t\t: 'Key value ' +\n\t\t\t\t\t(index + 1) +\n\t\t\t\t\t' - KV' +\n\t\t\t\t\t(index + 1).toString().padStart(2, '0')\n\t\t\"\n\t\t[disabled]=\"disabled\"\n\t\t[(ngModel)]=\"value\"\n\t\tisMultiSelect=\"true\"\n\t\t[size]=\"size\"\n\t\t[class.required]=\"required\"\n\t\t(change)=\"onValueChange($event)\">\n\t\t<ids-list-box-option> </ids-list-box-option>\n\t</ids-dropdown>\n</div>\n",
			        providers: [
			            DemoValueAccessorDirective,
			            {
			                provide: NG_VALUE_ACCESSOR,
			                useExisting: DropdownReactiveComponent,
			                multi: true,
			            },
			        ],
			    })
			], DropdownReactiveComponent);

			let SearchFormComponent = class SearchFormComponent extends WidgetFormBase {
			    constructor() {
			        super();
			        this.miUtil = inject(MiUtilService);
			        this.searchResult = new EventEmitter();
			        this.subscriptions = new Subscription();
			    }
			    ngOnInit() {
			        this.form = this.formBuilder.group({
			            program: [""],
			            table: [""],
			        });
			        this.subscriptions.add(this.form.valueChanges.subscribe((value) => {
			        }));
			    }
			    onFormSubmit() {
			        this.searchData(this.form.value.program);
			    }
			    searchData(program) {
			        const parameters = {
			            PGNM: program,
			        };
			        this.setBusy(true);
			        this.subscriptions.add(this.miUtil
			            .execute("BOOKMKMI", "GetParByPgm", parameters, 1, "", true)
			            .subscribe({
			            next: (resp) => {
			                this.setBusy(false);
			                const massaged = this.massageSearchData(resp);
			                this.searchResult.emit(massaged);
			            },
			            error: (err) => {
			                this.setBusy(false);
			            },
			        }));
			    }
			    massageSearchData(responseData) {
			        const result = { ...responseData };
			        for (let i = 1; i <= 16; i++) {
			            const kfKey = `KF${i.toString().padStart(2, "0")}`;
			            const kvKey = `KV${i.toString().padStart(2, "0")}`;
			            if (responseData[kfKey] !== "") {
			                let value = responseData[kfKey];
			                if (typeof value === "string" && value.length === 6) {
			                    value = value.slice(2);
			                }
			                result[kvKey] = value;
			                delete result[kfKey];
			            }
			        }
			        return result;
			    }
			    ngOnDestroy() {
			        this.subscriptions.unsubscribe();
			    }
			};
			__decorate([
			    Output(),
			    __metadata("design:type", Object)
			], SearchFormComponent.prototype, "searchResult", void 0);
			SearchFormComponent = __decorate([
			    Component({
			        selector: "search-form",
			        standalone: true,
			        imports: [CommonModule, ReactiveFormsModule, DemoValueAccessorDirective],
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        template: "@if (form) {\n\t<form [formGroup]=\"form\" (ngSubmit)=\"handleFormSubmit()\">\n\t\t<fieldset>\n\t\t\t<legend>Search Table/ Key fields</legend>\n\t\t</fieldset>\n\n\t\t<div class=\"field-container\">\n\t\t\t<div class=\"form-field\">\n\t\t\t\t<ids-input\n\t\t\t\t\tformControlName=\"program\"\n\t\t\t\t\tlabel=\"Program\"\n\t\t\t\t\t(keydown.enter)=\"handleFormSubmit()\">\n\t\t\t\t</ids-input>\n\t\t\t</div>\n\n\t\t\t<div class=\"form-field\">\n\t\t\t\t<ids-input\n\t\t\t\t\tformControlName=\"table\"\n\t\t\t\t\tlabel=\"Table\"\n\t\t\t\t\t(keydown.enter)=\"handleFormSubmit()\">\n\t\t\t\t</ids-input>\n\t\t\t</div>\n\n\t\t\t<ids-button type=\"submit\" icon=\"search\" appearance=\"secondary\"\n\t\t\t\t><span>Search</span></ids-button\n\t\t\t>\n\t\t</div>\n\t</form>\n}\n",
			        styles: "form {\n\tdisplay: flex;\n\t/* gap: 20px; */\n\talign-items: center;\n\twidth: 100%;\n\tjustify-content: space-between;\n\talign-items: baseline;\n\tflex-direction: column;\n}\n\nids-input {\n\tflex: 1;\n\twidth: 100%;\n\tmax-width: 120px;\n}\n\nids-button {\n\tflex-shrink: 0;\n}\n\n.field-container {\n\tdisplay: flex;\n\t/* justify-content: space-between; */\n\t/* width: 300px; */\n\talign-items: baseline;\n\tcolumn-gap: 20px;\n}\n",
			    }),
			    __metadata("design:paramtypes", [])
			], SearchFormComponent);

			var _a$4, _b;
			let ConfigFormComponent = class ConfigFormComponent extends WidgetFormBase {
			    constructor(translatePipe) {
			        super();
			        this.translatePipe = translatePipe;
			        this.formValueChange = new EventEmitter();
			        this.fields$ = of([]);
			        this.model = {
			            value: ["AK"],
			            options: [
			                { value: "AK", label: "Alaska", selected: true },
			                { value: "CA", label: "California", selected: true },
			                { value: "Pa", label: "California", selected: false },
			            ],
			        };
			        this.keyFieldOptions = [];
			        this.sourceAlpha = (response, searchTerm) => {
			            response(this.model.options, true);
			        };
			    }
			    ngOnInit() {
			        this.fields$ = this.ibcService.ibc$.pipe(map((value) => {
			            return Array.from(value.keys()).map((key) => ({
			                label: key,
			                value: value.get(key) ?? "",
			            }));
			        }));
			        this.fieldList = this.ibcService.fieldListSubject.getValue();
			        this.fieldList = this.fieldList.map((item) => ({
			            value: item,
			            label: item,
			            selected: true,
			        }));
			        this.fieldList = [...USER_DROPDOWN_OPTIONS, ...this.fieldList];
			        this.fielList$ = this.ibcService.fieldList$.pipe(tap$1((value) => {
			            this.dropdownElement?.nativeElement.update();
			        }));
			    }
			    ngAfterViewInit() {
			        const settings = this.widgetContext.getSettings();
			        const form = this.formBuilder.group({
			            FILE: [settings.get("FILE", ""), [Validators.required]],
			            TFIL: [settings.get("TFIL", "")],
			            LNCD: [settings.get("LNCD", ""), [Validators.required]],
			            TXEI: [settings.get("TXEI", ""), [Validators.required]],
			            KFLD: [settings.get("KFLD", ""), [Validators.required]],
			            keyValues: this.createKeyValuesArray(settings),
			        });
			        form.valueChanges.subscribe((value) => {
			            const keyValues = this.revertKeyValuesArray(value.keyValues);
			            const merged = { ...value, ...keyValues };
			            delete merged.keyValues;
			            this.formValueChange.emit(merged);
			        });
			        this.form = form;
			        this.updateKeyFieldOptions();
			    }
			    onChange(event) {
			    }
			    removeIndex(index) {
			        this.keyValues.removeAt(index);
			        this.keyValues.markAsDirty();
			        this.keyValues.updateValueAndValidity();
			    }
			    patchForm(formData) {
			        const patchData = {};
			        if (formData.FILE !== undefined)
			            patchData.FILE = formData.FILE + "00";
			        if (formData.TFIL !== undefined)
			            patchData.TFIL = formData.TFIL || "MSYTXH";
			        if (formData.LNCD !== undefined)
			            patchData.LNCD = formData.LNCD;
			        if (formData.TXEI !== undefined)
			            patchData.TXEI = formData.TXEI;
			        patchData.KFLD = "";
			        const kvValues = [];
			        for (let i = 1; i <= 16; i++) {
			            const keyPattern = `KV${i.toString().padStart(2, "0")}`;
			            let value = formData[keyPattern];
			            if (value === "CONO" ||
			                value === "DIVI" ||
			                value === "FACI" ||
			                value === "WHLO") {
			                value = "USER-" + value;
			                kvValues.push(value);
			            }
			            else if (value !== undefined) {
			                kvValues.push(formData[keyPattern]);
			            }
			        }
			        const firstNonUserIndex = kvValues.findIndex((value) => !value.startsWith("USER-"));
			        if (firstNonUserIndex !== -1) {
			            const keyValue = `KV${(firstNonUserIndex + 1).toString().padStart(2, "0")}`;
			            patchData.KFLD = keyValue;
			        }
			        this.form.patchValue(patchData);
			        while (this.keyValues.length > kvValues.length) {
			            this.keyValues.removeAt(this.keyValues.length - 1);
			        }
			        kvValues.forEach((value, index) => {
			            if (index < this.keyValues.length) {
			                this.keyValues.at(index).setValue([value]);
			                this.keyValues.at(index).setValidators(Validators.required);
			                this.keyValues.at(index).updateValueAndValidity();
			            }
			            else {
			                this.keyValues.push(this.formBuilder.control([value], Validators.required));
			            }
			        });
			        this.updateKeyFieldOptions();
			    }
			    revertKeyValuesArray(keyValues) {
			        const kvObject = {};
			        for (let i = 1; i <= 16; i++) {
			            const keyPattern = `KV${i.toString().padStart(2, "0")}`;
			            const value = keyValues[i - 1];
			            kvObject[keyPattern] = value && value.length ? value : [];
			        }
			        return kvObject;
			    }
			    createKeyValuesArray(settings) {
			        const kvControls = [];
			        for (let i = 1; i <= 16; i++) {
			            const keyPattern = `KV${i.toString().padStart(2, "0")}`;
			            let value = [];
			            if (settings.get(keyPattern)) {
			                value = settings.get(keyPattern, []);
			            }
			            if (value.length || keyPattern === "KV01") {
			                kvControls.push(this.formBuilder.control(value, Validators.required));
			            }
			        }
			        return this.formBuilder.array(kvControls);
			    }
			    getKeyValueFieldByIndex(index) {
			        return ` (KV${index.toString().padStart(2, "0")})`;
			    }
			    getKeyValueLabel(index) {
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
			    get keyValues() {
			        return this.form?.get("keyValues");
			    }
			    addKeyValueControl() {
			        const newControl = this.formBuilder.control([], Validators.required);
			        this.keyValues.push(newControl);
			    }
			    dropdownMultiValueToString(stringList = "") {
			        return stringList
			            .split(",")
			            .map((item) => item.match(/'([^']+)'/)?.[1] || "")
			            .join(",");
			    }
			    onFieldSelected(value) {
			    }
			    onFormSubmit() {
			        this.getFormValue();
			    }
			};
			__decorate([
			    ViewChild(SohoDropDownComponent, { read: ElementRef }),
			    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
			], ConfigFormComponent.prototype, "dropdownElement", void 0);
			__decorate([
			    Output(),
			    __metadata("design:type", Object)
			], ConfigFormComponent.prototype, "formValueChange", void 0);
			ConfigFormComponent = __decorate([
			    Component({
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
			        template: "@if (form) {\n\t<div class=\"\">\n\t\t<search-form label=\"Search Fields\" (searchResult)=\"patchForm($event)\">\n\t\t</search-form>\n\t</div>\n\t<ids-separator></ids-separator>\n\t<form [formGroup]=\"form\" (ngSubmit)=\"handleFormSubmit()\">\n\t\t<!-- Autocomplete Search -->\n\t\t<!-- \t\t<div class=\"form-field\">\n\t\t\t<autocomplete-input\n\t\t\t\t[instanceId]=\"instanceId\"\n\t\t\t\t[index]=\"0\"\n\t\t\t\tsize=\"lg\"\n\t\t\t\tlabel=\"Search Fields\"\n\t\t\t\t(selected)=\"onFieldSelected($event)\">\n\t\t\t</autocomplete-input>\n\t\t</div> -->\n\n\t\t<div class=\"left-container\">\n\t\t\t<fieldset>\n\t\t\t\t<legend>Text Block Config</legend>\n\t\t\t\t<div class=\"two-field-row\">\n\t\t\t\t\t<!-- FILE field (required) -->\n\t\t\t\t\t<div class=\"width-140\">\n\t\t\t\t\t\t<ids-input\n\t\t\t\t\t\t\t[id]=\"'FILE' + instanceId\"\n\t\t\t\t\t\t\tformControlName=\"FILE\"\n\t\t\t\t\t\t\t[isFormComponent]=\"true\"\n\t\t\t\t\t\t\t[label]=\"('file' | t) + ' (FILE)'\"\n\t\t\t\t\t\t\trequired>\n\t\t\t\t\t\t</ids-input>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- TFIL field (optional) -->\n\t\t\t\t\t<div class=\"width-140\">\n\t\t\t\t\t\t<ids-input\n\t\t\t\t\t\t\tformControlName=\"TFIL\"\n\t\t\t\t\t\t\t[label]=\"('transferFile' | t) + ' (TFIL)'\">\n\t\t\t\t\t\t</ids-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</fieldset>\n\n\t\t\t<!-- LNCD field (optional) -->\n\t\t\t<!-- \t\t<div class=\"form-field\">\n\t\t\t<ids-input\n\t\t\t\tformControlName=\"LNCD\"\n\t\t\t\t[label]=\"'language' | t + 'LNCD'\"\n\t\t\t\trequired\n\t\t\t\taria-label=\"LNCD field\">\n\t\t\t</ids-input>\n\t\t</div> -->\n\n\t\t\t<!-- TXEI field (optional) -->\n\t\t\t<!-- \t\t<div class=\"form-field\">\n\t\t\t<ids-input\n\t\t\t\tformControlName=\"TXEI\"\n\t\t\t\tlabel=\"External/internal text - TXEI\"\n\t\t\t\trequired\n\t\t\t\taria-label=\"TXEI field\">\n\t\t\t</ids-input>\n\t\t</div> -->\n\n\t\t\t<!-- KFLD field (optional) -->\n\n\t\t\t<!-- \t\t<dropdown-reactive\n\t\t\t\t[id]=\"'dr' + instanceId + 'KFLD'\"\n\t\t\t\tformControlName=\"KFLD\"\n\t\t\t\t[instanceId]=\"instanceId\"\n\t\t\t\t[label]=\"('fileKey' | t) + ' - KFLD'\"\n\t\t\t\t[required]=\"true\"\n\t\t\t\t[index]=\"-2\">\n\t\t\t</dropdown-reactive> -->\n\t\t\t<!-- \n\t\t\t<div class=\"field\">\n\t\t\t\t<label [for]=\"'id'\" class=\"label\">Test</label>\n\t\t\t\t<select\n\t\t\t\t\tsoho-dropdown\n\t\t\t\t\t[name]=\"'KFLD'\"\n\t\t\t\t\t[id]=\"'KFLD'\"\n\t\t\t\t\tformControlName=\"KFLD\"\n\t\t\t\t\t[showSearchUnderSelected]=\"true\"\n\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t[showTags]=\"true\"\n\t\t\t\t\t[closeOnSelect]=\"false\"\n\t\t\t\t\treload=\"typeahead\"\n\t\t\t\t\tmoveSelected=\"all\"\n\t\t\t\t\t[source]=\"sourceAlpha\"\n\t\t\t\t\tsoho-tooltip>\n\t\t\t\t\t@for (field of fieldList; track $index) {\n\t\t\t\t\t\t<option [id]=\"$index\" [ngValue]=\"field.value\">\n\t\t\t\t\t\t\t{{ field.value }}\n\t\t\t\t\t\t</option>\n\t\t\t\t\t}\n\t\t\t\t</select>\n\t\t\t</div> -->\n\t\t\t<ids-dropdown\n\t\t\t\t[id]=\"'KFLD' + instanceId\"\n\t\t\t\t[label]=\"('keyField' | t) + ' (KFLD)'\"\n\t\t\t\tformControlName=\"KFLD\"\n\t\t\t\t[required]=\"true\">\n\t\t\t\t<ids-list-box>\n\t\t\t\t\t@for (option of keyFieldOptions; track option.value) {\n\t\t\t\t\t\t<ids-list-box-option [value]=\"option.value\" [id]=\"option.value\">\n\t\t\t\t\t\t\t<span>{{ getKeyValueLabel($index) }}</span>\n\t\t\t\t\t\t</ids-list-box-option>\n\t\t\t\t\t}\n\t\t\t\t</ids-list-box>\n\t\t\t</ids-dropdown>\n\n\t\t\t<!-- \t\t<custom-dropdown-control\n\t\t\t\t[label]=\"('fileKey' | t) + ' (KFLD)'\"\n\t\t\t\t[id]=\"'KFLD' + instanceId\"\n\t\t\t\t[name]=\"'KFLD' + instanceId\"\n\t\t\t\t[multiple]=\"false\"\n\t\t\t\t[showSearchUnderSelected]=\"false\"\n\t\t\t\t[showTags]=\"false\"\n\t\t\t\treload=\"typeahead\"\n\t\t\t\tmoveSelected=\"all\"\n\t\t\t\t[required]=\"true\"\n\t\t\t\t[options]=\"keyFieldOptions\"\n\t\t\t\tformControlName=\"KFLD\">\n\t\t\t</custom-dropdown-control> -->\n\t\t</div>\n\n\t\t<div class=\"right-container\">\n\t\t\t<!-- Key Values FormArray section -->\n\t\t\t<fieldset>\n\t\t\t\t<legend>Table key fields</legend>\n\t\t\t\t<div\n\t\t\t\t\tclass=\"key-value-section\"\n\t\t\t\t\t*ngIf=\"keyValues?.controls?.length\"\n\t\t\t\t\tformArrayName=\"keyValues\">\n\t\t\t\t\t<div class=\"key-value-grid\">\n\t\t\t\t\t\t@for (control of keyValues.controls; track control) {\n\t\t\t\t\t\t\t<custom-dropdown-control\n\t\t\t\t\t\t\t\t[label]=\"getKeyValueLabel($index)\"\n\t\t\t\t\t\t\t\t[id]=\"'dr' + $index + instanceId\"\n\t\t\t\t\t\t\t\t[multiple]=\"true\"\n\t\t\t\t\t\t\t\t[showSearchUnderSelected]=\"true\"\n\t\t\t\t\t\t\t\treload=\"typeahead\"\n\t\t\t\t\t\t\t\tmoveSelected=\"all\"\n\t\t\t\t\t\t\t\t[options]=\"fieldList\"\n\t\t\t\t\t\t\t\t[formControlName]=\"$index.toString()\"\n\t\t\t\t\t\t\t\t[required]=\"true\"\n\t\t\t\t\t\t\t\t[removeable]=\"$index !== 0\"\n\t\t\t\t\t\t\t\t(removeIndex)=\"removeIndex($index)\">\n\t\t\t\t\t\t\t</custom-dropdown-control>\n\n\t\t\t\t\t\t\t<!-- \t<dropdown-reactive\n\t\t\t\t\t\t\t[id]=\"'dr' + $index + instanceId\"\n\t\t\t\t\t\t\t[formControlName]=\"$index\"\n\t\t\t\t\t\t\t[index]=\"$index\">\n\t\t\t\t\t\t</dropdown-reactive> -->\n\t\t\t\t\t\t}\n\t\t\t\t\t\t<div class=\"\">\n\t\t\t\t\t\t\t<ids-button\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tappearance=\"tertiary\"\n\t\t\t\t\t\t\t\ticon=\"add\"\n\t\t\t\t\t\t\t\t(click)=\"addKeyValueControl()\"\n\t\t\t\t\t\t\t\t><span>\n\t\t\t\t\t\t\t\t\t{{ \"keyValue\" | t }} {{ keyValues.controls.length + 1 }}</span\n\t\t\t\t\t\t\t\t></ids-button\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</fieldset>\n\t\t</div>\n\n\t\t<!-- Additional Key Value fields -->\n\t\t<!-- \t<div class=\"key-value-section\" formGroupName=\"keyValue\">\n\t\t\t\t<div class=\"key-value-grid\">\n\t\t\t\t\t<div class=\"form-field\">\n\t\t\t\t\t\t<ids-input\n\t\t\t\t\t\t\tformControlName=\"FLDI\"\n\t\t\t\t\t\t\tlabel=\"FLDI\"\n\t\t\t\t\t\t\taria-label=\"FLDI field\"></ids-input>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"form-field\">\n\t\t\t\t\t\t<ids-input\n\t\t\t\t\t\t\tformControlName=\"KFLD\"\n\t\t\t\t\t\t\tlabel=\"KFLD\"\n\t\t\t\t\t\t\taria-label=\"KFLD field\"></ids-input>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div> -->\n\n\t\t<!-- Form actions -->\n\t\t<!-- \t\t<div class=\"form-actions\">\n\t\t\t<ids-button type=\"submit\" appearance=\"primary\">Submit</ids-button>\n\t\t\t<ids-button type=\"button\" (click)=\"resetForm()\">Reset</ids-button>\n\t\t</div> -->\n\t</form>\n}\n",
			        styles: "form {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\t/* align-items: center; */\n\tcolumn-gap: 20px;\n\t/* width: 300px; */\n\tjustify-content: flex-start;\n\tmax-height: 100%;\n}\n.form-field {\n\tmargin-bottom: 16px;\n}\n\n.width-140 {\n\twidth: 140px;\n}\n\n.two-field-row {\n\twidth: 300px;\n\tdisplay: flex;\n\tjustify-content: space-between;\n}\n\n.key-value-section {\n\t/* \tmargin-top: 24px;\n\tpadding: 16px;\n\tborder: 1px solid var(--ids-color-border-default);\n\tborder-radius: 4px; */\n}\n\n.key-value-section h3 {\n\tmargin: 0 0 16px 0;\n\tcolor: var(--ids-color-text-default);\n\tfont-size: var(--ids-font-size-lg);\n}\n\n.key-value-grid {\n\t/* \tdisplay: grid;\n\tgrid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); */\n\t/* grid-template-columns: repeat(2, */\n}\n.form-actions {\n\tmargin-top: 24px;\n\tdisplay: flex;\n\tgap: 12px;\n\tjustify-content: flex-end;\n}\n\n/* Responsive design */\n@media (max-width: 768px) {\n\t.key-value-grid {\n\t\tgrid-template-columns: 1fr;\n\t}\n\n\t.form-actions {\n\t\tjustify-content: stretch;\n\t}\n\n\t.form-actions ids-button {\n\t\tflex: 1;\n\t}\n}\n",
			    }),
			    __metadata("design:paramtypes", [typeof (_a$4 = typeof TranslatePipe !== "undefined" && TranslatePipe) === "function" ? _a$4 : Object])
			], ConfigFormComponent);

			var _a$3;
			let TitleSettingComponent = class TitleSettingComponent {
			    #instance = inject(IWidgetSettingsInstance);
			    get lockIcon() {
			        return this.isTitleLocked ? "locked" : "unlocked";
			    }
			    ngOnInit() {
			        const widgetContext = this.widgetSettingsContext.getWidgetContext();
			        this.isTitleEditEnabled = widgetContext.isTitleEditEnabled();
			        this.isTitleLocked = widgetContext.isTitleLocked();
			        this.title = widgetContext.getResolvedTitle(this.isTitleLocked);
			        this.isTitleUnlockable = widgetContext.isTitleUnlockable();
			        const currentClosingHandler = this.#instance.closing;
			        this.#instance.closing = ({ isSave }) => {
			            currentClosingHandler?.({ isSave });
			            if (isSave) {
			                this.save();
			            }
			        };
			    }
			    save() {
			        const widgetContext = this.widgetSettingsContext.getWidgetContext();
			        widgetContext.setTitleLocked(this.isTitleLocked);
			        if (this.isTitleEditEnabled) {
			            widgetContext.setTitle(this.title);
			        }
			    }
			    onLockClicked() {
			        this.isTitleLocked = !this.isTitleLocked;
			        if (this.isTitleLocked) {
			            this.title = this.widgetSettingsContext
			                .getWidgetContext()
			                .getStandardTitle();
			        }
			    }
			};
			__decorate([
			    Input(),
			    __metadata("design:type", typeof (_a$3 = typeof IWidgetSettingsContext !== "undefined" && IWidgetSettingsContext) === "function" ? _a$3 : Object)
			], TitleSettingComponent.prototype, "widgetSettingsContext", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", String)
			], TitleSettingComponent.prototype, "label", void 0);
			TitleSettingComponent = __decorate([
			    Component({
			        selector: "infor-sample-setting-title-field",
			        template: `
		<div class="field">
			@if (label) {
				<label>{{ label }}</label>
			}
			<input
				[readOnly]="!isTitleEditEnabled || isTitleLocked"
				[(ngModel)]="title" />
			<button
				soho-button="icon"
				[icon]="lockIcon"
				[disabled]="!isTitleUnlockable"
				(click)="onLockClicked()"></button>
		</div>
	`,
			        standalone: true,
			        imports: [ReactiveFormsModule, FormsModule, SohoButtonModule],
			    })
			], TitleSettingComponent);

			let SettingsServiceService = class SettingsServiceService {
			    #miUtil = inject(MiUtilService);
			    constructor() { }
			    getMiData() {
			        return forkJoin({
			            languages: this.getLanguages(),
			        });
			    }
			    getLanguages() {
			        return this.#miUtil
			            .execute("MNS105MI", "LstLng", { LANC: "0" })
			            .pipe(map((response) => this.dropdownData(response, "TX40", "LANC")));
			    }
			    dropdownData(response = [], labelField, valueField) {
			        return response.map((record) => ({
			            label: record[labelField],
			            value: record[valueField],
			        }));
			    }
			};
			SettingsServiceService = __decorate([
			    Injectable(),
			    __metadata("design:paramtypes", [])
			], SettingsServiceService);

			var _a$2;
			let SettingsComponent = class SettingsComponent {
			    #context;
			    #instance;
			    #data;
			    constructor() {
			        this.subscriptions = new Subscription();
			        this.#context = inject(IWidgetContext);
			        this.instanceId = "";
			        this.titleLocked = false;
			        this.#instance = inject(IWidgetSettingsInstance);
			        this.#data = inject(SettingsServiceService);
			        this.languageList = signal([]);
			        this.instanceId = this.#context.getWidgetInstanceId();
			        this.#instance.closing = ({ isSave }) => {
			            if (isSave) {
			                this.#save();
			            }
			        };
			    }
			    configFormChanged(value) {
			        this.configFormValue = value;
			    }
			    ngOnInit() {
			        const settings = this.#context.getSettings();
			        settings.getMetadata();
			    }
			    ngAfterViewInit() {
			        const settings = this.#context.getSettings();
			        this.$textBlockLanguage = document.querySelector(`#textBlockLanguage${this.instanceId}`);
			        this.$editEnabled = document.querySelector(`#editEnabled${this.instanceId}`);
			        this.$deleteEnabled = document.querySelector(`#deleteEnabled${this.instanceId}`);
			        const editModeSettings = settings.get("editEnabled", false);
			        const deleteModeSettings = settings.get("deleteEnabled", false);
			        this.$editEnabled.checked = editModeSettings;
			        this.$deleteEnabled.checked = deleteModeSettings;
			        this.getMiData();
			    }
			    ngOnDestroy() {
			        this.subscriptions.unsubscribe();
			    }
			    set isBusy(busy) {
			        this.#context.setState(busy ? WidgetState.busy : WidgetState.running);
			    }
			    getMiData() {
			        this.isBusy = true;
			        const sub = this.#data.getMiData().subscribe({
			            next: (response) => {
			                this.isBusy = false;
			                const languages = response.languages;
			                languages.unshift({
			                    label: "User language",
			                    value: "user",
			                    icon: "user-profile",
			                });
			                this.$textBlockLanguage.data = languages;
			                const settings = this.#context.getSettings();
			                this.$textBlockLanguage.value = settings.get("textBlockLanguage", "");
			            },
			            error: (error) => {
			                this.isBusy = false;
			            },
			        });
			        this.subscriptions.add(sub);
			    }
			    onLock() {
			        this.titleLocked = !this.titleLocked;
			        this.$title.disabled = this.titleLocked;
			        if (this.titleLocked) {
			            this.$title.value = this.#context.getStandardTitle();
			        }
			    }
			    #save() {
			        const settings = this.#context.getSettings();
			        settings.set("textBlockLanguage", this.$textBlockLanguage.value ?? "");
			        settings.set("autoMode", this.$autoMode?.checked ?? false);
			        settings.set("editEnabled", this.$editEnabled.checked ?? false);
			        settings.set("deleteEnabled", this.$deleteEnabled.checked ?? false);
			        if (this.configFormValue) {
			            Object.keys(this.configFormValue).forEach((key) => {
			                settings.set(key, this.configFormValue[key]);
			            });
			        }
			    }
			};
			__decorate([
			    Input(),
			    __metadata("design:type", typeof (_a$2 = typeof IWidgetSettingsContext !== "undefined" && IWidgetSettingsContext) === "function" ? _a$2 : Object)
			], SettingsComponent.prototype, "widgetSettingsContext1", void 0);
			SettingsComponent = __decorate([
			    Component({
			        template: "@if (instanceId) {\r\n\t<ids-layout-flex direction=\"column\" column-gap=\"20\" class=\"ids-full-height\">\r\n\t\t<ids-layout-flex direction=\"row\" column-gap=\"20\">\r\n\t\t\t<ids-layout-flex\r\n\t\t\t\tdirection=\"column\"\r\n\t\t\t\talign-items=\"baseline\"\r\n\t\t\t\tstyle=\"width: 350px\"\r\n\t\t\t\tclass=\"ids-full-height lm-input\">\r\n\t\t\t\t<infor-sample-setting-title-field\r\n\t\t\t\t\t[widgetSettingsContext]=\"widgetSettingsContext\"\r\n\t\t\t\t\tlabel=\"Title\">\r\n\t\t\t\t</infor-sample-setting-title-field>\r\n\r\n\t\t\t\t<ids-dropdown\r\n\t\t\t\t\t[id]=\"'textBlockLanguage' + instanceId\"\r\n\t\t\t\t\t[allowBlank]=\"true\"\r\n\t\t\t\t\tlabel=\"Text Block Language\"\r\n\t\t\t\t\tdisabled=\"false\"\r\n\t\t\t\t\tclass=\"\">\r\n\t\t\t\t\t<ids-list-box>\r\n\t\t\t\t\t\t<ids-list-box-option\r\n\t\t\t\t\t\t\tvalue=\"\"\r\n\t\t\t\t\t\t\t[id]=\"instanceId + 'blank'\"></ids-list-box-option>\r\n\t\t\t\t\t</ids-list-box>\r\n\t\t\t\t</ids-dropdown>\r\n\t\t\t</ids-layout-flex>\r\n\r\n\t\t\t<ids-layout-flex direction=\"column\" justify-content=\"center\">\r\n\t\t\t\t<!-- <div class=\"checkboc-container\"> -->\r\n\t\t\t\t<!-- \t\t\t\t<ids-checkbox\r\n\t\t\t\t\t[id]=\"'autoMode' + instanceId\"\r\n\t\t\t\t\tlabel=\"Auto mode\"\r\n\t\t\t\t\ttitle=\"\"\r\n\t\t\t\t\thitbox=\"true\"></ids-checkbox> -->\r\n\t\t\t\t<ids-checkbox\r\n\t\t\t\t\t[id]=\"'editEnabled' + instanceId\"\r\n\t\t\t\t\tlabel=\"Edit enabled\"\r\n\t\t\t\t\ttitle=\"\"\r\n\t\t\t\t\thitbox=\"true\"></ids-checkbox>\r\n\t\t\t\t<ids-checkbox\r\n\t\t\t\t\t[id]=\"'deleteEnabled' + instanceId\"\r\n\t\t\t\t\tlabel=\"Delete enabled\"\r\n\t\t\t\t\ttitle=\"\"\r\n\t\t\t\t\thitbox=\"true\"></ids-checkbox>\r\n\t\t\t\t<!-- </div> -->\r\n\t\t\t</ids-layout-flex>\r\n\t\t</ids-layout-flex>\r\n\t\t<ids-separator></ids-separator>\r\n\t\t<ids-layout-flex direction=\"row\">\r\n\t\t\t<app-config-form\r\n\t\t\t\t(formValueChange)=\"configFormChanged($event)\"></app-config-form>\r\n\t\t</ids-layout-flex>\r\n\t</ids-layout-flex>\r\n}\r\n",
			        styles: ".checkboc-container {\r\n\tdisplay: flex;\r\n}\r\n",
			        standalone: true,
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        imports: [TitleSettingComponent, ConfigFormComponent],
			        providers: [SettingsServiceService],
			    }),
			    __metadata("design:paramtypes", [])
			], SettingsComponent);

			let TextBlockService = class TextBlockService {
			    constructor() {
			        this.widgetContext = inject(widgetContextInjectionToken);
			        this.miUtilS = inject(MiUtilService);
			        this.userService = inject(UserService);
			        this.#contextService = inject(BusinessContextService);
			        this._TXID = "";
			        this._activeTFIL = "";
			        this.TFIL_VALUES = ["CSYTXH", "FSYTXH", "MSYTXH", "OSYTXH", "SSYTXH"];
			    }
			    #contextService;
			    get TXID() {
			        return this._TXID;
			    }
			    set TXID(value) {
			        this._TXID = value;
			    }
			    get activeTFIL() {
			        return this._activeTFIL;
			    }
			    set activeTFIL(value) {
			        this._activeTFIL = value;
			    }
			    getAllTextblocks(ibcData) {
			        return this.getTextBlock(this.buildKeyParams(ibcData));
			    }
			    findActiveTfil(parameters) {
			        const tfilValues = parameters.TFIL ? [parameters.TFIL] : this.TFIL_VALUES;
			        return forkJoin(tfilValues.map((value) => this.lstTxtBlocks({ ...parameters, TFIL: value }).pipe(map((data) => ({ TFIL: value, data }))))).pipe(map((results) => results.find((result) => result.data?.length > 0) || {
			            TFIL: "",
			            data: null,
			        }));
			    }
			    getTextBlock(params) {
			        return this.getTextId(params).pipe(concatMap((resp) => {
			            const TXID = resp["TXID"] ?? "";
			            this.TXID = TXID;
			            if (!TXID || TXID === "0") {
			                return of(null);
			            }
			            return this.findActiveTfil({ ...params, TXID }).pipe(concatMap((result) => {
			                if (!result.data?.length)
			                    return of([]);
			                this.activeTFIL = result.TFIL;
			                const updatedParams = { ...params, TFIL: result.TFIL };
			                return forkJoin(result.data.map((tb) => this.selectTextBlock(TXID, { ...updatedParams, ...tb })));
			            }));
			        }), concatMap((resp) => {
			            const filtered = resp?.filter((tb) => tb.textLines.length !== 0);
			            return of(filtered);
			        }));
			    }
			    saveTextblock(textBlockValues, existingVersion) {
			        const params = this.buildKeyParams(this.#contextService.valueMap);
			        const merged = {
			            ...params,
			            ...textBlockValues,
			            TFIL: textBlockValues.TFIL || this.activeTFIL || params.TFIL,
			        };
			        return this.solveTextId(merged).pipe(switchMap(() => textBlockValues.TXVR === existingVersion
			            ? this.updateExistingTextBlockVersion(merged, existingVersion)
			            : this.createNewTextBlockVersion(merged).pipe(switchMap((response) => {
			                return existingVersion
			                    ? this.dltTextBlockLines(merged, existingVersion)
			                    : of(response);
			            }))), catchError$1((e) => {
			            return throwError(() => e);
			        }), delay(500));
			    }
			    updateExistingTextBlockVersion(textBlock, textBlockId) {
			        return this.dltTextBlockLines(textBlock, textBlockId).pipe(switchMap(() => this.createNewTextBlockVersion(textBlock)));
			    }
			    getTextBlockLanguage(user) {
			        const languageSetting = this.widgetContext
			            .getSettings()
			            .get("textBlockLanguage", "");
			        return languageSetting === "user"
			            ? user.LANC
			            : languageSetting === "blank"
			                ? ""
			                : languageSetting;
			    }
			    createNewTextBlockVersion(textValues) {
			        const params = {
			            FILE: textValues.FILE,
			            TXID: textValues.TXID ?? this.TXID,
			            TXVR: textValues["TXVR"],
			            KFLD: textValues?.KFLD ?? "",
			            USID: this.userService.user.USID,
			            TFIL: textValues.TFIL,
			            CONO: this.userService.user.CONO,
			            LNCD: textValues.LNCD ?? "",
			            TX40: textValues["TX40"],
			        };
			        return this.addTextBlockHead(params).pipe(switchMap(() => {
			            const textBlockLines = this.formatTextblockLines(textValues["text"]);
			            return this.addTextBlockLines(params, textBlockLines);
			        }));
			    }
			    getTextId(params) {
			        const parameters = {
			            FILE: params.FILE,
			            KV01: params.KV01 ?? "",
			            KV02: params.KV02 ?? "",
			            KV03: params.KV03 ?? "",
			            KV04: params.KV04 ?? "",
			        };
			        return this.miUtilS.execute("CRS980MI", "GetTextID", parameters, 1, "", true);
			    }
			    lstTxtBlocks(parameters) {
			        return this.miUtilS.execute("CRS980MI", "LstTxtBlocks", parameters, 0, "TXVR,TX40,TXEI", true);
			    }
			    selectTextBlock(TXID, textBlock) {
			        const parameters = {
			            TXID: TXID,
			            FILE: textBlock.FILE ?? "",
			            TFIL: textBlock.TFIL ?? "",
			            TXVR: textBlock.TXVR,
			            LNCD: textBlock.LNCD ?? "",
			        };
			        return this.miUtilS
			            .execute("CRS980MI", "SltTxtBlock", parameters, 0, "", true)
			            .pipe(concatMap((resp) => {
			            return of(resp
			                ? {
			                    ...textBlock,
			                    textLines: resp,
			                    text: this.textBlockLinesToText(resp),
			                    TXID: TXID,
			                }
			                : null);
			        }));
			    }
			    addTextBlockLines(params, textBlockLines) {
			        return from(textBlockLines).pipe(mergeMap((text, index) => this.addTextBlockLine(params, text, index + 1), 1), toArray(), catchError$1((error) => {
			            return throwError(() => error);
			        }));
			    }
			    addTextBlockLine(params, TX60, LINO) {
			        const parameters = {
			            FILE: params.FILE ?? "",
			            TFIL: params.TFIL ?? "",
			            TX60,
			            CONO: this.userService.user.CONO,
			            TXID: this.TXID,
			            LINO,
			            LNCD: params.LNCD ?? "",
			            TXVR: params.TXVR ?? "",
			        };
			        return this.miUtilS.execute("CRS980MI", "AddTxtBlockLine", parameters, 1);
			    }
			    solveTextId(textblockKeys) {
			        if (!this.TXID || this.TXID === "0") {
			            return this.rtvNewTextID(textblockKeys).pipe(switchMap((resp) => {
			                if (!resp["TXID"])
			                    return throwError(() => new Error("No TXID found"));
			                this.TXID = resp["TXID"];
			                return this.setTextId(new Map(Object.entries(textblockKeys)));
			            }));
			        }
			        else {
			            return of(this.TXID);
			        }
			    }
			    deleteTextBlockById(textBlock) {
			        return this.dltTextBlockLines(textBlock);
			    }
			    dltTextBlockLines(params, textBlockId) {
			        const parameters = {
			            FILE: params.FILE ?? "",
			            TFIL: params.TFIL ?? "",
			            CONO: this.userService.user.CONO,
			            TXID: params.TXID ?? this.TXID,
			            TXVR: textBlockId ?? params.TXVR,
			            LNCD: params?.LNCD ?? "",
			        };
			        return this.miUtilS.execute("CRS980MI", "DltTxtBlockLins", parameters, 1);
			    }
			    rtvNewTextID(params) {
			        const { LNCD } = params;
			        const parameters = {
			            FILE: params.TFIL ?? "",
			            CONO: this.userService.user.CONO,
			        };
			        if (LNCD) {
			            parameters["LNCD"] = LNCD;
			        }
			        return this.miUtilS.execute("CRS980MI", "RtvNewTextID", parameters, 1);
			    }
			    addTextBlockHead(params) {
			        const parameters = {
			            ...params,
			            TX40: params["TX40"]?.substring(0, 40) ?? "",
			            TXID: this.TXID,
			        };
			        return this.miUtilS.execute("CRS980MI", "AddTxtBlockHead", parameters, 1, "", false);
			    }
			    buildKeyParams(ibcData) {
			        const user = this.userService.user;
			        const settings = this.widgetContext.getSettings();
			        const mapping = {
			            KV01: ibcData.get("KV01") ?? "",
			            KV02: ibcData.get("KV02") ?? "",
			            KV03: ibcData.get("KV03") ?? "",
			            KV04: ibcData.get("KV04") ?? "",
			            KV05: ibcData.get("KV05") ?? "",
			            KV06: ibcData.get("KV06") ?? "",
			            KV07: ibcData.get("KV07") ?? "",
			            KV08: ibcData.get("KV08") ?? "",
			            KV09: ibcData.get("KV09") ?? "",
			            KV10: ibcData.get("KV10") ?? "",
			            KV11: ibcData.get("KV11") ?? "",
			            KFLD: ibcData.get("KFLD") ?? "",
			        };
			        const LNCD = this.getTextBlockLanguage(user);
			        return {
			            FILE: settings.get("autoMode")
			                ? (ibcData.get("FILE") ?? "")
			                : settings.get("FILE", ""),
			            TFIL: settings.get("TFIL"),
			            TXID: this.TXID ?? "",
			            LNCD,
			            ...mapping,
			        };
			    }
			    setTextId(ibcData) {
			        const parameters = {
			            ...this.buildKeyParams(ibcData),
			        };
			        return this.miUtilS.execute("CRS980MI", "SetTextID", parameters, 1).pipe(map((resp) => {
			            return this.TXID;
			        }), catchError$1((err) => {
			            return throwError(() => err);
			        }));
			    }
			    getValue(nameValues, name) {
			        const nameValueWithMatchingName = nameValues.find((nameValue) => nameValue.Name === name);
			        if (nameValueWithMatchingName && nameValueWithMatchingName.Value) {
			            return nameValueWithMatchingName.Value.trim();
			        }
			        else {
			            return "";
			        }
			    }
			    formatTextblockLines(text) {
			        const newTextBlock = [];
			        const words = [];
			        let newText = "";
			        let curPhrase = "";
			        for (const letter of text) {
			            curPhrase += letter;
			            if (TEXTBLOCK_SEPARATORS.includes(letter) || curPhrase.length >= 60) {
			                words.push(curPhrase);
			                curPhrase = "";
			            }
			        }
			        if (curPhrase.length > 0) {
			            words.push(curPhrase);
			        }
			        for (let i = 0; i < words.length; i++) {
			            const word = words[i];
			            if ((newText + word).length >= 60) {
			                newTextBlock.push(newText);
			                newText = "";
			            }
			            if (word.split("\n").length >= 2) {
			                const newRowWords = word.split("\n");
			                newText += newRowWords.shift();
			                newTextBlock.push(newText);
			                newText = "";
			                for (let j = 0; j < newRowWords.length; j++) {
			                    const newRowWord = newRowWords[j];
			                    if (j + 1 < newRowWords.length) {
			                        newTextBlock.push(newRowWord);
			                    }
			                    else {
			                        newText += newRowWord;
			                    }
			                }
			            }
			            else {
			                newText += word;
			            }
			            if (i + 1 === words.length) {
			                newTextBlock.push(newText);
			            }
			        }
			        return newTextBlock;
			    }
			    textBlockLinesToText(textBlockLines) {
			        if (!textBlockLines?.length)
			            return "";
			        textBlockLines.forEach((line) => {
			            if (line.TX60 === "") {
			                line.TX60 = "<br><br>";
			            }
			        });
			        const lineStringList = textBlockLines.map((line) => line.TX60);
			        const text = lineStringList.join(" ");
			        return text;
			    }
			};
			TextBlockService = __decorate([
			    Injectable({
			        providedIn: "root",
			    })
			], TextBlockService);

			var _a$1;
			let NewTextblockComponent = class NewTextblockComponent extends WidgetBase {
			    #textBlockService;
			    #fb;
			    constructor() {
			        super();
			        this.text = "";
			        this.textVersion = {};
			        this.completed = new EventEmitter();
			        this.#textBlockService = inject(TextBlockService);
			        this.#fb = inject(FormBuilder);
			        this.textValue = "";
			    }
			    ngOnInit() {
			        this.form = this.createForm();
			        this.form.valueChanges.subscribe((value) => {
			        });
			    }
			    createForm() {
			        const formConfig = {
			            TXVR: [this.textVersion?.TXVR ?? ""],
			            TX40: [this.textVersion?.TX40 ?? "", Validators.required],
			            text: [this.textVersion?.text ?? "", Validators.required],
			        };
			        return this.#fb.group(formConfig);
			    }
			    onSaveText(textBlockValues) {
			        this.setBusy(true);
			        this.#textBlockService
			            .saveTextblock(textBlockValues, this.textVersion?.TXVR)
			            .subscribe({
			            next: (resp) => {
			                this.setBusy(false);
			                const result = textBlockValues.TXID || textBlockValues.TXVR || null;
			                if (resp.length) {
			                    this.showToast({
			                        title: "Success",
			                        message: `Text "${result}" saved`,
			                    });
			                }
			                this.completed.emit(result);
			            },
			            error: (err) => {
			                const message = err.message ?? "Error";
			                this.showWidgetMessage(message, WidgetMessageType$1.Error);
			                this.setBusy(false);
			            },
			        });
			    }
			    onChange(event) {
			        const value = event?.target?.value || event?.detail?.value;
			        this.form.patchValue({ text: value });
			    }
			    onSubmit() {
			        if (this.form.valid) {
			            this.onSaveText(this.form.value);
			        }
			    }
			    get isEditMode() {
			        return Object.keys(this.textVersion).length !== 0;
			    }
			    get submitButtonText() {
			        return this.isEditMode ? "update" : "add";
			    }
			};
			__decorate([
			    Input(),
			    __metadata("design:type", String)
			], NewTextblockComponent.prototype, "text", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", typeof (_a$1 = typeof Map !== "undefined" && Map) === "function" ? _a$1 : Object)
			], NewTextblockComponent.prototype, "contextMap", void 0);
			__decorate([
			    Input(),
			    __metadata("design:type", Object)
			], NewTextblockComponent.prototype, "textVersion", void 0);
			__decorate([
			    Output(),
			    __metadata("design:type", Object)
			], NewTextblockComponent.prototype, "completed", void 0);
			NewTextblockComponent = __decorate([
			    Component({
			        selector: "new-textblock",
			        template: "<form\n\t[id]=\"'test-result-form-' + instanceId\"\n\t[formGroup]=\"form\"\n\tstyle=\"display: flex; flex-direction: column; height: 100%\">\n\t<div\n\t\tclass=\"lm-padding-lg-l lm-padding-lg-r\"\n\t\tstyle=\"\n\t\t\tflex: 1;\n\t\t\toverflow-y: auto;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\talign-items: center;\n\t\t\">\n\t\t<ids-input\n\t\t\t[id]=\"'name' + instanceId\"\n\t\t\t[label]=\"'textBlockId' | t\"\n\t\t\tvalidate=\"required\"\n\t\t\tmaxlength=\"13\"\n\t\t\tformControlName=\"TXVR\"\n\t\t\t[isFormComponent]=\"true\">\n\t\t</ids-input>\n\n\t\t<ids-input\n\t\t\t[id]=\"'description' + instanceId\"\n\t\t\t[label]=\"lang.get('description')\"\n\t\t\tmaxlength=\"40\"\n\t\t\tformControlName=\"TX40\"\n\t\t\t[isFormComponent]=\"true\">\n\t\t</ids-input>\n\n\t\t<div\n\t\t\tclass=\"field\"\n\t\t\tstyle=\"\n\t\t\t\tflex: 1;\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\tmin-height: 200px;\n\t\t\t\tmax-width: 300px;\n\t\t\t\">\n\t\t\t<label soho-label>{{ \"text\" | t }}</label>\n\t\t\t<textarea\n\t\t\t\tsoho-textarea\n\t\t\t\tstyle=\"flex: 1; min-height: 150px\"\n\t\t\t\t[autoGrow]=\"false\"\n\t\t\t\tname=\"modifiable\"\n\t\t\t\tformControlName=\"text\"></textarea>\n\t\t</div>\n\t</div>\n\n\t<div\n\t\tclass=\"button-container lm-margin-lg-r lm-margin-lg-l lm-margin-sm-b lm-margin-sm-t\"\n\t\tstyle=\"flex-shrink: 0; margin-top: auto\">\n\t\t<ids-button\n\t\t\tappearance=\"secondary\"\n\t\t\ttype=\"button\"\n\t\t\t(click)=\"completed.emit(null)\">\n\t\t\t{{ lang.get(\"cancel\") }}\n\t\t</ids-button>\n\t\t<ids-button\n\t\t\tappearance=\"primary\"\n\t\t\ttype=\"submit\"\n\t\t\t(click)=\"onSubmit()\"\n\t\t\ticon=\"save\">\n\t\t\t<span>{{ submitButtonText | t }}</span>\n\t\t</ids-button>\n\t</div>\n</form>\n",
			        styles: [":host {\n\tdisplay: block;\n\theight: 100%;\n}\n\n.new-textblock textarea {\n\twidth: 100%;\n\tmin-height: 100px;\n\tresize: vertical;\n}\n\nids-form {\n\tdisplay: flex;\n\tjustify-content: center;\n}\n\n.button-container {\n\tdisplay: flex;\n\tjustify-content: space-between;\n}\n\nform {\n\tdisplay: flex;\n\tflex-direction: column;\n\theight: 100%;\n}\n"],
			        standalone: true,
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        imports: [
			            ReactiveFormsModule,
			            DemoValueAccessorDirective,
			            SohoTextAreaModule,
			            ReactiveFormsModule,
			            CommonModule,
			            TranslatePipe,
			        ],
			        providers: [TranslatePipe],
			    }),
			    __metadata("design:paramtypes", [])
			], NewTextblockComponent);

			var _a;
			let WidgetComponent = class WidgetComponent extends WidgetBase {
			    constructor() {
			        super(...arguments);
			        this.#textBlockService = inject(TextBlockService);
			        this.title = signal(this.widgetContext.getTitle());
			        this.textBlocks = signal([]);
			        this.state = signal(-1);
			        this.editMode = signal(false);
			        this.editingTextVersion = signal(null);
			        this.contextMap = new Map();
			        this.editorEl = document.querySelector("#editor-demo");
			        this.State = State;
			        this.Mode = Mode;
			        this.subscriptions = new Subscription();
			        this.button = {
			            text: this.lang.get("addTextButton"),
			            click: () => {
			                this.onNewTextBlock();
			            },
			        };
			        this.editEnabled = false;
			        this.deleteEnabled = false;
			    }
			    #textBlockService;
			    async ngOnInit() {
			        try {
			            this.setBusy(true);
			            this.widgetInstance.restored = () => this.widgetContext.setStandardTitle();
			            this.initActions();
			            this.handleSettings();
			            await lastValueFrom(this.ibcService.init());
			            this.setEmptyState(State.WaitingForContext);
			        }
			        catch (error) {
			            this.setEmptyState(State.ErrorLoading, "error", error?.message ?? "");
			            this.handleError(error);
			        }
			    }
			    ngAfterViewInit() {
			        this.subscriptions.add(this.ibcService.ibc$.subscribe((data) => {
			            this.contextMap = data;
			            if (data.size === 0) {
			                this.textBlocks.set([]);
			                this.setEmptyState(State.WaitingForContext);
			            }
			            else {
			                this.setTextBlocks();
			            }
			        }));
			        this.widgetInstance.settingsSaved = () => {
			            this.handleSettings();
			            if (this.contextMap.size && !this.autoMode) {
			                this.ibcService.updateKeyValueMap();
			            }
			            if (this.contextMap.size && this.autoMode) {
			                this.ibcService.getByProgram();
			            }
			        };
			    }
			    ngOnDestroy() {
			        this.textBlocksSubscription?.unsubscribe();
			        this.ibcService.unregisterMessageHandlers();
			        this.subscriptions.unsubscribe();
			    }
			    updatePrimaryActions() {
			        const actions = [
			            {
			                text: this.lang.get("addTextTitle"),
			                standardIconName: "#icon-add",
			                isPrimary: true,
			                optionsSelectable: false,
			                isEnabled: true,
			                isVisible: this.editEnabled &&
			                    !this.editingTextVersion() &&
			                    this.contextMap.size !== 0,
			                execute: () => this.onNewTextBlock(),
			            },
			            {
			                text: this.lang.get("refresh"),
			                standardIconName: "#refresh",
			                isPrimary: false,
			                optionsSelectable: false,
			                isEnabled: true,
			                execute: () => this.setTextBlocks(),
			            },
			        ];
			        this.widgetInstance.actions = actions;
			        this.widgetContext.updatePrimaryAction();
			    }
			    setEmptyState(state, title, info) {
			        this.setBusy(false);
			        if (state === State.Ok) {
			            this.widgetContext.clearEmptyState();
			        }
			        else {
			            const defaultState = EMPTY_STATE[state];
			            const options = {
			                title: title ? this.lang.get(title) : this.lang.get(defaultState.title),
			                icon: defaultState.icon,
			            };
			            const description = info || defaultState.info;
			            if (description) {
			                options.description = this.lang.get(description);
			            }
			            if (state === State.NoData && this.editEnabled) {
			                options.button = this.button;
			            }
			            this.widgetContext.setEmptyState(options);
			        }
			        this.updatePrimaryActions();
			        this.state.set(state);
			    }
			    initActions() {
			        if (this.widgetInstance.actions && this.widgetInstance.actions.length > 0) {
			            this.widgetInstance.actions[0].execute = () => this.onNewTextBlock();
			        }
			    }
			    onNewTextBlock() {
			        this.editingTextVersion.set({});
			        this.setEmptyState(State.Ok);
			    }
			    onEditBlock(block, event) {
			        event.stopPropagation();
			        this.editingTextVersion.set(block);
			        this.setEmptyState(State.Ok);
			    }
			    onTextBlockCompleted(textId) {
			        this.editingTextVersion.set(null);
			        if (!this.textBlocks()?.length) {
			            this.setEmptyState(State.NoData);
			        }
			        else {
			            this.setEmptyState(State.Ok);
			        }
			        if (textId) {
			            this.selectedId = `${textId}-${this.instanceId}`;
			            this.setTextBlocks();
			        }
			        else {
			            this.expand();
			        }
			    }
			    onDeleteTextBlock(textBlock) {
			        const textBlockId = textBlock.TXVR || textBlock.TX40 || "";
			        const messageSettings = {
			            title: this.lang.get("confirmDelete"),
			            message: this.lang
			                .get("confirmDeleteMessage")
			                .replace("{id}", `"${textBlockId}"`),
			            status: "warning",
			        };
			        this.openDeleteMessage(messageSettings).then((deleteConfirmed) => {
			            if (deleteConfirmed) {
			                this.deleteTextBlock(textBlock);
			            }
			        });
			    }
			    deleteTextBlock(textBlock) {
			        this.setBusy(true);
			        this.subscriptions.add(this.#textBlockService.deleteTextBlockById(textBlock).subscribe({
			            next: (resp) => {
			                this.setBusy(false);
			                const textBlockKey = textBlock.TX40 || textBlock.TXVR || "";
			                this.showToast({
			                    title: this.lang.get("deletedTitle"),
			                    message: this.lang
			                        .get("deletedMessage")
			                        .replace("{id}", `"${textBlockKey}"`),
			                });
			                this.setTextBlocks();
			            },
			            error: (err) => {
			                const message = err.message ?? "Error deleting text block";
			                this.showWidgetMessage(message, WidgetMessageType$1.Error);
			                this.setBusy(false);
			            },
			        }));
			    }
			    onAccordionExpanded(event) {
			        const id = event.target.id;
			        this.selectedId = id;
			    }
			    setExpanded(event) {
			        const expanded = event.currentTarget.panels.find((panel) => {
			            return panel.expanded;
			        });
			        const id = expanded?.id;
			        this.selectedId = id;
			    }
			    expand() {
			        setTimeout(() => {
			            if (this.accordion && this.selectedId) {
			                const panel = this.accordion.nativeElement.panels.find((panel) => {
			                    return panel.id === this.selectedId;
			                });
			                if (panel) {
			                    panel.expanded = true;
			                }
			            }
			        }, 1);
			    }
			    handleSettings() {
			        const settings = this.widgetContext.getSettings();
			        this.autoMode = settings.get("autoMode", false);
			        this.editEnabled = settings.get("editEnabled", false);
			        this.deleteEnabled = settings.get("deleteEnabled", false);
			    }
			    setTextBlocks() {
			        this.textBlocksSubscription?.unsubscribe();
			        this.setBusy(true);
			        this.textBlocksSubscription = this.#textBlockService
			            .getAllTextblocks(this.contextMap)
			            .subscribe({
			            next: (resp) => {
			                this.setBusy(false);
			                if (resp?.length) {
			                    this.textBlocks.set(resp);
			                    this.setEmptyState(State.Ok);
			                }
			                else {
			                    this.textBlocks.set([]);
			                    this.setEmptyState(State.NoData);
			                }
			                setTimeout(() => {
			                    this.expand();
			                }, 0);
			            },
			            error: (err) => {
			                this.setEmptyState(State.ErrorLoading);
			            },
			        });
			    }
			};
			__decorate([
			    ViewChild("accordion"),
			    __metadata("design:type", typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object)
			], WidgetComponent.prototype, "accordion", void 0);
			WidgetComponent = __decorate([
			    Component({
			        template: "<!-- <div class=\"flex-container\"> -->\n\n@if (editingTextVersion()) {\n\t<new-textblock\n\t\t[contextMap]=\"contextMap\"\n\t\t[textVersion]=\"editingTextVersion()\"\n\t\t(completed)=\"onTextBlockCompleted($event)\"></new-textblock>\n}\n@if (textBlocks().length && !editingTextVersion()) {\n\t<ids-accordion\n\t\t[id]=\"'accordion' + instanceId\"\n\t\t#accordion\n\t\t[allowOnePane]=\"true\"\n\t\t(expanded)=\"setExpanded($event)\"\n\t\t(collapsed)=\"setExpanded($event)\">\n\t\t@for (block of textBlocks(); track block; let i = $index) {\n\t\t\t<ids-accordion-panel\n\t\t\t\t[id]=\"block.TXVR + '-' + instanceId\"\n\t\t\t\t[expanded]=\"i === 0 && textBlocks().length === 1 ? true : false\">\n\t\t\t\t<ids-accordion-header slot=\"header\">\n\t\t\t\t\t<ids-text font-size=\"16\">{{ block.TX40 || block.TXVR }}</ids-text>\n\t\t\t\t\t@if (editEnabled) {\n\t\t\t\t\t\t<ids-button\n\t\t\t\t\t\t\ticon=\"edit\"\n\t\t\t\t\t\t\tappearance=\"tertiary\"\n\t\t\t\t\t\t\tsize=\"sm\"\n\t\t\t\t\t\t\tstyle=\"margin-left: auto\"\n\t\t\t\t\t\t\t[title]=\"'editText' | t\"\n\t\t\t\t\t\t\t(click)=\"onEditBlock(block, $event)\">\n\t\t\t\t\t\t</ids-button>\n\t\t\t\t\t}\n\t\t\t\t\t@if (deleteEnabled) {\n\t\t\t\t\t\t<ids-button\n\t\t\t\t\t\t\ticon=\"delete\"\n\t\t\t\t\t\t\tappearance=\"tertiary\"\n\t\t\t\t\t\t\tsize=\"sm\"\n\t\t\t\t\t\t\tstyle=\"margin-left: auto\"\n\t\t\t\t\t\t\t[title]=\"'deleteText' | t\"\n\t\t\t\t\t\t\t(click)=\"onDeleteTextBlock(block)\">\n\t\t\t\t\t\t</ids-button>\n\t\t\t\t\t}\n\t\t\t\t</ids-accordion-header>\n\t\t\t\t<div slot=\"content\">\n\t\t\t\t\t<ids-text [innerHTML]=\"block.text\">{{ block.text }}</ids-text>\n\t\t\t\t</div>\n\t\t\t</ids-accordion-panel>\n\t\t}\n\t</ids-accordion>\n}\n<!-- \t} @else {\n\t\t\t<new-textblock\n\t\t\t\t[contextMap]=\"contextMap\"\n\t\t\t\t[textVersion]=\"editingTextVersion()\"\n\t\t\t\t(completed)=\"onTextBlockCompleted($event)\"\n\t\t\t\t(textChange)=\"onTextChange($event)\"></new-textblock>\n\t\t} -->\n<!-- </div> -->\n",
			        styles: ":host.ok {\r\n\tdisplay: block;\r\n\toverflow-x: hidden;\r\n\tposition: relative;\r\n\theight: 100%;\r\n\twidth: 100%;\r\n}\r\n\r\n.text-container {\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tflex: 1 1 auto; /* grow and shrink as needed */\r\n\toverflow-y: auto;\r\n}\r\n\r\n.item-container {\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\tjustify-content: space-between;\r\n\tflex: 0 0 auto; /* fixed height */\r\n}\r\n\r\n.flex-container {\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\theight: 100%;\r\n\toverflow-y: auto;\r\n}\r\n\r\n.text-container {\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\theight: 100%;\r\n\toverflow-y: hidden;\r\n}\r\n",
			        standalone: true,
			        schemas: [CUSTOM_ELEMENTS_SCHEMA],
			        imports: [TranslatePipe, NewTextblockComponent],
			        providers: [
			            TranslatePipe,
			            MiUtilService,
			            BusinessContextService,
			            UserService,
			            TextBlockService,
			            TextBlockParameterService,
			        ],
			    })
			], WidgetComponent);

			function widgetFactory() {
			    return {
			        angularConfig: {
			            componentType: WidgetComponent,
			        },
			        widgetSettingsFactory() {
			            return {
			                angularConfig: {
			                    componentType: SettingsComponent,
			                },
			            };
			        },
			        isConfigured: (settings) => {
			            return ((settings.get("FILE") !== "" && settings.get("KFLD") !== "") ||
			                settings.get("autoMode"));
			        },
			    };
			}

		})
	};
}));
