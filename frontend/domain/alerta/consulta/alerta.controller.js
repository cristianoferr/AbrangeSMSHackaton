sap.ui.define(["templateHackaton/shared/baseController"],

    function (baseController) {
        "use strict";

        let that;

        return baseController.extend("templateHackaton.domain.alerta.consulta.alerta", {

            onInit: function () {
                that = this;

                if (that.getRouter()) {
                    that.getRouter().getRoute('routeConsultaAlerta').attachPatternMatched(
                        onRouteOrSubRoutesMatched);
                }


            },
            juntaTexto

        });


        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatched(event) {
            that.getView().bindElement({ path: `/Alertas/${event.getParameters().arguments.id}/` });
            let tipo = "tipoAlerta." + that.getProperty(`/Alertas/${event.getParameters().arguments.id}/tipoAlerta`);
            that.setProperty("viewModel>/tituloAtual", that.getI18NTranslation(tipo));
            that.setProperty("viewModel>/backRoute", "routeConsultaAlertas");
        }

        function juntaTexto(array) {
            if (!array) {
                return "";
            }
            let saida = "";
            return array.map(x => { return (x.passo ? x.passo + ". " : " ") + x.descricao+"\n\n" });
        }


    });