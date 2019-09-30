/** Responsável por fornecer funcionalidades transversais a aplicação
 * @function toolsService
 *  @return {Object} objeto com funções a serem usadas ao longo da aplicação
 */

/* exported toolsService */
/* eslint no-var: 0 */
var toolsService = (function () {
	'use strict';
	return {
		adicionarTelaProgresso,
		removerTelaProgresso,
		getUserPicture,
		getTypeChecker,
		hasProp
	};

	function adicionarTelaProgresso() {
		$('#sap-ui-preserve').removeClass('sapUiHidden');
		$('#sap-ui-preserve').removeClass('sapUiForcedHidden');
	}

	function removerTelaProgresso() {
		$('#sap-ui-preserve').addClass('sapUiHidden');
		$('#sap-ui-preserve').addClass('sapUiForcedHidden');
	}

	/**
	 * Retorna uma url do conecte com a imagem do usuário a partir da chave informada. Caso seja informada uma chave ABAP,
	 * o 'ABAP' será ignorado.
	 * @param {String} chave 
	 */
	function getUserPicture(chave) {

		if (!chave) {

			return null;
		}
		return 'https://conecte.petrobras.com.br/profiles/photo2.do?r=true&userid=' + chave.toUpperCase().replace('ABAP', '');
	}


	/**
	 * Verifica se determinada propriedade existe em um objeto
	 * @param {*} obj objeto a ser avaliado
	 * @param {*} prop propriedade que terá a existência avaliada
	 */
	function hasProp(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}


	/**
	* Baseado no artigo do Todd Motto para verificação de tipos em JS
	* https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/
	*/
	function getTypeChecker() {

		var exports = {};

		//cria um array com as primitivas e objetos do JS
		var types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ');


		//esta função obtém o resultado da execução do método toString() de um valor (representado por this) e retorna somente a segunda string
		//retornada. Por exemplo: {}.toString() normalmente retorna [Object Object]. Este método retorna, neste caso, Object
		var typeFn = function () {
			return Object.prototype.toString.call(this).slice(8, -1);
		};


		//este forEach cria uma propriedade para cada tipo definido em types no objeto exports. Para cada propriedade, uma função é criada do tipo isXXX
		//na qual é verificado se de fato o elemento passado por parâmetro é de determinado tipo. Por exemplo, a primeira posição do vetor exports é
		//exports['isArray'] e o método dentro dele quando utilizado verifica se o parâmetro passado é de fato um array.
		types
			.forEach((primObjectType, i) => {

				exports['is' + primObjectType] = ((type) => {

					return (elem) => {
						return typeFn.call(elem) === type;
					};
				})(types[i]);
			});

		return exports;

	}

})();