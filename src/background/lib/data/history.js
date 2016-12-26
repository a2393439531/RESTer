(function () {

    window.rester = window.rester || {};
    rester.data = rester.data || {};
    rester.data.history = {};


    const db = rester.data.utils.db;

    /**
     * @typedef HistoryEntry
     * @type {Object}
     * @property {Number} id - The id of the history entry.
     * @property {Date} time - The time at which the request has started.
     * @property {Date} timeEnd - The time at which the request has finished.
     * @property {Request} request - The executed request.
     * @property {Response} response - The response.
     */
    rester.data.history.HistoryEntry = HistoryEntry;
    function HistoryEntry(dbObject) {
        if (dbObject) {
            Object.assign(this, dbObject);

            this.request = new rester.data.requests.Request(dbObject.request);
            this.response = new rester.data.responses.Response(dbObject.response);
        } else {
            this.time = 0;
            this.timeEnd = 0;
            this.request = null;
            this.response = null;
        }
    }

    /**
     * Adds a new history entry to the database. If this entry is not unique
     * an exception is thrown.
     *
     * @param {HistoryEntry} entry - The new history entry.
     * @returns {Promise.<Number>} A promise, which gets resolved, when the entry
     * was successfully saved and returns the new history entry íd.
     */
    rester.data.history.add = function (entry) {
        entry = new HistoryEntry(entry);
        return db.transaction(['history'], 'readwrite', objectStores => {
            return db.addEntityAndUpdateId(objectStores[0], entry);
        });
    };

    /**
     * Return the full history entry object for the specified key.
     *
     * @param {Number} id - The id of the history entry.
     * @returns {Promise.<HistoryEntry>} A promise which returns a the
     * full history entry object when resolved.
     */
    rester.data.history.get = function (id) {
        return db.transaction(['history'], 'readonly', objectStores => {
            return db.getEntity(objectStores[0], id, HistoryEntry);
        });
    };

    /**
     * Returns all history entries, including only a subset of all properties.
     *
     * @param {Number=0} top - When specified, the method only returns this amount
     * of newest items.
     * @returns {Promise.<Array<HistoryEntry>>} A promise which returns
     * a list of history entries when resolved.
     */
    rester.data.history.query = function (top) {
        return db.transaction(['history'], 'readonly', objectStores => {
            return db.getAllEntities(objectStores[0], null, HistoryEntry, top);
        });
    };

    /**
     * Deletes an existing history entry from the database.
     *
     * @param {Number} id - The id of the history entry.
     * @returns {Promise} A promise which gets resolved, when the entry was
     * successfully deleted.
     */
    rester.data.history.delete = function (id) {
        const entry = new HistoryEntry();
        entry.id = id;

        return db.transaction(['history'], 'readwrite', objectStores => {
            return db.deleteEntity(objectStores[0], entry);
        });
    };

})();