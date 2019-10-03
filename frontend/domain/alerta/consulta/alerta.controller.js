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
            juntaTexto,
            userVote

        });



        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatched(event) {
            that.getView().bindElement({ path: `/Alertas/${event.getParameters().arguments.id}/` });
            let tipo = "tipoAlerta." + that.getProperty(`/Alertas/${event.getParameters().arguments.id}/tipoAlerta`);
            that.setProperty("viewModel>/tituloAtual", that.getI18NTranslation(tipo));
            if (that.getProperty("device>/isPhone")) {
                that.setProperty("viewModel>/backRoute", "routeConsultaAlertas");
            } else {
                that.setProperty("viewModel>/backRoute", "routeAppHome");

            }
            sap.that = that;
        }

        function userVote(evt) {
            let source = evt.oSource;
            let userVoto = parseInt(source.data().voto);
            let path = source.getBindingContext().sPath;
            that.setProperty(path + "/userVotou", userVoto);
            let qtdVotos = that.getProperty(path + "/votos");
            qtdVotos += userVoto;
            that.setProperty(path + "/votos", qtdVotos);
        }

        function juntaTexto(array) {
            if (!array) {
                return "";
            }
            let saida = "";
            return array.map(x => { return (x.passo ? x.passo + ". " : " ") + x.descricao + "\n\n" });
        }


    });