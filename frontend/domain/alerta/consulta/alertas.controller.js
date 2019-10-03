sap.ui.define(["templateHackaton/shared/baseController"],

    function (baseController) {
        "use strict";

        let that;

        return baseController.extend("templateHackaton.domain.alerta.consulta.alertas", {

            onInit: function () {
                that = this;

                if (that.getRouter()) {
                    that.getRouter().getRoute('routeConsultaAlertas').attachPatternMatched(
                        onRouteOrSubRoutesMatchedConsulta);
                    that.getRouter().getRoute('routeBuscaAlertas').attachPatternMatched(
                        onRouteOrSubRoutesMatchedBusca);
                    that.getRouter().getRoute('routeConsultaPendentes').attachPatternMatched(
                        onRouteOrSubRoutesMatchedPendente);

                    that.getRouter().getRoute('routeConsultaAlerta').attachPatternMatched(
                        onRouteOrSubRoutesMatchedAlerta);

                }

            },
            onItemListaSelected,
            onNavBack,
            filtroAlertaService,
            calculaDistanciaAlerta

        });

        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatchedPendente
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatchedPendente() {
            filtroAlertaService.bind(that);
            that.setProperty("viewModel>/backRoute", "routeAppHome");
            that.setProperty("viewModel>/tituloAtual", "Alertas Pendentes");
            filtroAlertaService.resetFiltro();
            that.setProperty("localModel>/filtros/statusAlerta", "pendente");
            filtroAlertaService.onAplicaFiltro();
        }

        function onRouteOrSubRoutesMatchedAlerta() {
            filtroAlertaService.bind(that);
            filtroAlertaService.onAplicaFiltro();
        }

        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatchedConsulta() {
            filtroAlertaService.bind(that);
            filtroAlertaService.onAplicaFiltro();
            that.setProperty("viewModel>/backRoute", "routeAppHome");
            that.setProperty("viewModel>/tituloAtual", "Consultas Alertas");
        }

        function onRouteOrSubRoutesMatchedBusca() {
            filtroAlertaService.bind(that);
            filtroAlertaService.onAplicaFiltro();
            that.setProperty("viewModel>/backRoute", "routeAppHome");
            that.setProperty("viewModel>/tituloAtual", "Busca Alertas");
        }

        function calculaDistanciaAlerta(evt) {
            let listaAlertas = that.getView().byId("listaAlertas");
            let binding = listaAlertas.getBinding("items");
            let alertas = that.getProperty("/Alertas");
            let instalacoes = that.getProperty("dominio>/instalacoes")
            alertas.forEach(alerta => {
                atualizaDistanciaAlerta(alerta, instalacoes);
            });
            that.setProperty("/Alertas", alertas);
        }

        function atualizaDistanciaAlerta(alerta, instalacoes) {
            alerta.distancia = 999999;
            alerta.distanciaDesc = "";
            let instalacao = alerta.instalacao;
            if (instalacao) {
                let instalacaoData = instalacoes.find(x => x.nome == instalacao);
                if (instalacaoData) {
                    let distancia = locatorService.getDistanceTo(instalacaoData.lat, instalacaoData.long);
                    alerta.distancia = distancia;
                    alerta.distanciaDesc = "(" + parseInt(distancia) + " km )";
                }
            }

        }


        function onItemListaSelected(evt) {
            let source = evt.mParameters.listItem;
            source.setSelected(false);
            evt.oSource.setSelectedItem(null);
            that.navigateToRoute("routeConsultaAlerta", { id: source.data().id });
        }

        function onNavBack() {
            that.navigateToRoute("routeAppHome");
        }



    });