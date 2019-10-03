//

sap.ui.define(["templateHackaton/shared/baseController"
],

    function (baseController) {
        "use strict";

        let that;
        return baseController.extend("templateHackaton.domain.alerta.registro.registro", {

            onInit: function () {
                that = this;

                that.getRouter().getRoute('routeNovoAlerta').attachPatternMatched(
                    that.onRouteNovaSolicitacao);

            },

            // anexoService,
            pendenciaService,
            onRouteNovaSolicitacao,
            tipoAlertaService,
            constants,
            backendService,
            iniciaRegistro,
            onNavBack,
            dadosAlertaService,
            anexoService,
            onSalvarAlerta,
            barraSuperiorService


        });
        /** 
         * Método chamado quando o usuário clica em criar nova solicitação
         */
        function onRouteNovaSolicitacao(event) {
            sap.that = that;
            tipoAlertaService.bind(that);
            pendenciaService.bind(that);
            dadosAlertaService.bind(that);
            anexoService.bind(that);
            barraSuperiorService.bind(that);

            configuraRegrasValidacao();

            iniciaRegistro();

            that.setProperty("viewModel>/backRoute", "routeAppHome");
            that.setProperty("viewModel>/tituloAtual", "Novo Alerta SMS");

        }



        function onSalvarAlerta(evt) {
            that.navigateToRoute("routeConsultaAlertas");
        }

        function onNavBack() {
            that.navigateToRoute("routeAppHome");
        }

        function iniciaRegistro(tipoAlerta = null) {
            that.setProperty("viewModel>/alerta", {
                tipoAlerta: tipoAlerta,
                regrasOuro: JSON.parse(JSON.stringify(that.getProperty("dominio>/regrasDeOuro"))),
                cuidados: [{ passo: 1, empty: true }],
                motivos: [{ passo: 1, empty: true }],
                comoEvitar: [{ passo: 1, empty: true }],
                acoesEmAndamento: [{ passo: 1, empty: true }],
                publicoAlvo: []

            });
            that.getView().bindElement('viewModel>/alerta');

            let dtDataOcorrencia = that.getView().byId("dtDataOcorrencia");
            let dtDataEmissao = that.getView().byId("dtDataEmissao");
            dtDataOcorrencia.setDateValue(new Date());
            dtDataEmissao.setDateValue(new Date());
        }


        /**
         * Inicializa as regras de validação dos campos de tela
         */
        function configuraRegrasValidacao() {
            pendenciaService.bind(that);

            //Regras de validação de campos
            tipoAlertaService.adicionaRegrasPendencias();
            dadosAlertaService.adicionaRegrasPendencias();
            //anexoService.adicionaRegrasPendencias();

            //sempre que alguma propriedade muda é chamado o validador de pendências

            pendenciaService.validaPendencias();
        }

    });