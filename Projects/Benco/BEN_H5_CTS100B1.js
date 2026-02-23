var BEN_H5_CTS100B1 = /** @class */ (function () {
    function BEN_H5_CTS100B1(scriptArgs) {
        this.log = scriptArgs.log;
        this.controller = scriptArgs.controller;
    }
    /**
     * Script initialization function.
     */
    BEN_H5_CTS100B1.Init = function (scriptArgs) {
        if (ScriptUtil.version >= 2.0) {
            new BEN_H5_CTS100B1(scriptArgs).run();
        } else {
            console.error("Wrong H5 version, exiting script...");
        }
    };

    BEN_H5_CTS100B1.prototype.run = function () {
        var dataGrid = this.controller.GetGrid();
        this.log.Info("Grid object: " + (dataGrid ? "exists" : "null"));
        
        if (!dataGrid) {
            this.log.Error("No grid found in this view");
            return;
        }
        
        var gridData = dataGrid.getData();
        this.log.Info("Grid data length: " + (gridData ? gridData.length : "null"));
        
        if (!gridData || gridData.length === 0) {
            this.log.Error("No data in grid");
            return;
        }
        
        // Run automatically - show tree view
        this.showTreeView(dataGrid);
        this.log.Info("Init End");
    };

    BEN_H5_CTS100B1.prototype.showTreeView = function (grid) {
        var _this = this;
        this.log.Info("showTreeView starting...");
        var data = grid.getData();
        this.log.Info("Processing " + data.length + " rows");

        // Fetch all locations first, then render grid in one operation
        var promises = data.map(function(row) {
            var ITNO = row.T8ITNO || ScriptUtil.GetFieldValue('T8ITNO');
            return _this.getWarehouseLocations('REG', ITNO).then(function(locations) {
                return { item: ITNO, locations: locations };
            });
        });

        Promise.all(promises).then(function(results) {
            _this.log.Info("All promises resolved, building grid rows");

            // Flatten into rows: one row per item+location combination
            var rows = [];
            results.forEach(function(result) {
                if (result.locations && result.locations.length) {
                    result.locations.forEach(function(loc) {
                        rows.push({
                            id: result.item + '_' + loc.WHSL,
                            ITNO: result.item,
                            WHSL: loc.WHSL,
                            STQT: loc.STQT
                        });
                    });
                } else {
                    rows.push({
                        id: result.item + '_none',
                        ITNO: result.item,
                        WHSL: '(none)',
                        STQT: ''
                    });
                }
            });

            _this.log.Info("Rendering " + rows.length + " rows in dialog");
            _this.showDialog(rows);
            _this.log.Info("Done");
        }).catch(function(error) {
            _this.log.Error("Error building grid: " + JSON.stringify(error));
        });
    };

    BEN_H5_CTS100B1.prototype.showDialog = function (rows) {
        var tableHtml = '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
        tableHtml += '<thead><tr style="background:#1b5e82;color:#fff;">';
        tableHtml += '<th style="padding:8px;text-align:left;">Item Number</th>';
        tableHtml += '<th style="padding:8px;text-align:left;">Location</th>';
        tableHtml += '<th style="padding:8px;text-align:right;">On Hand</th>';
        tableHtml += '</tr></thead><tbody>';
        var lastItem = '';
        rows.forEach(function (row, i) {
            var bg = (i % 2 === 0) ? '#ffffff' : '#f5f5f5';
            tableHtml += '<tr style="background:' + bg + ';">';
            tableHtml += '<td style="padding:6px 8px;border-bottom:1px solid #e0e0e0;">' +
                (row.ITNO !== lastItem ? '<strong>' + row.ITNO + '</strong>' : '') + '</td>';
            tableHtml += '<td style="padding:6px 8px;border-bottom:1px solid #e0e0e0;">' + row.WHSL + '</td>';
            tableHtml += '<td style="padding:6px 8px;border-bottom:1px solid #e0e0e0;text-align:right;">' + row.STQT + '</td>';
            tableHtml += '</tr>';
            lastItem = row.ITNO;
        });
        tableHtml += '</tbody></table>';

        var dialogContent = $('<div style="padding:10px;max-height:500px;overflow-y:auto;">' + tableHtml + '</div>');

        var dialogOptions = {
            title: 'REG Warehouse Locations',
            dialogType: 'General',
            modal: false,
            width: 500,
            minHeight: 200,
            closeOnEscape: true,
            close: function () { dialogContent.remove(); },
            buttons: [{
                text: 'Close',
                isDefault: true,
                width: 80,
                click: function (event, model) { model.close(); }
            }]
        };
        H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        this.log.Info("Dialog shown with " + rows.length + " rows");
    };

    BEN_H5_CTS100B1.prototype.getWarehouseLocations = function(WHLO, ITNO) {
        var request = {
            program: 'MMS060MI',
            transaction: 'LstSumQty',
            record: {
                WHLO: WHLO,
                ITNO: ITNO
            },
            maxReturnedRecords: 50,
            outputFields: ['WHSL', 'STQT']
        };
        return this.createRequest(request).then(function(response) {
            if (response && response.items) {
                return response.items.map(function(item) {
                    return {
                        WHSL: item.WHSL,
                        STQT: item.STQT
                    };
                });
            }
            return [];
        });
    };
    BEN_H5_CTS100B1.prototype.createRequest = function (request) {
        return MIService.Current.executeRequestV2(request)
            .then(function (response) {
                if (response.errorCode) {
                    throw response;
                }
                if (response.items) {
                    return response;
                } else {
                    return null;
                }
            })
            .catch(function (err) {
                return Promise.reject(err);
            });
    };

    return BEN_H5_CTS100B1;
}());