
/**
 * Responsável por obter o usuário autenticado. Perceba que o método privado _getAuthModel() faz
 * referência ao this para obter o model correspondente. Isso significa que esse this deve ser redefinido no momento da chamada
 */

/* exported userService */
/* eslint no-var: 0 */
var userService = (function () {

	'use strict';

	let _authModel;
	const AUTHPATH = '/UsuarioAutenticadoSet';

	return {

		getAuthenticatedUser

	};

	/**
	 * Singleton que obtém o model que foi configurado para obter o usuário autenticado. Perceba que o método faz
	 * referência ao this para obter o model correspondente. Isso significa que esse this deve ser redefinido no momento da chamada deste método.
	 */
	function _getAuthModel() {

		if (!_authModel) {

			_authModel = this.getOwnerComponent().getModel('authModel');
		}

		return _authModel;

	}

	/**
	 * Obtém a chave do usuário autenticado. Se o serviço retornar de foram bem sucedida mas não possuir uma estrutura com a propriedade CHAVE, null é retornado. Caso ocorra algum erro, o response é retornado. 
	 */
	function getAuthenticatedUser() {

		return new Promise((resolve, reject) => {

			_getAuthModel.call(this)
				.read(AUTHPATH, {
					success: response => {

						if (response.results && response.results.length > 0) {

							resolve({ chave: response.results[0].CHAVE, empresa: response.results[0].FRENTE, nome: response.results[0].NOME });
						}

						else {

							reject(null);

						}

					}, error: response => reject(response)
				});
		});

	}

})();