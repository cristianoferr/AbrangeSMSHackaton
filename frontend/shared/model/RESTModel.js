/**
 * RESTModel
 * Esse model tem por objetivo acessar serviços REST de uma forma transparente ao desenvolvedor.
 * 
 
 * Configurando o model:
    *  datasource: "datasourceRest": {
                    "uri": "/raizServiçoRest",
                    "type": "JSON"
                }
                
    *  Model:  "modelRest": {
                    "type": "chatbotfrontend.shared.model.RESTModel",
                    "dataSource": "datasourceRest",
                    "settings": {
                        "listProperty": "lista"
                    }
                }
        * listProperty: serviços rest podem retornar uma array dentro de um objeto json, exemplo de retorno: 'lista:[{obj1},{obj2}]', para esses casos é preciso informar que listProperty é igual a 'lista' ou o equivalente do serviço, se não existir essa 'lista' (serviço retorna '[{obj1},{obj2}]') então basta remover a configuração.
        * initialJSON: caminho do json que será carregado no modelo (pré-carga de dados)
        * listSuffix: alguns serviços rest podem exigir algum tipo de parametros de paginação

 
 * Bind de Propriedades: 
 * Exemplos de uso:
    <Input value="{/metodo/param/propriedade}"/>  <- Executa uma chamada ao método 'metodo' passando como parametro 'param' (= GET /metodo/param), 'propriedade' é exibido no input
    <Input value="{/metodo/propriedade}"/>  <- Executa uma chamada ao método 'metodo', não passa parametro algum (= GET /metodo), 'propriedade' é exibido no input
    <Input value="{/propriedadeLocal}"/>  <- Não executa chamada alguma, a 'propriedadeLocal' do model é exibida no input

  * Bind de Lista:
  * Exemplo: <Table items="{path: '/path/Lista/rest',  sorter: { path: 'nome' }, templateShareable:false,parameters:{operationMode:'Client', dataReceived:'procuracaoService.documentosCarregados'}}}"
        Faz uma chamada ao método '/path/Lista/rest', assim que os dados forem carregados a função 'procuracaoService.documentosCarregados' é executada sendo passado os dados de retorno da função
            Nota: Propriedades dessa coluna serão acessadas diretamente usando caminhos relativos (equivalente ao que ocorre com odata):
                <ColumnListItem type="Navigation">
                        <Text text="{codigo}"/>
                        <Text text="{empresaAlvo/empresa/nome}" />
                        <Text text="{estado}" />
                        <Text text="{instituicaoFinanceira/nome}" />
                        <Text text="{path:'dataVencimento',formatter:'.dateFormatter.formataData'}"/>
                    </ColumnListItem>

Métodos:
    * read: Efetua uma chamada de leitura ao backend (a chamada é sempre efetuada mesmo que a property já tenha sido carregada)
        * Exemplo: this.getModel().read(`/documento-poder/${that.IdProcuracao}`, {
                        success: function (result) {
                            console.log(result);
                        } } );

    * refresh: atualiza todos os binds relacionados a listas

    * create: efetua um post no caminho informado

    * remove: efetua um DELETE no caminho informado               
 */

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "jquery.sap.storage"
], function (JSONModel, jQuery) {
    "use strict";

    //lista de caminhos sendo carregados
    var loadingPaths = [];


    return JSONModel.extend("templateHackaton.shared.model.RESTModel", {
        constructor,
        setProperty,
        setData,
        refresh,
        bindList,
        bindProperty,
        create,
        update,
        remove,
        read,
        servicePath: null,
        listProperty: null,
        listSuffix: "",
        _loadData,
        _storeData
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
                this.listProperty = arg.listProperty;
            }
            if (arg.storageKey) {
                this._STORAGE_KEY = arg.storageKey;
            }
            if (arg.initialJSON) {
                this.loadData(arg.initialJSON);
            }
            if (arg.listSuffix) {
                this.listSuffix = arg.listSuffix;
            }
        }

        this.servicePath = sPath;

        // load data from local storage
        this._loadData.call(this);

        return this;
    }

    /**
     * Loads the current state of the model from local storage
     */
    function _loadData() {

    }

    /**
     * Saves the current state of the model to local storage
     */
    function _storeData() {

    }


    /**
     * se chamar algo tipo '/duvida/listaDuvidas' e não existir nada em '/duvida' então a propriedade não é setada
     * o código abaixo corrige isso criando toda a estrutura do json
     * @param {*} sPath 
     */
    function inicializaEstrutura(sPath) {
        if (sPath.lastIndexOf("/") > 0) {
            let rootPath = "";
            while (sPath.indexOf("/", 1) >= 0) {
                let subPath = sPath.substr(0, sPath.indexOf("/", 1));
                if (!this.getProperty(rootPath + subPath)) {
                    this.setProperty(rootPath + subPath, {});
                }
                rootPath = rootPath + sPath.substr(0, subPath.length);
                sPath = sPath.substr(subPath.length);

            }
        }
    }

    function remove(sPath, oData, mParameters) {
        let that = this;
        jQuery.ajax(
            {
                url: that.servicePath + sPath,
                type: "DELETE",
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

    
    function update(sPath, oData, mParameters) {
        executaAjax(sPath, oData, mParameters,"PATCH");
    }
    function create(sPath, oData, mParameters) {
        executaAjax(sPath, oData, mParameters,"POST");
    }

    function executaAjax(sPath, oData, mParameters,metodoType) {
        let that = this;
        jQuery.ajax(
            {
                url: that.servicePath + sPath,
                type: metodoType,
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
     * Faz o tratamento de parametros especificados na lista, um deles   é o importJson que executa o conteudo de uma propriedade e seta o valor
     * @param data
     * @param mParameters
     */
    function trataParametersLista(data, mParameters) {
        let that = this;
        if (mParameters) {
            for (var property in mParameters) {
                var parm = mParameters[property];
                if (property == "dataReceived") {
                    eval(parm)();
                }
                if (property == "importJson") {

                    var listData = that.listProperty == null ? data : data[that.listProperty] != undefined ? data[that.listProperty] : data;

                    listData.forEach(function (item) {
                        item[parm] = eval(item[parm]);
                    });
                }
            }
        }
    }

    /**
     * Busca os dados do serviço
     * @param {*} sPath 
     * @param {*} mParameters 
     */
    function read(sPath, mParameters) {
        let that = this;
        jQuery.ajax(
            {
                url: that.servicePath + sPath,
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
                error: function (err) {
                    console.error("Erro requisitando " + sPath);
                    console.error(err);
                    if (mParameters.error) mParameters.error(err);
                }
            }
        );
    }

    /**
     * Carrega os dados de uma lista e armazena o resultado no model
     * @param {*} sPath 
     * @param {*} mParameters 
     * @param {*} forceLoad  - se true então os dados são carregados novamente
     */
    function _loadList(sPath, mParameters, forceLoad = false) {
        let that = this;

        var listLoaded = this.aBindings.filter(x => x.sPath === sPath && x.oList != null).length > 0;

        //carrega apenas se não houver binding (ou seja, é uma requisição nova ao backend)
        if (!forceLoad && listLoaded) {
            return;
        }

        _loadProperties.call(that, sPath, that.listSuffix, mParameters, that.listProperty);

    }

    function _loadProperties(sPath, suffix, mParameters, listProperty = null) {
        let that = this;
        let success = function (data) {
            trataParametersLista.call(that, data, mParameters);
            var listData = that.listProperty == null ? data : data[that.listProperty] != undefined ? data[that.listProperty] : data;
            setProperty.call(that, sPath, listData);
        };

        this.read(sPath + suffix, {
            success: function (data) {
                success(data);
            },
            error: function (jqXHR, textStatus, data) {
                console.error(jqXHR);
            }
        });
    }

    /**
     * Binda o path com a propriedade informada
     * a implementação vai ignorar o ultimo elemento para fazer a carga
     * exmeplo, em /empresa/codigo/nome
     * Será feito requisição a /empresa/codigo
     * Também não é chamado quando se passa apenas '/empresa'
     * @param {*} sPath 
     * @param {*} oContext 
     * @param {*} mParameters 
     */
    function bindProperty(sPath, oContext, mParameters) {
        let that = this;
        var count = (sPath.match(/\//g) || []).length;

        if (sPath.startsWith("/") && that.getProperty(sPath) == undefined && count > 1) {
            inicializaEstrutura.call(that, sPath.substring(0, sPath.lastIndexOf("/")));
            _loadProperties.call(that, sPath.substring(0, sPath.lastIndexOf("/")), '', mParameters);
        }

        return JSONModel.prototype.bindProperty.apply(that, [sPath, oContext, mParameters]);
    }

    function bindList(sPath, oContext, aSorters, aFilters, mParameters) {
        let that = this;
        sPath = resolvePropriedades.call(that, sPath);
        //model por enquanto só faz chamadas ao backend para caminhos absolutos
        if (sPath.startsWith("/")) {
            inicializaEstrutura.call(that, sPath);
            _loadList.call(this, sPath, mParameters);
        }

        return JSONModel.prototype.bindList.apply(that, [sPath, oContext, aSorters, aFilters, mParameters]);
    }

    /**
     * Resolve propriedades que estão no caminho informado pelo usuário
     * exemplo:'/{/contexto}/api/etc' vira '/GP/api/etc'
     * @param {*} sPath 
     */
    function resolvePropriedades(sPath) {
        while (sPath.indexOf("{") >= 0) {
            let lastIndex = sPath.indexOf("{") + 1;
            let propriedade = sPath.substring(lastIndex, sPath.indexOf("}", lastIndex));

            sPath = sPath.replace("{" + propriedade + "}", this.getProperty(propriedade));
        }
        return sPath;
    }


    /**
         * Sets a property for the JSON model
         * @override
         */
    function setProperty() {
        JSONModel.prototype.setProperty.apply(this, arguments);
        this._storeData.call(this);
    }


    /**
         * Sets the data for the JSON model
         * @override
         */
    function setData() {
        JSONModel.prototype.setData.apply(this, arguments);
        // called from constructor: only store data after first load
        if (this._bDataLoaded) {
            this._storeData.call(this);
        }
    }

    /**
     * Refreshes the model with the current data
     * @override
     */
    function refresh() {
        let that = this;

        //vou dar um refresh em todos os bindings absolutos que são listas...
        var bindList = this.aBindings.filter(x => x.sPath.startsWith("/") && x.oList != null);
        bindList = bindList.filter(onlyUnique);
        bindList.forEach(bind => {
            _loadList.call(that, bind.sPath, bind.mParameters, true);
        });
        JSONModel.prototype.refresh.apply(that, arguments);

    }

    function onlyUnique(value, index, self) {
        value.sPath;
        var firstIndex = 0;
        while (firstIndex < self.length && value.sPath != self[firstIndex].sPath)
            firstIndex++;
        return firstIndex === index;
    }

});
