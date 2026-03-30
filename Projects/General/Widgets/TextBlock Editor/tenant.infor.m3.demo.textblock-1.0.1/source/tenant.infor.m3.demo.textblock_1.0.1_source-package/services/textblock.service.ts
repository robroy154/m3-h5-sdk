/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";

import { widgetContextInjectionToken } from "@infor-lime/core";
import {
	catchError,
	concatMap,
	delay,
	forkJoin,
	from,
	map,
	mergeMap,
	Observable,
	of,
	switchMap,
	throwError,
	toArray,
} from "rxjs";
import { TEXTBLOCK_SEPARATORS } from "../constant/index";

import { ITextBlock, ITextBlockKeys } from "../types/text-block.type";
import { BusinessContextService } from "./business-context.service";
import { IMIRecord, MiUtilService } from "./index";
import { User, UserService } from "./user.service";

export interface INameValue {
	Name: string;
	Value: string;
}

export interface ITextResponse {
	Message?: string;
	session?: string;
	Program: string;
	Transaction: string;
	MIRecord?: IMIRecord[] | null;
	"@code"?: string;
}

export interface LstTxtBlocksResponse {
	TXVR: string;
	LNCD: string;
	TX40: string;
	TXEI: string;
}

@Injectable({
	providedIn: "root",
})
export class TextBlockService {
	private readonly widgetContext = inject(widgetContextInjectionToken);
	private readonly miUtilS = inject(MiUtilService);
	private readonly userService = inject(UserService);
	readonly #contextService = inject(BusinessContextService);

	_TXID: string = "";
	_activeTFIL: string = "";

	TFIL_VALUES = ["CSYTXH", "FSYTXH", "MSYTXH", "OSYTXH", "SSYTXH"];

	get TXID(): string {
		return this._TXID;
	}

	set TXID(value: string) {
		this._TXID = value;
	}

	get activeTFIL(): string {
		return this._activeTFIL;
	}

	set activeTFIL(value: string) {
		this._activeTFIL = value;
	}

	getAllTextblocks(ibcData: Map<string, string>) {
		return this.getTextBlock(this.buildKeyParams(ibcData));
	}

	findActiveTfil(parameters: any): Observable<{ TFIL: string; data: any }> {
		const tfilValues = parameters.TFIL ? [parameters.TFIL] : this.TFIL_VALUES;

		return forkJoin(
			tfilValues.map((value) =>
				this.lstTxtBlocks({ ...parameters, TFIL: value }).pipe(
					map((data) => ({ TFIL: value, data })),
				),
			),
		).pipe(
			map(
				(results) =>
					results.find((result) => result.data?.length > 0) || {
						TFIL: "",
						data: null,
					},
			),
		);
	}

	getTextBlock(params: ITextBlockKeys): Observable<any> {
		return this.getTextId(params).pipe(
			concatMap((resp: IMIRecord) => {
				const TXID: string = resp["TXID"] ?? "";
				this.TXID = TXID;

				if (!TXID || TXID === "0") {
					return of(null);
				}
				return this.findActiveTfil({ ...params, TXID }).pipe(
					concatMap((result: { TFIL: string; data: any }) => {
						if (!result.data?.length) return of([]);

						this.activeTFIL = result.TFIL;
						const updatedParams = { ...params, TFIL: result.TFIL };
						return forkJoin(
							result.data.map((tb: any) =>
								this.selectTextBlock(TXID, { ...updatedParams, ...tb }),
							),
						);
					}),
				);
			}),
			concatMap((resp: any) => {
				const filtered = resp?.filter((tb: any) => tb.textLines.length !== 0);
				return of(filtered);
			}),
		);
	}

