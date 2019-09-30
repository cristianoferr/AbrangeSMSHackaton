
/** Helper para centralizar os dialogos do sistema, precisa ser inicializado com o i18n da aplicação
 */

/* exported dialogService */
/* eslint no-var: 0 */
var dialogService;


sap.ui.define(['sap/m/MessageBox', 'sap/m/Dialog', 'sap/m/Text', 'sap/m/Button', 'sap/m/MessageToast'],
	function (MessageBox, Dialog, Text, Button, MessageToast) {
		dialogService = (function () {
			return {

				showErrorDialog,
				showMessageToast,
				showConfirmationDialog
			};


			function showMessageToast(msg) {

				MessageToast.show(msg);

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
					if (clickBtn === MessageBox.Action.YES) {
						if (fOnSuccess) {
							fOnSuccess(pars);
						}

					}
				};

				//mostra uma caixa de dialogo na tela.
				MessageBox.show(msg,
					MessageBox.Icon.WARNING,
					title,
					[MessageBox.Action.YES, MessageBox.Action.NO],
					fnOnClick,
					MessageBox.Action.YES);
			}

			/**
			 * Mostra um dialogo de erro na tela, apenas com o botão OK, é necessário passar o código i18n do titulo e o texto do corpo do dialogo
			 * @param {*} title
			 * @param {*} msg
			 */
			function showErrorDialog(title, msg) {
				let dialog = new Dialog({
					title: title,
					type: 'Message',
					state: 'Error',
					content: new Text({
						text: msg
					}),
					beginButton: new Button({
						text: 'OK',
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


		})();
	}());
