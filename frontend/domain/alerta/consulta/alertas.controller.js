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
                }

            },
            onItemListaSelected,
            onNavBack,
            traduzStatus,
            getStateStatus

        });

        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatchedConsulta() {


        }

        function onRouteOrSubRoutesMatchedBusca() {


        }

        function getStateStatus(status) {
            if (status == constants.STATUS_APROVADO) {
                return "Success";
            }
            return "Warning";
        }

        function traduzStatus(status) {
            return that.getI18NTranslation("status." + status);
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