import { ILanguage, Log } from "@infor-lime/core";

/**
 * VERY crude HTML escaping.
 */
export function escapeHTML(unsafe?: string) {
	if (!unsafe) return "";
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
		.replace(/\\/g, "&bsol;");
}

/**
 * Tagged template function that escapes all values and returns a string.
 * Using this instead of a raw string also provides syntax highlighting,
 * if your editor supports it (for vscode, you need an extension).
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]) {
	return strings
		.map((str, i) => {
			const value = values[i];
			if (value === undefined || value === null) return str;
			return str + escapeHTML(value.toString());
		})
		.join("");
}

export function log(message: string) {
	Log.debug(`[infor.sample.webcomponent.settings] ${message}`);
}

export interface IManifestLanguage extends ILanguage<IManifestLanguage> {
	widgetDescription: string;
	widgetTitle: string;
	textBlockLanguage: string;
	fontSize: string;
	title: string;
	text: string;
	small: string;
	normal: string;
	large: string;
}
export type IManifestSettings = {
	title: string;
	textBlockId: string;
	textBlockLanguage: string;
	autoMode: boolean;
	editEnabled: boolean;
	deleteEnabled: boolean;
};
