var estadoService = (function () {
    let that;

    return {
        bind,
        onFechaDialogo,
        onAbreDialog

    }

    function onAbreDialog(sourceView) {

        //abro o dialog
        if (!that.listaEstados) {
            that.listaEstados = sap.ui.xmlfragment("templateHackaton.domain.estados.listaEstadosDialog", that);
            that.getView().addDependent(that.listaEstados);
        }
        that.listaEstados.open();

    }


    function onFechaDialogo() {
        that.listaEstados.close();
    }

    /**
     * faz o bind com o controller
     * @param {*} _that 
     */
    function bind(_that) {
        that = _that;
    }

})();