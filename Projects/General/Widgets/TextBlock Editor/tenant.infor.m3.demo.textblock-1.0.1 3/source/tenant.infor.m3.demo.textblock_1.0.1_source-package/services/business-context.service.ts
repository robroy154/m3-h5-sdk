import { inject, Injectable } from "@angular/core";
import { IWidgetContext, IWidgetInstance } from "@infor-lime/core";
import { BehaviorSubject, forkJoin, Observable, Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";
import {
	CREDIT_MANAGER_TOOLBOX,
	MOCK_CRS610,
	MOCK_DATA_PMS100,
	MOCK_DATA_QMS201,
	MOCK_DATA_QMS201_ERROR,
	MOCK_DATA_QMS400,
	MOCK_MMS001,
} from "../constant/index";
import { USER_DROPDOWN_OPTIONS } from "../constant/user-dropdown-options.const";
import type { IBusinessContext, IEntity, MiEntity } from "../types/index";
import { MiUtilService } from "./mi-util.service";
import { TextBlockParameterService } from "./text-block-parameter.service";
import { UserService } from "./user.service";

@Injectable(/* {
  providedIn: "root",
} */)
export class BusinessContextService {
	private subscriptions = new Subscription();
	groupedEntities!: { [key: string]: MiEntity[] };

	private ibcSubject = new BehaviorSubject<Map<string, string>>(new Map());
	ibc$ = this.ibcSubject.asObservable();

	USER_DROPDOWN_OPTIONS = USER_DROPDOWN_OPTIONS;
	fieldListSubject = new BehaviorSubject<string[]>([]);
	fieldList$: Observable<string[]> = this.fieldListSubject.asObservable();

	private MOCK_DATA_QMS201 = MOCK_DATA_QMS201;
	private MOCK_DATA_QMS400 = MOCK_DATA_QMS400;
	private CREDIT_MANAGER_TOOLBOX = CREDIT_MANAGER_TOOLBOX;
	private MOCK_DATA_QMS201_ERROR = MOCK_DATA_QMS201_ERROR;

	private MOCK_DATA_PMS100 = MOCK_DATA_PMS100;
	private MOCK_MMS001 = MOCK_MMS001;
	private MOCK_CRS610 = MOCK_CRS610;

	valueMap = new Map<string, string>();

	private readonly widgetContext = inject(IWidgetContext);
	private readonly widgetInstance = inject(IWidgetInstance);
	private readonly miUtil = inject(MiUtilService);
	private readonly userService = inject(UserService);
	readonly #textBlockParameterService = inject(TextBlockParameterService);

	constructor() {}

	private setEventHandlers(): void {
		this.registerMessageHandlers();
		this.widgetInstance.activated = () => {
			this.registerMessageHandlers();
		};
		this.widgetInstance.deactivated = () => this.unregisterMessageHandlers();
	}

	private registerMessageHandlers(): void {
		this.subscriptions.unsubscribe();
		this.subscriptions = new Subscription();
		const ibcSub = this.widgetContext
			.receive("inforBusinessContext")
			.subscribe((data: unknown) =>
				this.handleMessage(data as IBusinessContext),
			);

		this.subscriptions.add(ibcSub);

		const iwcSub = this.widgetContext
			.receive("inforWidgetContext")
			.subscribe((data: unknown) =>
				this.handleMessage(data as IBusinessContext),
			);

		this.subscriptions.add(iwcSub);
	}

	unregisterMessageHandlers(): void {
		this.subscriptions.unsubscribe();
	}

	private handleMessage(data?: IBusinessContext): void {
		this.valueMap.clear();
		this.valueMap.set("program", data?.program ?? "");
		for (const [key, value] of this.userService.userMap) {
			this.valueMap.set(key, value);
		}
		const entities = data?.entities ?? [];

		if (!entities?.length) {
			// this.ibcSubject.next(this.valueMap);
			return;
		}

		const mappedEntities = new Map<string, any>();

		entities.forEach((entity: any) => {
			const entityType = entity.entityType;
			const groupedEntity = this.groupedEntities[entityType];
			const newProperties: { [key: string]: any } = {};

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

		if (
			data?.program === "QMS201" &&
			(!this.valueMap.has("QMGP") || !this.valueMap.has("SPEC"))
		) {
			this.parseDrillbackUrl(entities as IEntity[]);
		}

		const settings = this.widgetContext.getSettings();
		const autoMode = settings.get("autoMode");

		if (autoMode && this.valueMap.get("program")) {
			this.getByProgram();
		} else if (!autoMode) {
			this.updateKeyValueMap();
		}
		// this.updateKeyValueMap();
	}

	getByProgram() {
		const program = this.valueMap.get("program") ?? "";
		if (!program) return;

		this.#textBlockParameterService.getParByPgm(program).subscribe({
			next: (resp) => {
				this.updateKeyValueMap(resp);
			},
			error: (err) => {
				// console.log("err ", err);
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

	updateKeyValueMap(keyValueSettings?: any) {
		this.removeExistingKeyValueMap();

		const settings = this.widgetContext.getSettings();

		const keyValueMap = new Map<string, string>();
		// settingsToCheck.forEach((settingKey) => {
		keyValueSettings = keyValueSettings ?? this.keyValueSettings;
		const keyValues = Object.keys(keyValueSettings ?? this.keyValueSettings);
		keyValues.forEach((settingKey) => {
			let keyArray;

			/* 
			let keyArray =
				settingKey === "KFLD"
					? settings.get(settings.get("KFLD") ?? "")
					: settings.get(settingKey);
 */
			if (settingKey === "KFLD") {
				keyArray =
					keyValueSettings[keyValueSettings["KFLD"]] ??
					settings.get(settings.get("KFLD") ?? "");
			} else {
				keyArray = keyValueSettings[settingKey] ?? settings.get(settingKey);
			}

			if (Array.isArray(keyArray)) {
				const foundKey = keyArray.find((key) => this.valueMap.has(key));
				if (foundKey && this.valueMap.get(foundKey)) {
					// this.valueMap.set(settingKey, this.valueMap.get(foundKey)!);
					keyValueMap.set(settingKey, this.valueMap.get(foundKey)!);
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

	get keyValueSettings(): any {
		const settings = this.widgetContext.getSettings();
		const settingsValue = settings.getValues();
		const result: any = {};

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

	parseDrillbackUrl(enteties: IEntity[]) {
		const entityInforQITest = enteties.find(
			(e) => e.entityType === "InforQITest",
		);

		if (!entityInforQITest?.drillbackURL) return;

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
		const values: { [key: string]: string } = {};

		for (let i = 0; i < fields.length; i += 2) {
			const field = fields[i];
			const value = fields[i + 1];
			if (field && ["W1OBKV", "W2OBKV", "W3OBKV", "W4OBKV"].includes(field)) {
				values[field] = value.trim();
				// this.valueMap.set(field, value.trim());
			}
		}

		if (!this.valueMap.has("ITNO") && values["W1OBKV"])
			this.valueMap.set("ITNO", values["W1OBKV"]);
		if (!this.valueMap.has("QMGP") && values["W2OBKV"])
			this.valueMap.set("QMGP", values["W2OBKV"]);
		if (!this.valueMap.has("SPEC") && values["W3OBKV"])
			this.valueMap.set("SPEC", values["W3OBKV"]);
		return;
		/* 		return (
			values["W1OBKV"] +
			"," +
			values["W2OBKV"] +
			"," +
			values["W3OBKV"] +
			"," +
			values["W4OBKV"]
		); */
	}

	init(): Observable<void> {
		return forkJoin([this.setEntities(), this.userService.init()]).pipe(
			map(() => void 0),
		);
	}

	private createUniqueKeysMap(entities: MiEntity[]): Map<string, string> {
		const uniqueMap = new Map<string, string>();
		entities.forEach((entity) => {
			Object.entries(entity).forEach(([key, value]) => {
				if (value && !uniqueMap.has(key)) {
					uniqueMap.set(key, String(value));
				}
			});
		});
		return uniqueMap;
	}

	private getUniqueFLDIValues(response: MiEntity[]): string[] {
		return [
			...new Set(response.map((entity) => entity.FLDI).filter(Boolean)),
		].sort();
	}

	private setEntities(): Observable<void> {
		return this.miUtil.execute("MNS035MI", "LstByEntity").pipe(
			tap((response: MiEntity[]) => {
				const uniqueFLDIValues = this.getUniqueFLDIValues(response);
				this.fieldListSubject.next(uniqueFLDIValues);
				const groupedEntities = response.reduce(
					(acc, entity) => {
						const key = entity.ISEC;
						if (!acc[key]) {
							acc[key] = [];
						}
						acc[key].push(entity);
						return acc;
					},
					{} as { [key: string]: MiEntity[] },
				);
				this.groupedEntities = groupedEntities;

				this.setEventHandlers();

				if (this.widgetContext.isDev()) {
					setTimeout(() => {
						// this.handleMessage(this.CREDIT_MANAGER_TOOLBOX as any);
						// this.handleMessage(this.MOCK_DATA_PMS100 as any);
						this.handleMessage(this.MOCK_DATA_PMS100 as any);
						// this.handleMessage(this.MOCK_CRS610 as any);
					}, 1000);
				}
			}),
			map(() => void 0),
		);
	}
}
