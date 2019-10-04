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
			onNavegaAlertas,
			onNovoAlerta,
			onSearch,
			barraSuperiorService


		});

		/** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
		 * @function onRouteOrSubRoutesMatched
		 * @return {type} {description}
		 */
		function onRouteOrSubRoutesMatched() {
			that.setProperty("viewModel>/tituloAtual", that.getI18NTranslation("appTitulo"));
			that.setProperty("viewModel>/backRoute", "");
			barraSuperiorService.bind(that);
			backendService.bind(that);

		}

		function onNovoAlerta() {
			that.navigateToRoute("routeNovoAlerta");
		}

		function onNavegaAlertas() {
			that.navigateToRoute("routeConsultaAlertas");
		}

		function onSearch(evt) {
			if (evt.mParameters.query) {
				that.navigateToRoute("routeBuscaAlertas", { search: evt.mParameters.query });
			} else {
				onNavegaAlertas();
			}
		}

		function onOpenDialog(evt) {
			estadoService.bind(that);
			estadoService.onAbreDialog(evt.getSource());
		}


	});