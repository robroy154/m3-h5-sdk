/* -------------------------------------------- Running Script Version 08182025.1 --------------------------------------------
|
|       Script name: BEN_H5_AutoComplete
|       Script Argument: OACUNO,CRS610MI,SearchCustomer,RESP,CUNM,CUNO
|       Screen: OIS100
|
|       Description: Use this script in any M3 program with an input field to configure it as an autocomplete searchfield.
|
| -------------------------------------------- Running Script Version 04232025.2 -------------------------------------------- */
var BEN_H5_AutoComplete = /** @class */ (function () {
  function BEN_H5_AutoComplete(scriptArgs) {
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
    this.element = scriptArgs.elem;
  }
  BEN_H5_AutoComplete.Init = function (scriptArgs) {
    new BEN_H5_AutoComplete(scriptArgs).run();
  };
  BEN_H5_AutoComplete.prototype.run = function () {
    this.log.Info("Running script: ".concat(this.scriptName));
    //  Parse user supplied script arguments
    var scriptArguments = this.parseArguments(this.args);
    // Validate script arguments
    var numberOfArguments = scriptArguments.length;
    if (numberOfArguments < 4) {
      return this.showMessage(
        ""
          .concat(this.translate("argumentsNoData"), " ")
          .concat(numberOfArguments),
        DialogType.Error
      );
    }
    // Extract script arguments
    var searchField = scriptArguments[0],
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
    var lastArgument = searchCriteria.slice(-1)[0];
    // Check if last argument in searchCriteria is a number,
    // if it is a number user we know this is the "widgetHeight" argument.
    if (this.isNumeric(lastArgument)) {
      this.searchfieldOptions.Height = searchCriteria.pop();
    }
    this.$searchField = this.initializeSearchFieldComponent(
      this.searchfieldOptions
    );
    var widget = this.setupWidget(
      this.$searchField,
      this.transactionOptions,
      this.searchfieldOptions.Height
    );
    this.addEvents(searchField, widget);
  };
  BEN_H5_AutoComplete.prototype.initializeSearchFieldComponent = function (
    searchFieldOptions
  ) {
    var $searchField = this.controller.GetElement(searchFieldOptions.Element);
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
  };
  BEN_H5_AutoComplete.prototype.addEvents = function (searchField, widget) {
    var _this = this;
    var unsubscribeRequesting = this.controller.Requesting.On(function (args) {
      _this.log.Debug(
        "Event: Requesting, Command type: "
          .concat(args.commandType, ", Command value: ")
          .concat(args.commandValue)
      );
      if (args.commandType === "KEY" && args.commandValue === "ENTER") {
        // Check if the current field that has focus is equal to the user supplied "searchField"
        // @ts-expect-error: The attribute "focusField" is not documented, may change in the future.
        var isFocused = _this.controller.focusField === searchField;
        var isOpen = widget.menu.element.is(":visible");
        if (isFocused && isOpen) {
          _this.log.Debug(
            "Canceling ENTER request --> widget menu is open and ".concat(
              searchField,
              " has focus"
            )
          );
          args.cancel = true;
        }
      }
    });
    var unsubscribeRequested = this.controller.Requested.On(function (args) {
      _this.log.Debug(
        "Event: Requested, Command type: "
          .concat(args.commandType, ", Command value: ")
          .concat(args.commandValue, ". Destroying autocomplete widget.")
      );
      unsubscribeRequesting();
      unsubscribeRequested();
      widget.destroy();
      /***************** Initialize autocomplete component on page loading/scroll down event *****************/
      if (args.commandType == "PAGE" && args.commandValue == "DOWN") {
        _this.log.Info("Reinitializing Autocomplete widget component");
        setTimeout(function () {
          _this.$searchField = _this.initializeSearchFieldComponent(
            _this.searchfieldOptions
          );
          widget = _this.setupWidget(
            _this.$searchField,
            _this.transactionOptions,
            _this.searchfieldOptions.Height
          );
        }, 5);
      }
    });
  };
  BEN_H5_AutoComplete.prototype.setupWidget = function (
    element,
    transactionOptions,
    widgetHeight
  ) {
    element.keydown(function (event) {
      var _a;
      var isOpen = widget.menu.element.is(":visible");
      if (isOpen) {
        if (
          event.which === 37 ||
          event.which === 39 ||
          (event.which === 38 &&
            ((_a = widget.menu.active) === null || _a === void 0
              ? void 0
              : _a.index()) === 0)
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
    var options = this.defineSearchOptions(element, transactionOptions);
    // Development has overriden the autocomplete widget with custom logic.
    // To avoid this we use the native jquery ui implementation of autocomplete.
    //@ts-expect-error: We know $.ui exists and is bundled.
    var widget = $.ui.autocomplete(options, element);
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
  };
  BEN_H5_AutoComplete.prototype.defineSearchOptions = function (
    element,
    transactionOptions
  ) {
    var _this = this;
    return {
      autoFocus: false,
      delay: 300,
      minLength: 1,
      source: function (search, response) {
        var searchTerm = search.term.toUpperCase();
        if (searchTerm in _this.cacheSelectedItems) {
          _this.log.Debug(
            "searchTerm : ".concat(
              searchTerm,
              " exists in selected items cache return previous result"
            )
          );
          return response(_this.cache[_this.cacheSelectedItems[searchTerm]]);
        }
        if (searchTerm in _this.cache) {
          _this.log.Debug(
            "searchTerm : ".concat(
              searchTerm,
              " exists in cache returning cached result"
            )
          );
          return response(_this.cache[searchTerm]);
        }
        _this.currentSearchTerm = searchTerm;
        var request = _this.createRequest(
          searchTerm,
          transactionOptions.program,
          transactionOptions.transaction,
          transactionOptions.SQRY
        );
        return MIService.Current.executeRequestV2(request)
          .then(function (miResponse) {
            if (miResponse.hasError()) {
              var message =
                miResponse.errorMessage || _this.translate("unknownError");
              _this.showMessage(message, DialogType.Error);
              return;
            }
            var parsedResult = _this.parseResponse(miResponse);
            var transformedResult = _this.transformResponse(parsedResult);
            var result = _this.filterSearch(searchTerm, transformedResult);
            result.sort(_this.sortItems);
            _this.cache[searchTerm] = result;
            return response(result);
          })
          .catch(function (err) {
            var errorMsg = _this.translate("unknownError");
            if (err.error) {
              errorMsg = ""
                .concat(err.error.terminationErrorType, ": ")
                .concat(err.error.terminationReason);
            }
            _this.showMessage(errorMsg, DialogType.Error);
            return response();
          });
      },
      focus: function () {
        return false; // Prevent autocomplete from updating the value of the textbox with the current focused item
      },
      select: function (_event, ui) {
        var _a = ui.item,
          _label = _a._label,
          value = _a.value;
        _this.cacheSelectedItems[value] = _this.currentSearchTerm;
        var elementId = element.attr("id");
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
  };
  BEN_H5_AutoComplete.prototype.getFontSizeFromInput = function () {
    return this.searchfieldOptions
      ? $("input#".concat(this.searchfieldOptions.Element, " ")).css(
          "font-size"
        ) || "14px"
      : "14px";
  };
  BEN_H5_AutoComplete.prototype.extendWidget = function (widget) {
    var _this = this;
    var getFontSize = function () {
      return _this.getFontSizeFromInput();
    };
    widget._renderItem = function (ul, item) {
      var isLongLabel = function () {
        return labels.length >= 3;
      };
      var style = function (extra) {
        if (extra === void 0) {
          extra = "";
        }
        return 'style = "font-size:'
          .concat(getFontSize(), "; ")
          .concat(extra, '"');
      };
      var termArray = this.term.split(" ");
      var regexSearch = new RegExp(termArray.join("|"), "gi");
      var labels = item.label.split(" --- ").map(function (label) {
        return label.replace(regexSearch, "<strong>$&</strong>");
      });
      var listItem =
        '<p class="listview-heading no-margin" '
          .concat(style("font-weight:400"), "> ")
          .concat(labels[0], " </p>") +
        '<p class="listview-subheading no-margin" '
          .concat(style(), ">")
          .concat(labels[1], "</p>");
      if (isLongLabel()) {
        for (var i = 2; i < labels.length; i++) {
          listItem += '<p class="listview-micro" '
            .concat(style(), ">")
            .concat(labels[i], "</p>");
        }
      }
      var html = $("<li>")
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
    var widgetMenu = widget.menu;
    var oldActiveClass = "ui-state-active";
    var newActiveClass = "is-selected";
    widgetMenu.element.addClass(["listview"]);
    widgetMenu._addClass = function (u, v, C) {
      var _a;
      if (C === null || C === void 0 ? void 0 : C.includes(oldActiveClass)) {
        C = C.replace(oldActiveClass, newActiveClass);
        u =
          (_a = this.active) !== null && _a !== void 0
            ? _a
            : this.element.children().first();
      }
      return this._toggleClass(u, v, C, !0);
    };
    widgetMenu._removeClass = function (u, v, C) {
      if (C === null || C === void 0 ? void 0 : C.includes(oldActiveClass)) {
        C = C.replace(oldActiveClass, newActiveClass);
        u = this.element.children(".".concat(newActiveClass));
      }
      return this._toggleClass(u, v, C, !1);
    };
    return widget;
  };
  BEN_H5_AutoComplete.prototype.createRequest = function (
    searchTerm,
    program,
    transaction,
    searchCriteria
  ) {
    var searchQuery = this.generateSearchQuery(searchTerm, searchCriteria);
    var request = new MIRequest();
    request.program = program;
    request.transaction = transaction;
    request.maxReturnedRecords = 100;
    request.outputFields = searchCriteria;
    request.record = {
      SQRY: searchQuery,
    };
    var CONO = ScriptUtil.GetUserContext("CurrentCompany");
    var DIVI = ScriptUtil.GetUserContext("CurrentDivision");
    if (program === "CMS100MI") {
      return request;
    } else if (program === "MDBREADMI") {
      switch (transaction) {
        case "LstCMNUSR00-IES":
          break;
        case "LstFCHACC00-IES":
          if (searchCriteria.length === 3) {
            var first = searchCriteria[0],
              second = searchCriteria[1],
              third = searchCriteria[2];
            var newSearchQuery = this.generateSearchQuery(searchTerm, [
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
  };
  BEN_H5_AutoComplete.prototype.getDataGridInputFieldById = function (id) {
    var _a, _b, _c;
    var grid = this.controller.GetGrid();
    if (!grid) {
      return null;
    }
    var columns = grid.getColumns();
    var column = columns.find(function (column) {
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
      var fieldName = column.positionField.name;
      var $input = $(
        (_c =
          (_b =
            (_a = grid.getPosFieldElement(fieldName)) === null || _a === void 0
              ? void 0
              : _a.shadowRoot) === null || _b === void 0
            ? void 0
            : _b.querySelector("input")) !== null && _c !== void 0
          ? _c
          : grid.getPosFieldElement(fieldName)
      );
      if ($input.length === 0) {
        return null;
      }
      return $input;
    } else {
      this.log.Error("No column found matching: ".concat(id));
      return null;
    }
  };
  BEN_H5_AutoComplete.prototype.transformSearchCriteria = function (
    searchCriteria
  ) {
    return searchCriteria.map(function (item) {
      if (item.length > 4) {
        return item.slice(-4);
      }
      return item;
    });
  };
  BEN_H5_AutoComplete.prototype.generateSearchQuery = function (
    query,
    searchCriteria
  ) {
    var trimmedSearchCriteria = this.transformSearchCriteria(searchCriteria);
    var keywords = query.split(" ");
    // Generate the query string dynamically, only allowing keyword prefix
    var queryString = trimmedSearchCriteria
      .map(function (field) {
        return keywords
          .map(function (keyword) {
            return "(".concat(field, ": ").concat(keyword, "*)");
          })
          .join(" OR ");
      })
      .join(" OR ");
    return queryString;
  };
  /********* Helper function to parse response.  *********/
  BEN_H5_AutoComplete.prototype.parseResponse = function (response) {
    var items = response.items;
    if ((items === null || items === void 0 ? void 0 : items.length) === 0) {
      return [];
    }
    return items;
  };
  /**
   * Helper function to transform response.
   * [{"OKCUNO": "a", "OKCUNM": "b", "OKTOWN": "c"}]
   * Becomes:
   * [{value: "a", "label": "a --- b --- c"}]
   */
  BEN_H5_AutoComplete.prototype.transformResponse = function (response) {
    return response.map(function (record) {
      var key = Object.values(record)[0];
      var value = Object.values(record).join(" --- ");
      return {
        label: value,
        value: key,
      };
    });
  };
  /***** Apply a custom filtering on the result from M3 API. *****/
  BEN_H5_AutoComplete.prototype.filterSearch = function (searchTerm, result) {
    var terms = searchTerm.replace(/\*/g, "").split(" ").filter(Boolean);
    return result.filter(function (_a) {
      var value = _a.value,
        label = _a.label;
      return terms.every(function (searchTerm) {
        return (
          value.toUpperCase().includes(searchTerm.toUpperCase()) ||
          label.toUpperCase().includes(searchTerm.toUpperCase())
        );
      });
    });
  };
  BEN_H5_AutoComplete.prototype.sortItems = function (a, b) {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    return 0;
  };
  BEN_H5_AutoComplete.prototype.isNumeric = function (num) {
    return !isNaN(Number(num));
  };
  BEN_H5_AutoComplete.prototype.showMessage = function (
    message,
    dialogType,
    header
  ) {
    ConfirmDialog.ShowMessageDialog({
      header: header !== null && header !== void 0 ? header : this.scriptName,
      dialogType: dialogType,
      message: message || "default message",
    });
  };
  BEN_H5_AutoComplete.prototype.translate = function (
    translation,
    stringValues
  ) {
    var language = this.translations[this.language] || this.translations["GB"];
    var translatedText = language[translation] || "No translation found!";
    if (
      stringValues === null || stringValues === void 0
        ? void 0
        : stringValues.length
    ) {
      var stringValuesCopy_1 = stringValues.slice();
      var parsedString = translatedText.replace(/{}/g, function () {
        return stringValuesCopy_1.shift();
      });
      return parsedString;
    }
    return translatedText;
  };
  BEN_H5_AutoComplete.prototype.parseArguments = function (scriptArguments) {
    return scriptArguments.split(",").map(function (argument) {
      return argument.trim();
    });
  };
  return BEN_H5_AutoComplete;
})();
var DialogType;
(function (DialogType) {
  DialogType["Question"] = "Question";
  DialogType["Information"] = "Information";
  DialogType["Warning"] = "Warning";
  DialogType["Error"] = "Error";
})(DialogType || (DialogType = {}));
//# sourceMappingURL=BEN_H5_AutoComplete.js.map
