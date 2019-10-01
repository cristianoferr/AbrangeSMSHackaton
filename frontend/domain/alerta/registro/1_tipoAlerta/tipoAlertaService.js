

var tipoAlertaService = (function () {
    "use strict";
    let that;
    
    return {
        onPressAlerta,
        getInfoTile,
        bind,
        getCssTile,
        adicionaRegrasPendencias

    };
    function adicionaRegrasPendencias(){
        pendenciaService.addRegra(0, "viewModel>/anomalia/tipoAlerta", that.getI18NTranslation("pendencia.tipoAlerta"));
    }

    function bind(_that) {
        that = _that;
    }

    function getCssTile(tipoSelecionado, tipoTile) {
        if (tipoSelecionado == undefined) {
            return "";
        }
        if (tipoSelecionado == tipoTile) {
            return "tileSelecionado";
        }
        return "";
    }

    function getInfoTile(tipoSelecionado, tipoTile) {
        if (tipoSelecionado == undefined) {
            return "";
        }
        if (tipoSelecionado == tipoTile) {
            return "Selecionado";
        }
        return "";
    }

    function onPressAlerta(evt) {
        that.iniciaRegistro(evt.getSource().data().idAlerta);
        pendenciaService.validaPendencias();
    }

})();

