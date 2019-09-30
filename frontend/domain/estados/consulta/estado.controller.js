sap.ui.define(["templateHackaton/shared/baseController"],

    function (baseController) {
        "use strict";

        let that;

        return baseController.extend("templateHackaton.domain.estados.consulta.estado", {

            onInit: function () {
                that = this;

                if (that.getRouter()) {
                    that.getRouter().getRoute('routeConsultaEstado').attachPatternMatched(
                        onRouteOrSubRoutesMatched);
                }

            }

        });

        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatched(event) {
            estadoService.bind(that);
            that.getView().bindElement({ path: `/Estados/${event.getParameters().arguments.id}/` });
        }


    });