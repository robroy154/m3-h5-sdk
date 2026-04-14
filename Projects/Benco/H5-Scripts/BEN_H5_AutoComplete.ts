/* -------------------------------------------- Running Script Version 08182025.1 --------------------------------------------
|
|       Script name: BEN_H5_AutoComplete
|       Script Argument: OACUNO,CRS610MI,SearchCustomer,RESP,CUNM,CUNO
|       Screen: OIS100
|
|       Description: Use this script in any M3 program with an input field to configure it as an autocomplete searchfield.
|
| -------------------------------------------- Running Script Version 04232025.2 -------------------------------------------- */

var BEN_H5_AutoComplete = class {

    private translations: { [lang: string]: { [key: string]: string } };
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;
    private scriptName: string;
    private language: string;
    private cache: { [key: string]: any };
    private cacheSelectedItems: { [key: string]: any };
    private currentSearchTerm: string;
    private searchfieldOptions: { Element: string; Height: string };
    private transactionOptions: { program: string; transaction: string; SQRY: string[] };
    private element: any;
    private $searchField: JQuery | null;

    constructor(scriptArgs: IScriptArgs) {
        this.translations = {
            GB: {
                unknownError: "Enter the valid arguments",
                argumentsNoData: "Missing script arguments, found:",
                fieldNameError:
                    "BEN_H5_AutoComplete: Field {} not found. Check script arguments or if you're in the right screen.",
                fieldNameInvalid:
                    "Unable to find field. You must enter the correct field name with a position id.",
                searchfieldExists: "Searchfield {} found in the panel.",
            },
        };
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.scriptName = "BEN_H5_AutoComplete";
        this.language = ScriptUtil.GetUserContext("LANC");
        this.cache = {};
        this.cacheSelectedItems = {};
        this.currentSearchTerm = "";
        this.searchfieldOptions = {
            Element: "",
            Height: "",
        };
        this.transactionOptions = { program: "", transaction: "", SQRY: [] };
        this.element = scriptArgs.elem;
        this.$searchField = null;
    }

    public static Init(scriptArgs: IScriptArgs): void {
        new BEN_H5_AutoComplete(scriptArgs).run();
    }

    private run(): void {
        this.log.Info("Running script: ".concat(this.scriptName));
        //  Parse user supplied script arguments
        const scriptArguments = this.parseArguments(this.args);
        // Validate script arguments
        const numberOfArguments = scriptArguments.length;
        if (numberOfArguments < 4) {
            return this.showMessage(
                ""
                    .concat(this.translate("argumentsNoData"), " ")
                    .concat(String(numberOfArguments)),
                DialogType.Error
            );
        }
        // Extract script arguments
        const searchField = scriptArguments[0],
            program = scriptArguments[1],
            transaction = scriptArguments[2],
            searchCriteria = scriptArguments.slice(3);
        this.searchfieldOptions = {
            Element: searchField,
            Height: "400",
        };
        this.transactionOptions = {
            program: program,
            transaction: transaction,
            SQRY: searchCriteria,
        };
        const lastArgument = searchCriteria.slice(-1)[0];
        // Check if last argument in searchCriteria is a number,
        // if it is a number user we know this is the "widgetHeight" argument.
        if (this.isNumeric(lastArgument)) {
            this.searchfieldOptions.Height = searchCriteria.pop();
        }
        this.$searchField = this.initializeSearchFieldComponent(
            this.searchfieldOptions
        );
        const widget = this.setupWidget(
            this.$searchField,
            this.transactionOptions,
            this.searchfieldOptions.Height
        );
        this.addEvents(searchField, widget);
    }

    private initializeSearchFieldComponent(
        searchFieldOptions: { Element: string; Height: string }
    ): JQuery | null {
        let $searchField = this.controller.GetElement(searchFieldOptions.Element);
        if ($searchField.length === 0) {
            // Check if user supplied field exists in the datagrid header
            $searchField = this.getDataGridInputFieldById(searchFieldOptions.Element);
            if (!$searchField) {
                // Silently return null - field may not be visible yet or may never be used
                this.log.Debug(
                    "Field "
                        .concat(searchFieldOptions.Element, " not found - will initialize if/when field becomes available")
                );
                return null;
            } else {
                this.log.Info(
                    this.translate("searchfieldExists", [searchFieldOptions.Element])
                );
            }
        }
        return $searchField !== null && $searchField !== void 0
            ? $searchField
            : null;
    }

    private addEvents(searchField: string, widget: any): void {
        const unsubscribeRequesting = this.controller.Requesting.On((args: CancelRequestEventArgs) => {
            this.log.Debug(
                "Event: Requesting, Command type: "
                    .concat(args.commandType, ", Command value: ")
                    .concat(args.commandValue)
            );
            if (args.commandType === "KEY" && args.commandValue === "ENTER") {
                // Check if the current field that has focus is equal to the user supplied "searchField"
                // @ts-expect-error: The attribute "focusField" is not documented, may change in the future.
                const isFocused = this.controller.focusField === searchField;
                const isOpen = widget.menu.element.is(":visible");
                if (isFocused && isOpen) {
                    this.log.Debug(
                        "Canceling ENTER request --> widget menu is open and ".concat(
                            searchField,
                            " has focus"
                        )
                    );
                    args.cancel = true;
                }
            }
        });
        const unsubscribeRequested = this.controller.Requested.On((args: RequestEventArgs) => {
            this.log.Debug(
                "Event: Requested, Command type: "
                    .concat(args.commandType, ", Command value: ")
                    .concat(args.commandValue, ". Destroying autocomplete widget.")
            );
            unsubscribeRequesting();
            unsubscribeRequested();
            widget.destroy();
            /***************** Initialize autocomplete component on page loading/scroll down event *****************/
            if (args.commandType == "PAGE" && args.commandValue == "DOWN") {
                this.log.Info("Reinitializing Autocomplete widget component");
                setTimeout(() => {
                    this.$searchField = this.initializeSearchFieldComponent(
                        this.searchfieldOptions
                    );
                    widget = this.setupWidget(
                        this.$searchField,
                        this.transactionOptions,
                        this.searchfieldOptions.Height
                    );
                }, 5);
            }
        });
    }

    private setupWidget(
        element: JQuery | null,
        transactionOptions: { program: string; transaction: string; SQRY: string[] },
        widgetHeight: string
    ): any {
        element.keydown((event: JQueryEventObject) => {
            const isOpen = widget.menu.element.is(":visible");
            if (isOpen) {
                if (
                    event.which === 37 ||
                    event.which === 39 ||
                    (event.which === 38 &&
                        (widget.menu.active?.index()) === 0)
                ) {
                    event.stopImmediatePropagation();
                    if (event.which === 38) event.preventDefault();
                    return widget;
                }
            } else if (event.which === 38) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        });
        const options = this.defineSearchOptions(element, transactionOptions);
        // Development has overriden the autocomplete widget with custom logic.
        // To avoid this we use the native jquery ui implementation of autocomplete.
        //@ts-expect-error: We know $.ui exists and is bundled.
        const widget = $.ui.autocomplete(options, element);
        widget.menu.element.css({
            "max-height": "".concat(widgetHeight, "px"),
            "overflow-y": "overlay",
            "overflow-x": "hidden",
            "font-size": "".concat(this.getFontSizeFromInput()),
            "font-family": 'source sans pro",helvetica,arial,sans-serif',
            "z-index": "1000",
            height: "auto",
            background: "inherit", //set to disable static background of ui-widget
            "max-width": "400px",
        });
        this.extendWidget(widget);
        return widget;
    }

    private defineSearchOptions(
        element: JQuery | null,
        transactionOptions: { program: string; transaction: string; SQRY: string[] }
    ): any {
        return {
            autoFocus: false,
            delay: 300,
            minLength: 1,
            source: (search: any, response: Function) => {
                const searchTerm = search.term.toUpperCase();
                if (searchTerm in this.cacheSelectedItems) {
                    this.log.Debug(
                        "searchTerm : ".concat(
                            searchTerm,
                            " exists in selected items cache return previous result"
                        )
                    );
                    return response(this.cache[this.cacheSelectedItems[searchTerm]]);
                }
                if (searchTerm in this.cache) {
                    this.log.Debug(
                        "searchTerm : ".concat(
                            searchTerm,
                            " exists in cache returning cached result"
                        )
                    );
                    return response(this.cache[searchTerm]);
                }
                this.currentSearchTerm = searchTerm;
                const request = this.createRequest(
                    searchTerm,
                    transactionOptions.program,
                    transactionOptions.transaction,
                    transactionOptions.SQRY
                );
                return (MIService.Current as any).executeRequestV2(request)
                    .then(
                        (miResponse: IMIResponse) => {
                            if (miResponse.hasError()) {
                                const message =
                                    miResponse.errorMessage || this.translate("unknownError");
                                this.showMessage(message, DialogType.Error);
                                return;
                            }
                            const parsedResult = this.parseResponse(miResponse);
                            const transformedResult = this.transformResponse(parsedResult);
                            const result = this.filterSearch(searchTerm, transformedResult);
                            result.sort(this.sortItems);
                            this.cache[searchTerm] = result;
                            return response(result);
                        },
                        (err: any) => {
                            let errorMsg = this.translate("unknownError");
                            if (err.error) {
                                errorMsg = ""
                                    .concat(err.error.terminationErrorType, ": ")
                                    .concat(err.error.terminationReason);
                            }
                            this.showMessage(errorMsg, DialogType.Error);
                            return response();
                        }
                    );
            },
            focus: () => {
                return false; // Prevent autocomplete from updating the value of the textbox with the current focused item
            },
            select: (_event: any, ui: any) => {
                const { _label, value } = ui.item;
                this.cacheSelectedItems[value] = this.currentSearchTerm;
                const elementId = element.attr("id");
                if (
                    elementId.includes("header-filter") ||
                    elementId.includes("ids-data-grid-filter")
                ) {
                    element.val(value);
                } else {
                    ScriptUtil.SetFieldValue(elementId, value);
                }
                return false;
            },
        };
    }

    private getFontSizeFromInput(): string {
        return this.searchfieldOptions
            ? $("input#".concat(this.searchfieldOptions.Element, " ")).css(
                "font-size"
            ) || "14px"
            : "14px";
    }

    private extendWidget(widget: any): any {
        const getFontSize = () => {
            return this.getFontSizeFromInput();
        };
        // NOTE: This must remain a regular function (not arrow) because jQuery UI
        // sets `this` to the widget instance when calling _renderItem. `this.term`
        // below refers to the widget's current search term, not the class instance.
        widget._renderItem = function(ul: any, item: any) {
            const isLongLabel = () => {
                return labels.length >= 3;
            };
            const style = (extra: string = "") => {
                return 'style = "font-size:'
                    .concat(getFontSize(), "; ")
                    .concat(extra, '"');
            };
            const termArray = this.term.split(" ");
            const regexSearch = new RegExp(termArray.join("|"), "gi");
            const labels = item.label.split(" --- ").map((label: string) => {
                return label.replace(regexSearch, "<strong>$&</strong>");
            });
            let listItem =
                '<p class="listview-heading no-margin" '
                    .concat(style("font-weight:400"), "> ")
                    .concat(labels[0], " </p>") +
                '<p class="listview-subheading no-margin" '
                    .concat(style(), ">")
                    .concat(labels[1], "</p>");
            if (isLongLabel()) {
                for (let i = 2; i < labels.length; i++) {
                    listItem += '<p class="listview-micro" '
                        .concat(style(), ">")
                        .concat(labels[i], "</p>");
                }
            }
            const html = $("<li>")
                .attr("data-value", item.value)
                .attr("style", "padding:0.5rem; max-width:400px")
                .append(listItem)
                .appendTo(ul);
            return html;
        };
        widget.option("position", {
            my: "left top",
            at: "left bottom",
            collision: "flip",
        });
        const widgetMenu = widget.menu;
        const oldActiveClass = "ui-state-active";
        const newActiveClass = "is-selected";
        widgetMenu.element.addClass(["listview"]);
        widgetMenu._addClass = function(u: any, v: any, C: any) {
            if (C?.includes(oldActiveClass)) {
                C = C.replace(oldActiveClass, newActiveClass);
                u = this.active ?? this.element.children().first();
            }
            return this._toggleClass(u, v, C, !0);
        };
        widgetMenu._removeClass = function(u: any, v: any, C: any) {
            if (C?.includes(oldActiveClass)) {
                C = C.replace(oldActiveClass, newActiveClass);
                u = this.element.children(".".concat(newActiveClass));
            }
            return this._toggleClass(u, v, C, !1);
        };
        return widget;
    }

    private createRequest(
        searchTerm: string,
        program: string,
        transaction: string,
        searchCriteria: string[]
    ): MIRequest {
        const searchQuery = this.generateSearchQuery(searchTerm, searchCriteria);
        const request = new MIRequest();
        request.program = program;
        request.transaction = transaction;
        request.maxReturnedRecords = 100;
        request.outputFields = searchCriteria;
        request.record = {
            SQRY: searchQuery,
        };
        const CONO = ScriptUtil.GetUserContext("CurrentCompany");
        const DIVI = ScriptUtil.GetUserContext("CurrentDivision");
        if (program === "CMS100MI") {
            return request;
        } else if (program === "MDBREADMI") {
            switch (transaction) {
                case "LstCMNUSR00-IES":
                    break;
                case "LstFCHACC00-IES":
                    if (searchCriteria.length === 3) {
                        const [first, second, third] = searchCriteria;
                        const newSearchQuery = this.generateSearchQuery(searchTerm, [
                            first,
                            second,
                        ]);
                        request.record.SQRY = "CONO: "
                            .concat(CONO, " DIVI: ")
                            .concat(DIVI, " AND AITP:")
                            .concat(third, " AND (")
                            .concat(newSearchQuery, ")");
                    } else {
                        request.record.SQRY = "CONO: "
                            .concat(CONO, " DIVI: ")
                            .concat(DIVI, " AND AITP:1 AND (")
                            .concat(searchQuery, ")");
                    }
                    break;
                default:
                    request.record.SQRY = "CONO: "
                        .concat(CONO, " AND (")
                        .concat(searchQuery, ")");
                    break;
            }
            return request;
        } else {
            return request;
        }
    }

    private getDataGridInputFieldById(id: string): JQuery | null {
        const grid = this.controller.GetGrid();
        if (!grid) {
            return null;
        }
        const columns = grid.getColumns();
        const column = columns.find((column: any) => {
            if (!column.hasPosField) {
                return false;
            }
            if (column.positionField.name === id || column.name === id) {
                return true;
            }
        });
        if (column) {
            this.log.Debug(
                "Column found! Using positionField.name: ".concat(
                    column.positionField.name
                )
            );
            const fieldName = column.positionField.name;
            const $input = $(
                grid.getPosFieldElement(fieldName)?.shadowRoot?.querySelector("input")
                ?? grid.getPosFieldElement(fieldName)
            );
            if ($input.length === 0) {
                return null;
            }
            return $input;
        } else {
            this.log.Error("No column found matching: ".concat(id));
            return null;
        }
    }

    private transformSearchCriteria(searchCriteria: string[]): string[] {
        return searchCriteria.map((item: string) => {
            if (item.length > 4) {
                return item.slice(-4);
            }
            return item;
        });
    }

    private generateSearchQuery(query: string, searchCriteria: string[]): string {
        const trimmedSearchCriteria = this.transformSearchCriteria(searchCriteria);
        const keywords = query.split(" ");
        // Generate the query string dynamically, only allowing keyword prefix
        const queryString = trimmedSearchCriteria
            .map((field: string) => {
                return keywords
                    .map((keyword: string) => {
                        return "(".concat(field, ": ").concat(keyword, "*)");
                    })
                    .join(" OR ");
            })
            .join(" OR ");
        return queryString;
    }

    /********* Helper function to parse response.  *********/
    private parseResponse(response: IMIResponse): any[] {
        const items = response.items;
        if (items?.length === 0) {
            return [];
        }
        return items;
    }

    /**
     * Helper function to transform response.
     * [{"OKCUNO": "a", "OKCUNM": "b", "OKTOWN": "c"}]
     * Becomes:
     * [{value: "a", "label": "a --- b --- c"}]
     */
    private transformResponse(response: any[]): Array<{ label: string; value: any }> {
        return response.map((record: any) => {
            const key = Object.values(record)[0];
            const value = Object.values(record).join(" --- ");
            return {
                label: value,
                value: key,
            };
        });
    }

    /***** Apply a custom filtering on the result from M3 API. *****/
    private filterSearch(
        searchTerm: string,
        result: Array<{ value: string; label: string }>
    ): Array<{ value: string; label: string }> {
        const terms = searchTerm.replace(/\*/g, "").split(" ").filter(Boolean);
        return result.filter(({ value, label }) => {
            return terms.every((searchTerm: string) => {
                return (
                    value.toUpperCase().includes(searchTerm.toUpperCase()) ||
                    label.toUpperCase().includes(searchTerm.toUpperCase())
                );
            });
        });
    }

    private sortItems(a: { value: string }, b: { value: string }): number {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    }

    private isNumeric(num: string): boolean {
        return !isNaN(Number(num));
    }

    private showMessage(message: string, dialogType: string, header?: string): void {
        ConfirmDialog.ShowMessageDialog({
            header: header !== null && header !== void 0 ? header : this.scriptName,
            dialogType: dialogType,
            message: message || "default message",
        });
    }

    private translate(translation: string, stringValues?: string[]): string {
        const language = this.translations[this.language] || this.translations["GB"];
        const translatedText = language[translation] || "No translation found!";
        if (stringValues?.length) {
            const stringValuesCopy = stringValues.slice();
            const parsedString = translatedText.replace(/{}/g, () => {
                return stringValuesCopy.shift();
            });
            return parsedString;
        }
        return translatedText;
    }

    private parseArguments(scriptArguments: string): string[] {
        return scriptArguments.split(",").map((argument: string) => {
            return argument.trim();
        });
    }
};

enum DialogType {
    Question = "Question",
    Information = "Information",
    Warning = "Warning",
    Error = "Error",
}
