"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var AddLotControlColumn_v2 = /** @class */ (function () {
    function class_1(scriptArgs) {
        this.scriptName = 'AddLotControlColumn_v2';
        this.columnId = 'C_LotControl';
        this.columnHeader = 'Lot Control';
        this.columnWidth = 100;
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
        this.indiCache = new Map();
        this.unsubscribeEvents = null;
    }
    Object.defineProperty(class_1, "BATCH_SIZE", {
        // Max concurrent MI requests per batch — prevents overwhelming M3's API on large lists
        get: function () { return 10; },
        enumerable: false,
        configurable: true
    });
    class_1.Init = function (scriptArgs) {
        try {
            new AddLotControlColumn_v2(scriptArgs).run();
        }
        catch (error) {
            scriptArgs.log.Error('AddLotControlColumn_v2 initialization failed: ' + (error.message || error));
        }
    };
    class_1.prototype.run = function () {
        this.log.Info('Running script: ' + this.scriptName);
        var list = this.controller.GetGrid();
        if (!list) {
            this.log.Warning(this.scriptName + ': No grid found on this panel — script aborted');
            return;
        }
        this.appendColumn(list);
        this.loadColumnData(list);
        this.attachEvents();
    };
    class_1.prototype.appendColumn = function (list) {
        var _this = this;
        var columns = list.getColumns();
        if (columns.some(function (col) { return col.id === _this.columnId; })) {
            return;
        }
        columns.push({
            id: this.columnId,
            field: this.columnId,
            name: this.columnHeader,
            width: this.columnWidth,
            columnType: 'TEXT'
        });
        list.setColumns(columns);
    };
    class_1.prototype.loadColumnData = function (list) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, uncachedItems, i, batch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = list.getData();
                        if (!rows || rows.length === 0)
                            return [2 /*return*/];
                        uncachedItems = __spreadArray([], __read(new Set(rows.map(function (row) { return row['S1ITNO']; }).filter(Boolean))), false).filter(function (itno) { return !_this.indiCache.has(itno); });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < uncachedItems.length)) return [3 /*break*/, 4];
                        batch = uncachedItems.slice(i, i + AddLotControlColumn_v2.BATCH_SIZE);
                        return [4 /*yield*/, Promise.all(batch.map(function (itno) { return _this.fetchIndi(itno); }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i += AddLotControlColumn_v2.BATCH_SIZE;
                        return [3 /*break*/, 1];
                    case 4:
                        // Single setData call after all fetches — avoids N re-renders
                        this.applyValues(list);
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.fetchIndi = function (itno) {
        var _this = this;
        var request = new MIRequest();
        request.program = 'MMS200MI';
        request.transaction = 'GetItmBasic';
        request.maxReturnedRecords = 1;
        request.outputFields = ['INDI'];
        request.record = { ITNO: itno };
        return this.mi.executeRequest(request)
            .then(function (response) {
            var indi = response && response.item ? response.item['INDI'] : null;
            _this.indiCache.set(itno, _this.formatLotControl(indi));
        }, function (error) {
            _this.log.Warning(_this.scriptName + ': Failed to fetch INDI for ' + itno + ': ' + (error.errorMessage || error.error || error));
            _this.indiCache.set(itno, 'N/A');
        });
    };
    class_1.prototype.applyValues = function (list) {
        var _this = this;
        var rows = list.getData();
        var changed = false;
        rows.forEach(function (row) {
            var itno = row['S1ITNO'];
            if (itno && _this.indiCache.has(itno)) {
                row[_this.columnId] = _this.indiCache.get(itno);
                changed = true;
            }
        });
        if (changed) {
            list.setData(rows);
        }
    };
    class_1.prototype.formatLotControl = function (value) {
        switch (value) {
            case '0': return '0 - None Required';
            case '2': return '2 - Serial Number Required';
            case '3': return '3 - Lot Number Required';
            default: return value || 'N/A';
        }
    };
    class_1.prototype.attachEvents = function () {
        var _this = this;
        this.unsubscribeEvents = this.controller.RequestCompleted.On(function (e) {
            try {
                var list = _this.controller.GetGrid();
                if (!list)
                    return;
                if (e.commandType === 'PAGE' && e.commandValue === 'DOWN') {
                    // New rows added on scroll — populate newly visible rows
                    _this.loadColumnData(list);
                }
                else if (e.commandType === 'SEARCH') {
                    // Grid rebuilt after search — re-append column then refill
                    setTimeout(function () {
                        var refreshed = _this.controller.GetGrid();
                        if (refreshed) {
                            _this.appendColumn(refreshed);
                            _this.loadColumnData(refreshed);
                        }
                    }, 300);
                }
                else if (e.commandType === 'SELECT') {
                    // User navigated into a record — clean up to avoid leaks
                    _this.detachEvents();
                }
            }
            catch (err) {
                _this.log.Error(_this.scriptName + ': Event handler error: ' + (err.message || err));
            }
        });
    };
    class_1.prototype.detachEvents = function () {
        if (this.unsubscribeEvents) {
            try {
                this.unsubscribeEvents();
            }
            catch (e) { /* ignore */ }
            this.unsubscribeEvents = null;
        }
    };
    return class_1;
}());
//# sourceMappingURL=AddLotControlColumn_v2.js.map