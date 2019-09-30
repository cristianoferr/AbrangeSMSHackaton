sap.ui.define(["templateHackaton/shared/baseController"],

    function (baseController) {
        "use strict";

        let that;

        return baseController.extend("templateHackaton.domain.estados.consulta.estados", {

            onInit: function () {
                that = this;

                if (that.getRouter()) {
                    that.getRouter().getRoute('routeConsultaEstados').attachPatternMatched(
                        onRouteOrSubRoutesMatched);
                }

            },
            onItemListaSelected,
            onNavBack

        });

        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatched() {
            

        }

        function onItemListaSelected(evt) {
            let source = evt.mParameters.listItem;
            source.setSelected(false);
            evt.oSource.setSelectedItem(null);
            that.navigateToRoute("routeConsultaEstado", { id: source.data().id });
        }

        function onNavBack(){
            that.navigateToRoute("routeAppHome");
        }

      

    });