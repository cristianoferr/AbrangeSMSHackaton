sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "jquery.sap.storage"
], function (JSONModel, jQuery) {
    "use strict";

    let servicePath;

    let listProperty = "lista";

    return JSONModel.extend("chatbotfrontend.shared.model.RESTModel", {
        constructor,
        setProperty,
        setData,
        refresh,
        bindList,
        create,
        read
    });

    /**
       * @param {string} sPath path do serviço
       * @param {Object} oSettings settings objec that is passed to the JSON model constructor
       * @return {shared.model.LocalModel} the local storage model instance
       */
    function constructor(sPath, oSettings) {
        // call super constructor with everything from the second argument
        JSONModel.apply(this, [].slice.call(arguments, 1));

        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            if (arg.listProperty) {
                listProperty = arg.listProperty;
            }
        }

        servicePath = sPath;

        return this;
    }

    /**
     * se chamar algo tipo '/duvida/listaDuvidas' e não existir nada em '/duvida' então a propriedade não é setada
     * @param {*} sPath 
     */
    function inicializaEstrutura(sPath) {
        if (sPath.lastIndexOf("/") > 0) {
            while (sPath.indexOf("/", 1) > 0) {
                let subPath = sPath.substr(0, sPath.indexOf("/", 1));
                if (!this.getProperty(subPath)) {
                    this.setProperty(subPath, {});
                }
                sPath = sPath.substr(0, subPath.length);

            }
        }
    }

    function create(sPath, oData, mParameters) {
        jQuery.ajax(
            {
                url: servicePath + sPath,
                type: "POST",
                data: JSON.stringify(oData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: mParameters.success,
                error: function (err) {
                    //por algum motivo está vindo do jquery com error de parse... talvez tenha que retornar algum json do serviço para evitar isso
                    if (err.status == 200) {
                        mParameters.success(err);
                    } else {
                        mParameters.error(err);
                    }
                }
            }
        );
    }

    /**
     * Faz o tratamento de parametros especificados na lista, um deles é o importJson que executa o conteudo de uma propriedade e seta o valor
     * @param data
     * @param mParameters
     */
    function trataParametersLista(data, mParameters) {
        if (mParameters) {
            mParameters = mParameters + ",";
            var parms = mParameters.split(",");
            parms.forEach(function (parm) {
                if (parm.startsWith("importJson:")) {
                    parm = parm.replace("importJson:", "");

                    data[listProperty].forEach(function (item) {
                        item[parm] = eval(item[parm]);
                    });
                }
            }
            );
        }
    }

    /**
     * Busca os dados do serviço
     * @param {*} sPath 
     * @param {*} mParameters 
     */
    function read(sPath, mParameters) {
        jQuery.ajax(
            {
                url: servicePath + sPath,
                type: "GET",
                contentType: "application/json; charset=UTF-8",
                context: "document.body",
                dataType: "json",
                async: true,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: mParameters.success,
                error: mParameters.error
            }
        );
    }

    /**
     * Carrega os dados de uma lista e armazena o resultado no model
     * @param {*} sPath 
     * @param {*} mParameters 
     * @param {*} suffix  - url apendada ao path para que o retorno funcione... idealmente deve ser substituido por params de paginacao
     */
    function _loadList(sPath, mParameters, suffix = "?offset=0&limit=1000") {
        let that = this;
        this.read(sPath + suffix, {
            success: function (data) {
                trataParametersLista(data, mParameters);
                setProperty.call(that, sPath, data[listProperty]);
            },
            error: function (jqXHR, textStatus, data) {
                console.error(jqXHR);
            }
        });
    }

    function bindList(sPath, oContext, aSorters, aFilters, mParameters) {
        let that = this;
        //model por enquanto só faz chamadas ao backend para caminhos absolutos
        if (sPath.startsWith("/")) {
            inicializaEstrutura.call(that, sPath);
            _loadList.call(this, sPath, mParameters);
        }

        return JSONModel.prototype.bindList.apply(that, [sPath, oContext, aSorters, aFilters, mParameters]);
    }

    /**
         * Sets a property for the JSON model
         * @override
         */
    function setProperty() {
        JSONModel.prototype.setProperty.apply(this, arguments);
    }


    /**
         * Sets the data for the JSON model
         * @override
         */
    function setData() {
        JSONModel.prototype.setData.apply(this, arguments);
    }

    /**
     * Refreshes the model with the current data
     * @override
     */
    function refresh() {
        let that = this;

        //voudar um refresh em todos os bindings absolutos...
        this.aBindings.filter(x => x.sPath.startsWith("/")).forEach(bind => {
            _loadList.call(that, bind.sPath, bind.mParameters);
        });
        JSONModel.prototype.refresh.apply(that, arguments);

    }

});
