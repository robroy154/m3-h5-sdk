export interface ITextBlockKeyValues {
	KV01?: string;
	KV02?: string;
	KV03?: string;
	KV04?: string;
	KV05?: string;
	KV06?: string;
	KV07?: string;
	KV08?: string;
	KV09?: string;
	KV10?: string;
	KV11?: string;
	KV12?: string;
	KV13?: string;
	KV14?: string;
	FLDI?: string;
	KFLD?: string;
}
export interface ITextBlockKeys {
	FILE: string;
	TFIL?: string;
	TXID?: string;
	KV01?: string;
	KV02?: string;
	KV03?: string;
	KV04?: string;
	KV05?: string;
	KV06?: string;
	KV07?: string;
	KV08?: string;
	KV09?: string;
	KV10?: string;
	KV11?: string;
	KV12?: string;
	KV13?: string;
	KV14?: string;
	FLDI?: string;
	CONO?: string;
	LNCD?: string;
	TX40?: string;
}

export interface ITextBlock {
	TXVR: string;
	LNCD: string;
	TX40: string;
	TXEI: string;
	textLines: TextLine[];
	text: string;
	TXID: string;
	FILE: string;
	TFIL?: string;
	KFLD: string;
}

interface TextLine {
	TX60: string;
	LINO: string;
}

export interface ConfigFormValue {
	FILE: string;
	TFIL?: string;
	// TXVR: string;
	LNCD?: string;
	TXEI?: string;
	KFLD?: string;
	// TX40: string;
	keyValues: Array<ITextBlockKeyValues>;
	keyValue: ITextBlockKeyValues;
}
