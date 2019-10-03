var filtroAlertaService = (function () {
    let that;

    return {
        bind,
        onFechaDialogo,
        onAbreDialog,
        onAplicaFiltro,
        resetFiltro

    }

    function onAbreDialog(evt) {

        //abro o dialog
        if (!that._filtraAlertas) {
            that._filtraAlertas = sap.ui.xmlfragment("templateHackaton.domain.alerta.consulta.filtro.filtroAlerta", that);
            that.getView().addDependent(that._filtraAlertas);
        }
        that._filtraAlertas.bindElement("localModel>/filtros");
        that._filtraAlertas.openBy(evt.getSource());

    }

    function onAplicaFiltro() {
        let filtros = that.getProperty("localModel>/filtros");
        let textoBusca = that.getProperty("localModel>/searchAlertas") || "";

        let filtroFinal = new sap.ui.model.Filter({
            filters: [],
            and: true
        });

        if (filtros.tipoAlerta != null && filtros.tipoAlerta != "") {
            filtroFinal.aFilters.push(new sap.ui.model.Filter("tipoAlerta", sap.ui.model.FilterOperator.EQ, filtros.tipoAlerta));
        }

        buscaTexto(textoBusca, filtroFinal);

        if (filtros.statusAlerta != "ambos") {
            filtroFinal.aFilters.push(new sap.ui.model.Filter("lido", sap.ui.model.FilterOperator.EQ, filtros.statusAlerta == "ciente"));
        }


        if (filtros.instalacoes.length > 0) {
            let filtroInstalacao = new sap.ui.model.Filter({
                filters: [],
                and: false
            });
            filtros.instalacoes.forEach(instalacao => {
                filtroInstalacao.aFilters.push(new sap.ui.model.Filter("instalacao", sap.ui.model.FilterOperator.EQ, instalacao));
            });
            filtroFinal.aFilters.push(filtroInstalacao);

        }

        filtroFinal.aFilters.push(new sap.ui.model.Filter("distancia", sap.ui.model.FilterOperator.LT, filtros.distanciaAlerta));

        let listaAlertas = that.getView().byId("listaAlertas");
        let binding = listaAlertas.getBinding("items");
        binding.filter(filtroFinal);

        let campoSort = filtros.campoOrdenado;
        let tipoOrdenacao = filtros.tipoOrdenacao == constants.TIPO_ORDENACAO_DECRESCENTE
        binding.sort(new sap.ui.model.Sorter(campoSort, tipoOrdenacao));

    }

    /**
     * Faz a busca por texto quebrando em subfiltros
     * @param {*} textoBusca 
     * @param {*} filtroFinal 
     */
    function buscaTexto(textoBusca, filtroFinal) {

        //tokeniza a string digitada pelo usuário (cria um array usando virgulas ',' como delimitador)
        let stringsBusca = textoBusca.split(/[,]+/);

        //filtro onde adiciono os subfiltros por ',' quebrado em espaço, logo se o usuário pesquisa por 'a b,c' é criado
        // um filtro que pesquisa a E b OU c.
        let filtroPorVirgula = new sap.ui.model.Filter({
            filters: [],
            and: false
        }
        );
        let tableColumns = [
            { property: "titulo", operator: sap.ui.model.FilterOperator.Contains },
            { property: "descricao", operator: sap.ui.model.FilterOperator.Contains },
            { property: "instalacao", operator: sap.ui.model.FilterOperator.Contains }
        ]

        let filtroOk = false;
        stringsBusca.forEach((textoBusca) => {
            if (textoBusca.trim() != "") {
                adicionaFiltrosPorEspaco(textoBusca, tableColumns, filtroPorVirgula);
                filtroOk = true;
            }
        });
        if (filtroOk) {
            filtroFinal.aFilters.push(filtroPorVirgula);
        }
    }

    /**
         * Pega um texto de busca e cria um filtro em cada coluna da tabela visível
         * @param {*} textoBusca 
         * @param {*} tableColumns 
         * @param {*} filtro 
         */
    function adicionaFiltrosPorEspaco(textoBusca, tableColumns, filtroVirgula) {
        let filtro = new sap.ui.model.Filter({
            filters: [],
            and: true
        }
        );
        filtroVirgula.aFilters.push(filtro);

        let stringsBusca = textoBusca.split(/[ ]+/);
        //para cada string de busca, monta o filtro..
        stringsBusca.forEach((stringBusca) => {
            let camposFiltrados = [];
            tableColumns.forEach(campo => {
                let property = campo.property;
                if (property != "") {
                    camposFiltrados.push(new sap.ui.model.Filter(property, campo.operator, stringBusca.trim()));
                }
            });

            filtro.aFilters.push(new sap.ui.model.Filter({
                filters: camposFiltrados,
                and: false
            }
            ));
        }, that);
    }


    function onFechaDialogo() {
        that._filtraAlertas.close();
    }

    function resetFiltro() {
        let filtroInicial = {
            distanciaAlerta: 10000,
            instalacoes: [],
            campoOrdenado: "id",
            tipoOrdenacao: constants.TIPO_ORDENACAO_DECRESCENTE
        };
        that.setProperty("localModel>/filtros", filtroInicial);
    }

    /**
     * faz o bind com o controller
     * @param {*} _that 
     */
    function bind(_that) {
        that = _that;
        if (!that.getProperty("localModel>/filtros")) {
            resetFiltro();

        }
    }

})();