	saveTextblock(textBlockValues: ITextBlock, existingVersion?: string) {
		const params = this.buildKeyParams(this.#contextService.valueMap);
		const merged = {
			...params,
			...textBlockValues,
			TFIL: textBlockValues.TFIL || this.activeTFIL || params.TFIL,
		};
		return this.solveTextId(merged).pipe(
			switchMap(() =>
				textBlockValues.TXVR === existingVersion
					? this.updateExistingTextBlockVersion(merged, existingVersion)
					: this.createNewTextBlockVersion(merged).pipe(
							switchMap((response: any) => {
								return existingVersion
									? this.dltTextBlockLines(merged, existingVersion)
									: of(response);
							}),
						),
			),
			catchError((e) => {
				return throwError(() => e);
			}),
			delay(500),
		);
	}

	updateExistingTextBlockVersion(textBlock: ITextBlock, textBlockId?: string) {
		return this.dltTextBlockLines(textBlock, textBlockId).pipe(
			switchMap(() => this.createNewTextBlockVersion(textBlock)),
		);
	}

	getTextBlockLanguage(user: User): string {
		const languageSetting = this.widgetContext
			.getSettings()
			.get<string>("textBlockLanguage", "");

		return languageSetting === "user"
			? user.LANC
			: languageSetting === "blank"
				? ""
				: languageSetting;
	}

	createNewTextBlockVersion(textValues: ITextBlock) {
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
		return this.addTextBlockHead(params).pipe(
			switchMap(() => {
				const textBlockLines = this.formatTextblockLines(textValues["text"]);
				return this.addTextBlockLines(params, textBlockLines);
			}),
		);
	}

	getTextId(params: ITextBlockKeys) {
		const parameters = {
			FILE: params.FILE,
			KV01: params.KV01 ?? "",
			KV02: params.KV02 ?? "",
			KV03: params.KV03 ?? "",
			KV04: params.KV04 ?? "",
		};
		return this.miUtilS.execute(
			"CRS980MI",
			"GetTextID",
			parameters,
			1,
			"",
			true,
		);
	}

	lstTxtBlocks(parameters: any) {
		return this.miUtilS.execute(
			"CRS980MI",
			"LstTxtBlocks",
			parameters,
			0,
			"TXVR,TX40,TXEI",
			true,
		);
	}

	selectTextBlock(TXID: string, textBlock: any) {
		const parameters: IMIRecord = {
			TXID: TXID,
			FILE: textBlock.FILE ?? "", //"MWOHED00",
			TFIL: textBlock.TFIL ?? "", //"MSYTXH",
			TXVR: textBlock.TXVR,
			LNCD: textBlock.LNCD ?? "",
		};

		return this.miUtilS
			.execute("CRS980MI", "SltTxtBlock", parameters, 0, "", true)
			.pipe(
				concatMap((resp) => {
					return of(
						resp
							? {
									...textBlock,
									textLines: resp,
									text: this.textBlockLinesToText(resp as any),
									TXID: TXID,
								}
							: null,
					);
				}),
			);
	}

	addTextBlockLines(params: any, textBlockLines: string[]) {
		return from(textBlockLines).pipe(
			mergeMap(
				(text, index) => this.addTextBlockLine(params, text, index + 1),
				1, // Concurrency of 1 ensures sequential execution
			),
			toArray(), // Collect all results into an array
			catchError((error) => {
				// Handle error and stop execution
				return throwError(() => error);
			}),
		);
	}

	addTextBlockLine(params: any, TX60: string, LINO: number) {
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

		return this.miUtilS.execute(
			"CRS980MI",
			"AddTxtBlockLine",
			parameters as any,
			1,
		);
	}

	solveTextId(textblockKeys: ITextBlockKeys): Observable<any> {
		/* Generate new TXID if it doesn't exist */
		if (!this.TXID || this.TXID === "0") {
			return this.rtvNewTextID(textblockKeys).pipe(
				switchMap((resp: IMIRecord) => {
					if (!resp["TXID"])
						return throwError(() => new Error("No TXID found"));

					this.TXID = resp["TXID"];

					return this.setTextId(new Map(Object.entries(textblockKeys)));
				}),
			);
		} else {
			// return existing text ID
			return of(this.TXID);
		}
	}

	deleteTextBlockById(textBlock: ITextBlock) {
		return this.dltTextBlockLines(textBlock);
	}

	dltTextBlockLines(params: ITextBlock, textBlockId?: string) {
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

	rtvNewTextID(params: ITextBlockKeys) {
		// const FILE = "MSYTXH";
		const { LNCD } = params;

		const parameters: IMIRecord = {
			FILE: params.TFIL ?? "",
			// TABL: params.FILE,
			CONO: this.userService.user.CONO,
		};
		if (LNCD) {
			parameters["LNCD"] = LNCD;
		}

		return this.miUtilS.execute("CRS980MI", "RtvNewTextID", parameters, 1);
	}

	addTextBlockHead(params: ITextBlockKeys) {
		const parameters = {
			...params,
			TX40: params["TX40"]?.substring(0, 40) ?? "",
			TXID: this.TXID,
		};

		return this.miUtilS.execute(
			"CRS980MI",
			"AddTxtBlockHead",
			parameters,
			1,
			"",
			false,
		);
	}

	buildKeyParams(ibcData: Map<string, string>): ITextBlockKeys {
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

	setTextId(ibcData: Map<string, string>) {
		const parameters: IMIRecord = {
			...this.buildKeyParams(ibcData),
			// TXID: this.TXID,
		};

		return this.miUtilS.execute("CRS980MI", "SetTextID", parameters, 1).pipe(
			map((resp: any) => {
				return this.TXID;
			}),
			catchError((err) => {
				return throwError(() => err);
			}),
		);
	}

	getValue(nameValues: INameValue[], name: string): string {
		const nameValueWithMatchingName = nameValues.find(
			(nameValue) => nameValue.Name === name,
		);
		if (nameValueWithMatchingName && nameValueWithMatchingName.Value) {
			return nameValueWithMatchingName.Value.trim();
		} else {
			return "";
		}
	}

	formatTextblockLines(text: string) {
		const newTextBlock: string[] = [];
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
			// Take care of new rows
			if (word.split("\n").length >= 2) {
				const newRowWords = word.split("\n");
				newText += newRowWords.shift();
				newTextBlock.push(newText);
				newText = "";
				for (let j = 0; j < newRowWords.length; j++) {
					const newRowWord = newRowWords[j];
					if (j + 1 < newRowWords.length) {
						newTextBlock.push(newRowWord);
					} else {
						newText += newRowWord;
					}
				}
			} else {
				newText += word;
			}
			if (i + 1 === words.length) {
				newTextBlock.push(newText);
			}
		}
		return newTextBlock;
	}

	textBlockLinesToText(textBlockLines: any[]) {
		if (!textBlockLines?.length) return "";

		textBlockLines.forEach((line: any) => {
			if (line.TX60 === "") {
				line.TX60 = "<br><br>";
			}
		});

		const lineStringList = textBlockLines.map((line: any) => line.TX60);

		const text = lineStringList.join(" ");
		return text;
	}
}
