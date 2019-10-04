sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "jquery.sap.storage"
], function (JSONModel, jQuery) {
    "use strict";

    return JSONModel.extend("templateHackaton.shared.model.LocalStorageModel", {
        constructor,
        setProperty,
        setData,
        refresh,
        _storage: jQuery.sap.storage(jQuery.sap.storage.Type.local),
        _STORAGE_KEY: "templateHackaton_MODEL"
    });



    /**
     * Fetches the favorites from local storage and sets up the JSON model
     * By default the string "LOCALSTORAGE_MODEL" is used but it is recommended to set a custom key
     * to avoid name clashes with other apps or other instances of this model class

     * @param {string} sStorageKey storage key that will be used as an id for the local storage data
     * @param {Object} oSettings settings objec that is passed to the JSON model constructor
     * @return {shared.model.LocalModel} the local storage model instance
     */
    function constructor(sStorageKey, oSettings) {
        // call super constructor with everything from the second argument
        JSONModel.apply(this, [].slice.call(arguments, 1));
        this.setSizeLimit(1000000);

        // override default storage key
        if (sStorageKey) {
            this._STORAGE_KEY = sStorageKey;
        }

        // load data from local storage
        _loadData.call(this);

        return this;
    }

    /**
     * Loads the current state of the model from local storage
     */
    function _loadData() {
        var sJSON = this._storage.get(this._STORAGE_KEY);

        if (sJSON) {
            this.setData(JSON.parse(sJSON));
        }
        this._bDataLoaded = true;
    }

    /**
     * Saves the current state of the model to local storage
     */
    function _storeData() {
        var oData = this.getData();

        // update local storage with current data
        var sJSON = JSON.stringify(oData);
        this._storage.put(this._STORAGE_KEY, sJSON);
    }

    /**
     * Sets a property for the JSON model
     * @override
     */
    function setProperty() {
        JSONModel.prototype.setProperty.apply(this, arguments);
        _storeData.call(this);
    }

    /**
     * Sets the data for the JSON model
     * @override
     */
    function setData() {
        JSONModel.prototype.setData.apply(this, arguments);
        // called from constructor: only store data after first load
        if (this._bDataLoaded) {
            _storeData.call(this);
        }
    }

    /**
     * Refreshes the model with the current data
     * @override
     */
    function refresh() {
        JSONModel.prototype.refresh.apply(this, arguments);
        _storeData.call(this);
    }
});
