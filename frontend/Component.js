
sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/Device'],

	function (UIComponent, Device) {
		'use strict';

		let that;

		/**
		 * Esta função auxiliar deve ser utilizada para indicar que determinado parâmetro de uma função é obrigatório. API
		 * @param {*} param Nome do parâmetro obrigatório
		 */
		function requiredParam(param) {
			const requiredParamError = new Error(
				`Parâmetro obrigatório, '${param}' não foi informado.`
			);
			// preserve original stack trace
			if (typeof Error.captureStackTrace === 'function') {
				Error.captureStackTrace(
					requiredParamError,
					requiredParam
				);
			}
			throw requiredParamError;
		}


		function _isValidJSON(value) {

			try {
				return JSON.parse(value);

			} catch (e) {

				return null;
			}

		}

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


		/**
		 * Criar um eventHandler que será executado sempre que algum erro acontecer no javascript.
		 * Ele irá mostrar um pequeno dialog para o usuário com o stacktrace e o erro que ocorreu
		 */
		(function ativarTratamentoExcecaoGlobal() {
			window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
				sap.ui.core.BusyIndicator.hide();
				jQuery.sap.log.error(errorMsg);

				window.alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' +
					lineNumber +
					' Column: ' + column + ' StackTrace: ' + errorObj +
					'. Recarregue a página e se o erro persistir, entre em contato com o 881 enviando um print screen dessa mensagem'
				);
			};


		})();

		/** 
		 * Por algum motivo o sapui5 estava buscando a linguagem de alguma outra fonte que nao era no navegador. Eu troquei o locale do chrome e do ff
		 * e mesmo assim o locale definido era PT. Sendo assim, precisei forçar a linguagem com o método abaixo.  Nao é necessário chamar no init
		 * pois o metodo abaixo é uma IIFE
		 * @function definirlinguagemConfiguradaNavegador
		 */
		(function definirlinguagemConfiguradaNavegador() {
			sap.ui.getCore().getConfiguration().setLanguage(window.navigator.language);
		})();


		/**
		 * Configura um model com as características do dispositivo que a aplicação estiver executando.
		 * A idéia é usar este model ao longo da aplicação para mudar o comportamento da aplicação em relação ao dispositivo onde a mesma
		 * está executando
		 * @function definirDeviceModel
		 * @return {type} {description}
		 */
		function definirDeviceModel() {

			let deviceModel = that.getModel('deviceModel');

			deviceModel.setData({
				rootPath: jQuery.sap.getModulePath(that.getManifest()["sap.app"].id) + "/",
				isTouch: Device.support.touch,
				isNoTouch: !Device.support.touch,
				isPhone: Device.system.phone,
				isNoPhone: !Device.system.phone,
				isDesktop: Device.system.desktop,
				isNoDesktop: !Device.system.desktop,
				listMode: Device.system.phone ? 'None' : 'SingleSelectMaster',
				listItemType: Device.system.phone ? 'Active' : 'Inactive'
			});
		}


		/**
		 * O título da janela é atualizado automaticamente, não sendo mais necessário setar na mão o título e a versão: os mesmos são pegos do i18n.
		 */
		function definirTituloAbaNavegador() {
			let bundle = that.getModel('i18n').getResourceBundle();

			let appTitle = bundle.getText('appTitulo');
			let appVersion = bundle.getText('appVersion');
			document.title = appTitle + ' - ' + appVersion;
		}


		/** 
 * Verifica se o firefox utilizado está numa versão menor que a 45. Em teste no firefox 31, a aplicação não iniciou corretamente.
 * Na época o navegador homologado pela petrobras era o FF 45. O metodo retorna false se a versao for maior do que a versão 45 ou se o navegador 
 * nao for o firefox
 * @function verificarFirefoxMenor45
 * @return true se a versão do FF usada para acessar a aplicação for menor que a 45 e false caso contrário
 */
		function verificarFirefoxMenor45() {
			let match = navigator.userAgent.match(/Firefox\/([0-9]+)\./);
			let versao = match ? parseInt(match[1]) : 100000; //se nao tiver a string firefox no user agent, versao recebe 100000.

			return versao < 45;
		}


		/**
	 * Caso algum navegador imcompatível acesse a aplicação, uma mensagem de erro é mostrada orientando o usuario a utilizar uma navegador compatível.
	 * @function bloqueiaAcessoNavegadorImcompativel
	 */
		function bloqueiaAcessoNavegadorImcompativel() {

			let bundle = that.getModel('i18n').getResourceBundle();

			if (verificarFirefoxMenor45()) {

				let msg = bundle.getText('navegadorImcompativel.descricao');
				let titulo = bundle.getText('navegadorImcompativel.titulo');

				dialogService.showErrorDialog(titulo, msg);
			}
		}


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

				bloqueiaAcessoNavegadorImcompativel.apply(that);
				definirDeviceModel.apply(that);

				definirTituloAbaNavegador.apply(that);

				//o odataModel deve ser definido no manifest.json e não instanciado manualmente. Se ele for declarado no manifest,
				//neste ponto ele já foi instanciado e pode ser obtido através do getModel()
				let authModel = that.getModel('authModel');

				that.getRouter().initialize();

			}
		}

		);

		/**
		 * 
		 * @param {*} errorResponse 
		 */
		function onParseError(errorResponse) {


			let bundle = that.getModel('i18n').getResourceBundle();


			let msgError = bundle.getText('excecoes.erroParse', [
				errorResponse.getParameters().url,
				errorResponse.getParameters().reason,
				errorResponse.getParameters().errorCode,
				errorResponse.getParameters().statusText,
				errorResponse.getParameters().srcText,
				errorResponse.getParameters().line
			]);

			dialogService.showErrorDialog(bundle.getText('excecoes.tituloErroParse'), msgError);
		}

		/**
		 * @param  {Object} errorResponse 
		 */
		function onMetadataFailedToLoad(errorResponse) {

			let bundle = that.getModel('i18n').getResourceBundle();

			let msgError = bundle.getText('excecoes.erroObtencaoMetadata', [
				errorResponse.mParameters.request.requestUri,
				errorResponse.mParameters.message,
				errorResponse.getParameters().statusCode,
				errorResponse.mParameters.statusText,
				errorResponse.mParameters.response.body
			]);


			dialogService.showErrorDialog(bundle.getText('excecoes.tituloErroMetadata'), msgError);

		}

		/**Executado sempre que uma request HTTP falhar
		 * @param  {Object} errorResponse {description}
		 */
		function onRrequestFailed(errorResponse) {

			let bundle = that.getModel('i18n').getResourceBundle();

			//erros do tipo 412 (pre condition failed) devem ser tratados especificamente no retorno das chamadas.
			if (errorResponse.mParameters.response.statusCode === 412) {
				return;
			}

			let specificCSRFErrorMessage;

			let parsedErrorMessage;

			parsedErrorMessage = _isValidJSON(errorResponse.getParameters().response.responseText);

			if (!parsedErrorMessage) {
				parsedErrorMessage = errorResponse.getParameters().response.responseText;

			}

			if (parsedErrorMessage.indexOf && parsedErrorMessage.indexOf('CSRF') === 0) {
				specificCSRFErrorMessage = bundle.getText('excecoes.solucaoAcessoHTTPS');
			}

			let msg = bundle.getText('excecoes.erroRequisicao', [
				errorResponse.getParameters().url,
				errorResponse.getParameters().response.message,
				errorResponse.getParameters().response.statusCode,
				parsedErrorMessage.hasOwnProperty('error') ? parsedErrorMessage.error.message.value : parsedErrorMessage,
				specificCSRFErrorMessage
			]);

			dialogService.showErrorDialog(bundle.getText('excecoes.tituloErroRequisicao'), msg);

		}

	}
);