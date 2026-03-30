var AddLotControlColumn = class {

    // Max concurrent MI requests per batch — prevents overwhelming M3's API on large lists
    static get BATCH_SIZE() { return 10; }

    constructor(scriptArgs) {
        this.scriptName = 'AddLotControlColumn';
        this.columnId = 'C_LotControl';
        this.columnHeader = 'Lot Control';
        this.columnWidth = 100;
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
        // Cache ITNO → formatted label so repeated items only hit the API once
        this.indiCache = new Map();
        this.unsubscribeEvents = null;
    }

    static Init(scriptArgs) {
        try {
            new AddLotControlColumn(scriptArgs).run();
        } catch (error) {
            scriptArgs.log.Error('AddLotControlColumn initialization failed: ' + (error.message || error));
        }
    }

    run() {
        this.log.Info('Running script: ' + this.scriptName);

        const list = this.controller.GetGrid();
        if (!list) {
            this.log.Warning(this.scriptName + ': No grid found on this panel — script aborted');
            return;
        }

        this.appendColumn(list);
        this.loadColumnData(list);
        this.attachEvents();
    }

    appendColumn(list) {
        const columns = list.getColumns();
        if (columns.some(col => col.id === this.columnId)) {
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
    }

    async loadColumnData(list) {
        const rows = list.getData();
        if (!rows || rows.length === 0) return;

        // Deduplicate — only fetch each unique ITNO once across the entire grid
        const uncachedItems = [...new Set(
            rows.map(row => row['S1ITNO']).filter(Boolean)
        )].filter(itno => !this.indiCache.has(itno));

        // Fetch in batches to avoid flooding M3's API (e.g. 100 rows = 10 batches of 10)
        for (let i = 0; i < uncachedItems.length; i += AddLotControlColumn.BATCH_SIZE) {
            const batch = uncachedItems.slice(i, i + AddLotControlColumn.BATCH_SIZE);
            await Promise.all(batch.map(itno => this.fetchIndi(itno)));
        }

        // Single setData call after all fetches — avoids N re-renders
        this.applyValues(list);
    }

    fetchIndi(itno) {
        const request = new MIRequest();
        request.program = 'MMS200MI';
        request.transaction = 'GetItmBasic';
        request.maxReturnedRecords = 1;
        request.outputFields = ['INDI'];
        request.record = { ITNO: itno };

        return this.mi.executeRequest(request)
            .then(response => {
                const indi = response && response.item ? response.item['INDI'] : null;
                this.indiCache.set(itno, this.formatLotControl(indi));
            })
            .catch(error => {
                this.log.Warning(this.scriptName + ': Failed to fetch INDI for ' + itno + ': ' + (error.errorMessage || error.message || error));
                this.indiCache.set(itno, 'N/A');
            });
    }

    applyValues(list) {
        const rows = list.getData();
        let changed = false;
        rows.forEach(row => {
            const itno = row['S1ITNO'];
            if (itno && this.indiCache.has(itno)) {
                row[this.columnId] = this.indiCache.get(itno);
                changed = true;
            }
        });
        if (changed) {
            list.setData(rows);
        }
    }

    formatLotControl(value) {
        switch (value) {
            case '0': return '0 - None Required';
            case '2': return '2 - Serial Number Required';
            case '3': return '3 - Lot Number Required';
            default:  return value || 'N/A';
        }
    }

    attachEvents() {
        this.unsubscribeEvents = this.controller.RequestCompleted.On(e => {
            try {
                const list = this.controller.GetGrid();
                if (!list) return;

                if (e.commandType === 'PAGE' && e.commandValue === 'DOWN') {
                    // New rows added on scroll — populate newly visible rows
                    this.loadColumnData(list);
                } else if (e.commandType === 'SEARCH') {
                    // Grid rebuilt after search — re-append column then refill
                    setTimeout(() => {
                        const refreshed = this.controller.GetGrid();
                        if (refreshed) {
                            this.appendColumn(refreshed);
                            this.loadColumnData(refreshed);
                        }
                    }, 300);
                } else if (e.commandType === 'SELECT') {
                    // User navigated into a record — clean up to avoid leaks
                    this.detachEvents();
                }
            } catch (err) {
                this.log.Error(this.scriptName + ': Event handler error: ' + (err.message || err));
            }
        });
    }

    detachEvents() {
        if (this.unsubscribeEvents) {
            try { this.unsubscribeEvents(); } catch (e) { /* ignore */ }
            this.unsubscribeEvents = null;
        }
    }
};
