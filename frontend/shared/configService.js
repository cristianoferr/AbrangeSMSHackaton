/** Responsável por exemplificar o uso de um arquivo JS como se fosse um módulo do SAPUI5.
 * @function IIFE
 *  @return {Object} objeto com funções a serem usadas ao longo da aplicação
 */

/* exported configService */
/* eslint no-var: 0 */
var configService = (function () {
	'use strict';
	return {
		getServiceUrl: getServiceUrl
	};

	/** Obtém a URL utilizada para configurar o odataModel
	 * @function getServiceUrl
	 * @return {String} url que possui os serviços ODATA
	 */
	function getServiceUrl() {
		let serviceUrl = '/sap/opu/odata/sap/nomeServicoGateway';

		//caso o ambiente em ypd estiver fora, é possível fazer o deploy em um servidor local. Neste caso
		//será preciso configurar um proxy para evitar problemas de cross origin request. Eu uso uma configuração
		//do proprio eclipse que sobe um proxy e intercepta as chamadas com 'proxy/' e as direciona para um servidor configurado.
		//(ver web.xml na pasta do projeto)
		if (
			window.location.hostname === 'localhost' ||
			window.location.hostname === '127.0.0.1'
		) {
			return 'proxy' + serviceUrl;
		}

		return serviceUrl;
	}
})();