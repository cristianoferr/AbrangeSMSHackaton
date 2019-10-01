
sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/Device'],

	function (UIComponent, Device) {
		'use strict';

		let that;



		/**
		 * Estes métodos de validação são normalmente chamados dentro de validações de campos de entrada. Por exemplo,
		 * você verificou que um usuário digitou um CNPJ de forma incorreta. Neste caso você pode disparar o xxxx que irá cair no validationError abaixo, fazendo com que o entorno do input fique vermelho
		 */
		sap.ui.getCore().attachValidationError(function (oEvent) {

			oEvent.getParameter('element').setValueState(sap.ui.core.ValueState.Error);
			oEvent.getParameter('element').setValueStateText(oEvent.getParameters().message);
		});


		/**
		 * Estes métodos de validação são normalmente chamados dentro de validações de campos de entrada. Por exemplo,
		 * você verificou que um usuário digitou um CNPJ de forma correta. Neste caso você pode disparar o xxxx que irá cair no validationSuccess abaixo, fazendo com que o entorno do input fique verde
		*/
		sap.ui.getCore().attachValidationSuccess(function (oEvent) {

			oEvent.getParameter('element').setValueState(sap.ui.core.ValueState.Success);
			oEvent.getParameter('element').setValueStateText('');

		});

		return UIComponent.extend('templateHackaton.Component', {

			/**
			* O manifest.json possui as principais configurações necessárias para executar uma aplicação SAPUI5. Nele são definidas as rotas
			* da aplicação, os models entre outras informações. A idéia é que tudo que for necessário para iniciar sua aplicação seja configurado via o manifest.json (https://sapui5.hana.ondemand.com/#/topic/be0cf40f61184b358b5faedaec98b2da.html)
			*/
			metadata: {
				manifest: 'json'
			},

			init: function () {

				that = this;
				UIComponent.prototype.init.apply(that, arguments);
				initializerService.bind(that);
				backendService.bind(that);
				locatorService.bind(that);
				dialogService.setI18N(that.getModel('i18n'));

				setTimeout(function () {
					backendService.carregaDadosBackend();
					that.getRouter().initialize();
				}, 500);

			}
		}

		);

	});