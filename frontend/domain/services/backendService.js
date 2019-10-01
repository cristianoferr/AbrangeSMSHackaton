/**
 * Esse service será responsável pela comunicação com o backend.
 * Centralizará a parte de consulta e salvamento  de dados.
 * Ele deve ser 'agnóstico': Não terá características específicas a um tipo de benefício.
 */
var backendService = (function () {
    "use strict";
    let that;

    return {
        bind,
        onSalvaAlerta
    };

    function onSalvaAlerta(evt){
        debugger;
    }

    function bind(_that) {
        that = _that;

    }

})();