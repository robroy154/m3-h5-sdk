import {
	IWidgetComponent,
	IWidgetContext,
	IWidgetInstance,
} from "@infor-lime/core";

export abstract class WidgetWebComponent
	extends HTMLElement
	implements IWidgetComponent
{
	readonly widgetContext: IWidgetContext;
	readonly widgetInstance: IWidgetInstance;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback(): void {
		this.#attachStylesheet(this.constructor["styles"]);
		this.beforeFirstRender();
		this.#render();
	}

	/**
	 * Invoked when the component is created, before the first render.
	 */
	abstract beforeFirstRender(): void;

	/**
	 * Invoked every time the component is rendered.
	 */
	abstract afterRender(document: ShadowRoot): void;

	static styles = css``;

	protected render(): string {
		return html``;
	}

	changed() {
		if (this.isConnected) {
			this.#render();
		}
	}

	#render(): void {
		this.#attachTemplate(this.render());
		this.afterRender(this.shadowRoot);
		this.#emitRenderEvent();
	}

	#attachTemplate(html: string) {
		const template = document.createElement("template");
		template.innerHTML = html;
		this.shadowRoot.replaceChildren(template.content.cloneNode(true));
	}

	#attachStylesheet(css: string) {
		const styles = new CSSStyleSheet();
		styles.replaceSync(css);
		this.shadowRoot.adoptedStyleSheets = [styles];
	}

	#emitRenderEvent() {
		this.dispatchEvent(new CustomEvent("render"));
	}
}

/**
 * A decorator used on a property to indicate that
 * when it changes, the component should be re-rendered.
 */
export function state() {
	return function (target: WidgetWebComponent, propertyKey: string) {
		const key = Symbol(propertyKey);
		const getter = function (this: WidgetWebComponent) {
			return this[key];
		};
		const setter = function (this: WidgetWebComponent, value: unknown) {
			this[key] = value;
			this.changed();
		};
		Object.defineProperty(target, propertyKey, {
			get: getter,
			set: setter,
		});
	};
}

/**
 * A decorator used on a property to query for an element
 * in the component's shadow root.
 */
export function query(selector: string) {
	return function (target: WidgetWebComponent, propertyKey: string) {
		const getter = function (this: WidgetWebComponent) {
			return this.shadowRoot.querySelector(selector);
		};
		Object.defineProperty(target, propertyKey, {
			get: getter,
		});
	};
}

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

/**
 * Tagged template function for syntax highlighting,
 * if your editor supports it (for vscode, you need an extension).
 */
export function css(strings: TemplateStringsArray, ...values: unknown[]) {
	return strings
		.map((str, i) => {
			const value = values[i];
			if (value === undefined || value === null) return str;
			return str + value.toString();
		})
		.join("");
}
