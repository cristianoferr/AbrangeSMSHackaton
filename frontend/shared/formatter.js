/**
 * Retorna um objeto com funções básicas para formatação e conversão de dados
 */

var formatter = (function () {
    "use strict";
    return {
        contemValor,
        getTypePendenciaCount,
        removeAcento,
        contemValor
    };




    function contemValor(val) {
        return val != undefined && val != "";
    }

    /**
   * Retorna um 'type' para o botão de pendencias, 
   */
    function getTypePendenciaCount(pendenciaCount) {
        if (pendenciaCount === 0) {
            return "Accept";
        } else {
            return "Reject";
        }
    }


    function removeAcento(text) {
        text = text.toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    }

    function contemValor(val) {
        return val != undefined && val != "";
    }



})();

