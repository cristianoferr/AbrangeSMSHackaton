
// @ts-check
/** Helper para centralizar os dialogos do sistema, precisa ser inicializado com o i18n da aplicação
 */

var dialogService = (function () {
	jQuery.sap.require("sap.m.MessageBox");
	var bundle;

	return {
		setI18N: setI18N,
		dialogConfirmaExclusao: dialogConfirmaExclusao,
		dialogConfirmacao: dialogConfirmacao,
		metadataFailedToLoad: metadataFailedToLoad,
		parseError: parseError,
		bloqueiaAcessoNavegadorImcompativel: bloqueiaAcessoNavegadorImcompativel,
		dialogErro: dialogErro,
		dialogAviso,
		dialogSucesso,
		showErrorDialog,
		showMessageToast,
		showConfirmationDialog,
		errorService


	};

	/**
	 * função genérica que trata o erro retornado dos serviços
	 * @param {*} error 
	 */
	function errorService(error) {
		let mensagemErro = error.responseText;
		//vou fazer um tratamento melhor de erro nesses casos:
		if (mensagemErro.indexOf("{\"status\":\"error\"") == 0) {
			let objError = JSON.parse(error.responseText);
			mensagemErro = objError.message;
		}
		dialogErro("excecoes.tituloErroRequisicao", "Erro retornado:" + mensagemErro);
		console.error(error);
	}


	/**
	* Inicializa o bundle com o i18n passado por parametro
	* @param {*} i18N
	*/
	function setI18N(i18N) {
		bundle = i18N.getResourceBundle();
	}

	function showMessageToast(msg) {

		sap.m.MessageToast.show(msg);

	}

	/** Mostra um dialogo de confirmação genérico
	 *  a função fOnSuccess é chamada se o usuário confirmar
	 * @function dialogConfirmacao
	*  @param {*} title : código i18n que será mostrado como título da mensagem
	 * @param {*} msg : código i18n que será mostrado como corpo da mensagem
	 * @param {*} fOnSuccess       função que será chamada caso o usuário clique em YES, se clicar em NO então a função não é chamada
	 * @param {*} pars      objeto opcional passado para a função fOnSuccess acima
	 */
	function showConfirmationDialog(title, msg, fOnSuccess, pars) {
		//função que é chamada quando o usuário clica em alguma ação, preciso tratar para apenas disparar o fOnSuccess quando for clicado no YES
		var fnOnClick = function (clickBtn) {
			if (clickBtn === sap.m.MessageBox.Action.YES) {
				if (fOnSuccess) {
					fOnSuccess(pars);
				}

			}
		};

		//mostra uma caixa de dialogo na tela.
		sap.m.MessageBox.show(msg,
			sap.m.MessageBox.Icon.WARNING,
			title,
			[sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			fnOnClick,
			sap.m.MessageBox.Action.YES);
	}

	/**
	 * Mostra um dialogo de erro na tela, apenas com o botão OK, é necessário passar o código i18n do titulo e o texto do corpo do dialogo
	 * @param {*} title
	 * @param {*} msg
	 */
	function showErrorDialog(title, msg) {
		let dialog = new sap.m.Dialog({
			title: title,
			type: "Message",
			state: "Error",
			content: new sap.m.Text({
				text: msg
			}),
			beginButton: new sap.m.Button({
				text: "OK",
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function () {
				dialog.destroy();
			}
		});

		dialog.open();
	}


	/**
   * Mostra um dialogo de aviso na tela, apenas com o botão OK, é necessário passar o código i18n do titulo e o texto do corpo do dialogo
   * @param {*} i18nTitulo
   * @param {*} textoCorpo
   */
	function dialogAviso(i18nTitulo, textoCorpo) {
		showDialog(i18nTitulo, textoCorpo, "Warning");
	}

	/**
 * Mostra um dialogo de sucesso na tela, apenas com o botão OK, é necessário passar o código i18n do titulo e o texto do corpo do dialogo
 * @param {*} i18nTitulo
 * @param {*} textoCorpo
 */
	function dialogSucesso(i18nTitulo, textoCorpo, fCallback) {
		showDialog(i18nTitulo, textoCorpo, "Success", fCallback);
	}

	/** Mostra um dialogo de confirmação de exclusão
	 *  a função fOnSuccess é chamada se o usuário confirmar
	 * @function dialogConfirmaExclusao
	 * @param {*} i18nConfirmacao : código i18n que será mostrado como corpo da mensagem
	 * @param {*} fOnSuccess       função que será chamada caso o usuário clique em YES, se clicar em NO então a função não é chamada
	 * @param {*} pars      objeto opcional passado para a função fOnSuccess acima
	 */
	function dialogConfirmaExclusao(i18nConfirmacao, fOnSuccess, pars) {
		dialogConfirmacao("dialog.confirmaExclusao", i18nConfirmacao, fOnSuccess, pars);
	}


	/** Mostra um dialogo de confirmação genérico
	 *  a função fOnSuccess é chamada se o usuário confirmar
	 * @function dialogConfirmacao
	*  @param {*} i18nTitulo : código i18n que será mostrado como título da mensagem
	 * @param {*} i18nConfirmacao : código i18n que será mostrado como corpo da mensagem
	 * @param {*} fOnSuccess       função que será chamada caso o usuário clique em YES, se clicar em NO então a função não é chamada
	 * @param {*} pars      objeto opcional passado para a função fOnSuccess acima
	 */
	function dialogConfirmacao(i18nTitulo, i18nConfirmacao, fOnSuccess, pars) {
		//função que é chamada quando o usuário clica em alguma ação, preciso tratar para apenas disparar o fOnSuccess quando for clicado no YES
		let dialog = new sap.m.Dialog({
			title: bundle.getText(i18nTitulo),
			type: "Standard",
			state: "Warning",
			content: new sap.m.Text({
				text: bundle.getText(i18nConfirmacao)
			}),
			beginButton: new sap.m.Button({
				text: bundle.getText("generico.sim"),
				type: "Transparent",
				press: function () {
					if (fOnSuccess) {
						fOnSuccess(pars);
					}
					dialog.close();
				}
			}),
			endButton: new sap.m.Button({
				text: bundle.getText("generico.nao"),
				type: "Transparent",
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function () {
				dialog.destroy();
			}
		});

		dialog.open();
	}

	/**
	 * Mostra um dialogo de erro na tela, apenas com o botão OK, é necessário passar o código i18n do titulo e o texto do corpo do dialogo
	 * @param {*} i18nTitulo
	 * @param {*} textoCorpo
	 */
	function dialogErro(i18nTitulo, textoCorpo) {
		showDialog(i18nTitulo, textoCorpo, "Error");
	}

	/**
	* Caso algum navegador imcompatível acesse a aplicação, uma mensagem de erro é mostrada orientando o usuario a utilizar uma navegador compatível.
	* @function bloqueiaAcessoNavegadorImcompativel
	*/
	function bloqueiaAcessoNavegadorImcompativel() {

		if (verificarFirefoxMenor45()) {
			let msg = bundle.getText("navegadorImcompativel.descricao");
			dialogErro("navegadorImcompativel.titulo", msg);
		}
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

	/** Executado sempre que ocorrer um erro de parse nas requisições para o backend
		 * @function parseError
		 * @param  {Object} responseError {description}
		 */
	function parseError(responseError) {
		let msgError = bundle.getText("erro.erroParse", [
			responseError.getParameters().url,
			responseError.getParameters().reason,
			responseError.getParameters().errorCode,
			responseError.getParameters().statusText,
			responseError.getParameters().srcText,
			responseError.getParameters().line
		]);

		dialogErro("erro.tituloErroParse", msgError);
	}


	

	/** Executado sempre que a obtenção do arquivo metadata.xml falhar
	 * @function metadataFailedToLoad
	 * @param  {Object} responseError {description}
	 */
	function metadataFailedToLoad(responseError) {
		let msgError = bundle.getText("erro.descricaoErroMetadata", [
			"Url do serviço",
			responseError.mParameters.message,
			responseError.getParameters().statusCode,
			responseError.mParameters.statusText,
			responseError.mParameters.response.body
		]);

		dialogErro("erro.tituloMetadata", msgError);
	}

	function showDialog(i18nTitulo, textoCorpo, tipo, fCallback) {
		let dialog = new sap.m.Dialog({
			title: bundle.getText(i18nTitulo),
			type: "Message",
			state: tipo,
			content: new sap.m.Text({
				text: textoCorpo
			}),
			beginButton: new sap.m.Button({
				text: "OK",
				type: "Transparent",
				press: function () {

					dialog.close();
				}
			}),
			afterClose: function () {
				dialog.destroy();
				if (fCallback) {
					fCallback();
				}
			}
		});

		dialog.open();
	}


})();
