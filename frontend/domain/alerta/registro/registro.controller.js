//

sap.ui.define(["templateHackaton/shared/baseController"
],

    function (baseController) {
        "use strict";

        let that;
        return baseController.extend("templateHackaton.domain.alerta.registro.registro", {

            onInit: function () {
                that = this;

                that.getRouter().getRoute('routeRegistro').attachPatternMatched(
                    that.onRouteNovaSolicitacao);

            },

            // anexoService,
            pendenciaService,
            onRouteNovaSolicitacao,
            tipoAlertaService,
            constants,
            backendService,


        });
        /** 
         * Método chamado quando o usuário clica em criar nova solicitação
         */
        function onRouteNovaSolicitacao(event) {
            sap.that = that;
            tipoAlertaService.bind(that);
            iniciaAnomalia();
            configuraRegrasValidacao();

            that.viewModel.setProperty("/alerta", {});

        }


        /**
         * Inicializa as regras de validação dos campos de tela
         */
        function configuraRegrasValidacao() {
            pendenciaService.bind(that);

            //Regras de validação de campos
            tipoAlertaService.adicionaRegrasPendencias();
            //anexoService.adicionaRegrasPendencias();

            //sempre que alguma propriedade muda é chamado o validador de pendências

            pendenciaService.validaPendencias();
        }

    });