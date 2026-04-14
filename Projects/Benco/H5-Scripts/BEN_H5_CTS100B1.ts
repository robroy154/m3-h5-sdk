var BEN_H5_CTS100B1 = class {

    private log: IScriptLog;
    private controller: IInstanceController;
    private miService: any; // MIService (v2+) or MIService.Current instance (v1) — TODO: tighten type

    constructor(scriptArgs: IScriptArgs) {
        this.log = scriptArgs.log;
        this.controller = scriptArgs.controller;
        this.miService = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
    }

    /**
     * Script initialization function.
     */
    public static Init(scriptArgs: IScriptArgs): void {
        if (ScriptUtil.version >= 2.0) {
            new BEN_H5_CTS100B1(scriptArgs).run();
        } else {
            console.error("Wrong H5 version, exiting script...");
        }
    }

    private run(): void {
        const dataGrid = this.controller.GetGrid();
        this.log.Info("Grid object: " + (dataGrid ? "exists" : "null"));

        if (!dataGrid) {
            this.log.Error("No grid found in this view");
            return;
        }

        const gridData = dataGrid.getData();
        this.log.Info("Grid data length: " + (gridData ? gridData.length : "null"));

        if (!gridData || gridData.length === 0) {
            this.log.Error("No data in grid");
            return;
        }

        // Run automatically - show tree view
        this.showTreeView(dataGrid);
        this.log.Info("Init End");
    }

    private showTreeView(grid: IActiveGrid): void {
        this.log.Info("showTreeView starting...");
        const data = grid.getData();
        this.log.Info("Processing " + data.length + " rows");

        // Fetch all locations first, then render grid in one operation
        const promises = data.map((row: any) => {
            const ITNO: string = row.T8ITNO || ScriptUtil.GetFieldValue('T8ITNO');
            return this.getWarehouseLocations('REG', ITNO).then((locations: Array<{ WHSL: string; STQT: string }>) => {
                return { item: ITNO, locations: locations };
            });
        });

        Promise.all(promises).then(
            (results: Array<{ item: string; locations: Array<{ WHSL: string; STQT: string }> }>) => {
                this.log.Info("All promises resolved, building grid rows");

                // Flatten into rows: one row per item+location combination
                const rows: Array<{ id: string; ITNO: string; WHSL: string; STQT: string }> = [];
                results.forEach((result) => {
                    if (result.locations && result.locations.length) {
                        result.locations.forEach((loc) => {
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

                this.log.Info("Rendering " + rows.length + " rows in dialog");
                this.showDialog(rows);
                this.log.Info("Done");
            },
            (error: any) => {
                this.log.Error("Error building grid: " + JSON.stringify(error));
            }
        );
    }

    private showDialog(rows: Array<{ id: string; ITNO: string; WHSL: string; STQT: string }>): void {
        let tableHtml = '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
        tableHtml += '<thead><tr style="background:#1b5e82;color:#fff;">';
        tableHtml += '<th style="padding:8px;text-align:left;">Item Number</th>';
        tableHtml += '<th style="padding:8px;text-align:left;">Location</th>';
        tableHtml += '<th style="padding:8px;text-align:right;">On Hand</th>';
        tableHtml += '</tr></thead><tbody>';
        let lastItem = '';
        rows.forEach((row, i) => {
            const bg = (i % 2 === 0) ? '#ffffff' : '#f5f5f5';
            tableHtml += '<tr style="background:' + bg + ';">';
            tableHtml += '<td style="padding:6px 8px;border-bottom:1px solid #e0e0e0;">' +
                (row.ITNO !== lastItem ? '<strong>' + row.ITNO + '</strong>' : '') + '</td>';
            tableHtml += '<td style="padding:6px 8px;border-bottom:1px solid #e0e0e0;">' + row.WHSL + '</td>';
            tableHtml += '<td style="padding:6px 8px;border-bottom:1px solid #e0e0e0;text-align:right;">' + row.STQT + '</td>';
            tableHtml += '</tr>';
            lastItem = row.ITNO;
        });
        tableHtml += '</tbody></table>';

        const dialogContent = $('<div style="padding:10px;max-height:500px;overflow-y:auto;">' + tableHtml + '</div>');

        const dialogOptions = {
            title: 'REG Warehouse Locations',
            dialogType: 'General',
            modal: false,
            width: 500,
            minHeight: 200,
            closeOnEscape: true,
            close: () => { dialogContent.remove(); },
            buttons: [{
                text: 'Close',
                isDefault: true,
                width: 80,
                click: (event: any, model: any) => { model.close(); }
            }]
        };
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        } else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
        this.log.Info("Dialog shown with " + rows.length + " rows");
    }

    private getWarehouseLocations(WHLO: string, ITNO: string): Promise<Array<{ WHSL: string; STQT: string }>> {
        const request: IMIRequest = {
            program: 'MMS060MI',
            transaction: 'LstSumQty',
            record: {
                WHLO: WHLO,
                ITNO: ITNO
            },
            maxReturnedRecords: 50,
            outputFields: ['WHSL', 'STQT']
        };
        return this.createRequest(request).then((response: IMIResponse) => {
            if (response.items) {
                return response.items.map((item: any) => ({
                    WHSL: item.WHSL,
                    STQT: item.STQT
                }));
            }
            return [];
        });
    }

    private createRequest(request: IMIRequest): Promise<IMIResponse> {
        return this.miService.executeRequestV2(request)
            .then(
                (response: IMIResponse) => {
                    if (response.hasError()) {
                        throw response;
                    }
                    return response;
                },
                (error: IMIResponse) => {
                    throw error;
                }
            );
    }
};
