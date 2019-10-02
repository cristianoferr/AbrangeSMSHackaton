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
        onSalvaAlerta,
        carregaDadosBackend
    };

    function onSalvaAlerta(evt) {
        debugger;
    }

    function carregaDadosBackend(callback) {
        let instalacoes = that.getModel("instalacoes").getProperty("/instalacoesGeolocalizadas")
        that.getModel("dominio").setProperty("/instalacoes", instalacoes);
        locatorService.executaRequisicaoGeografica().then(callback);
    }

    function bind(_that) {
        that = _that;

    }

})();