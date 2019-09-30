/**
 * Retorna um objeto com funções básicas para formatação e conversão de dados
 */

/* exported dateFormatter */
/* eslint no-var: 0 */
var dateFormatter = sap.ui.define(
	[],
	(function () {
		'use strict';
		return {
			formatDateBrazillianPattern,
			formatDateTimeBrazillianPattern,
			convertJsonDateToJavaScriptDate,

		};

		/**
			 * Formata uma data no formato dd.MM.yyyy
			 * @param {Date} jsDate Precisa ser uma data javascript 
			 */
		function formatDateBrazillianPattern(jsDate) {

			if (jsDate) {

				return moment(jsDate).format('DD/MM/YYYY');

			} else {
				return null;
			}
		}

		/**
		 * Formata uma data no formato 'dd.MM.yyyy as HH:mm'
		 * @param {Date} jsDate data no formato javascript
		 */
		function formatDateTimeBrazillianPattern(jsDate) {

			if (jsDate) {

				moment(jsDate).format('DD/MM/YYYY HH:mm');

			} else {
				return null;
			}

		}

		/**
		 * 
		 * @param {String} value string no formato /Date(dataEmmMiliSegundos)/ por exemplo /Date(1546214400000)/ 
		 */
		function convertJsonDateToJavaScriptDate(jsonDate) {

			if (jsonDate) {
				moment(jsonDate).format('DD/MM/YYYY HH:mm');
			}

			else {
				return null;
			}
		}

	}));