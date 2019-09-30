sap.ui.define(['templateHackaton/shared/baseController'],

	function (baseController) {
		'use strict';

		let that;

		return baseController.extend('templateHackaton.domain.callcenter.callcenter', {

			onInit: function () {
				that = this;

				that.getRouter().getRoute('routeCallcenter').attachPatternMatched(
					onRouteOrSubRoutesMatched);
			},
			onCallcenter



		});

		function onCallcenter() {
			window.open("tel:08002872267", "_system");
		}


		/** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
		 * @function onRouteOrSubRoutesMatched
		 * @return {type} {description}
		 */
		function onRouteOrSubRoutesMatched() {

		}



	});