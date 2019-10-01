sap.ui.define(
	['sap/ui/core/mvc/Controller', 'sap/ui/core/routing/History'],

	/**
	 * Controlador abstrato que deve ser extendido por todos os controladores da aplicação. Nele só deve existir
	 * códigos com alto potencial de reúso por todos os outros controladores.
	 * Como este controlador não será nunca instanciado diretamente, a convenção  *.controller.js não se aplica,
	 * Ao não utilizar esta convenção, nós prevenimos o seu uso em qualquer view.
	 * @function Anonymous
	 * @param  {Object} Controller   {description}
	 * @param  {Object} History      {description}
	 */
	function (Controller, History) {
		'use strict';
		return Controller.extend(
			'templateHackaton.shared.baseController', {
				getRouter: getRouter,
				onNavBack: onNavBack,
				getI18NTranslation: getI18NTranslation,
				navigateToRoute: navigateToRoute,
				findById,
				getProperty,
				setProperty,
				getModel,
				formatter

			}
		);

		/**
	 * função genérica para setar a propriedade de um modelo
	 */
	function setProperty(property, value) {
		let arrProps = property.split(">");
		if (arrProps.length == 1) {
			return this.getModel().setProperty(property, value);
		}
		return this.getModel(arrProps[0]).setProperty(arrProps[1], value);
	}

	/**
	 * função genérica para retornar a propriedade de um modelo
	 */
	function getProperty(property) {
		let arrProps = property.split(">");
		if (arrProps.length == 1) {
			return this.getModel().getProperty(property);
		}
		return this.getModel(arrProps[0]).getProperty(arrProps[1]);
	}

	/**
         * Retorna o model da view com o nome informado
         * @param {string} [modelName]   (opcional)
         */
		function getModel(modelName) {
			return this.getView().getModel(modelName);
		}

	/**
	 * retorna um filho que tenha o sId identificado (nem sempre o byId funciona como deveria)
	 * @param {*} sId 
	 */
	function findById(sId) {
		let list = this.getView().findElements(true).filter(x => x.sId == sId);
		if (list.length == 1) return list[0];
		return null;
	}

		/** Responsável por obter o objeto roteador do SAPUI5. Através dele é possível navegar para as diferentes rotas configuradas no manifest.js.
		 * @function getRouter
		 * @return {Object} Roteador SAPUI5 utilizado para navegar para rotas específicas, por exemplo.
		 */
		function getRouter() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}


		/**
		 * Traduz a chave i18n informada pelo usuário
		 * @param {string} chave
		 */
		function getI18NTranslation(chave) {
			if (chave === '' || chave === null) {
				return '';
			}
			return this.getView().getModel('i18n').getProperty(chave);
		}

		/**
		* Navega para a rota informada em 'rota', opcionalmente passando os parametros informados em params
		* @param {string} rota
		* @param {Object} [params]
		*/
		function navigateToRoute(rota, params, notIncludeInHistory = false) {
			this.getRouter().navTo(rota, params, notIncludeInHistory);
		}

		/**
		 * Método responsável pela navegação de retorno. Caso exista navegação anterior definida no navegador, ele retorna para tal página.
		 * Se não existir, ele retorna para home.
		 * @param {*} notIncludeInHistory indica se na navegação, uma entrada na tabela de history do navegador deve ser inserida
		 */
		function onNavBack(notIncludeInHistory = false) {
			let oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo('appHome', {}, notIncludeInHistory);
			}
		}
	}
);