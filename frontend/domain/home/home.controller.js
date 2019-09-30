sap.ui.define(['templateHackaton/shared/baseController'],

	function (baseController) {
		'use strict';

		let that;

		return baseController.extend('templateHackaton.domain.home.home', {

			onInit: function () {
				that = this;

				that.getRouter().getRoute('routeAppHome').attachPatternMatched(
					onRouteOrSubRoutesMatched);
			},
			onOpenDialog,
			estadoService,
			onNavegaMestreDetalhe


		});


		/** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
		 * @function onRouteOrSubRoutesMatched
		 * @return {type} {description}
		 */
		function onRouteOrSubRoutesMatched() {

		}

		function onNavegaMestreDetalhe(){
			that.navigateToRoute("routeConsultaEstados");
		}

		function onOpenDialog(evt){
			estadoService.bind(that);
			estadoService.onAbreDialog(evt.getSource());
		}


	});