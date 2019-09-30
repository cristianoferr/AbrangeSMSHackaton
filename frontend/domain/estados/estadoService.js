var estadoService = (function () {
    let that;

    return {
        bind,
        onFechaDialogo,
        onAbreDialog,
        onSalvar,
        onExcluir,
        onNovoEstado,
        onGravaNovoEstado

    }

    function onGravaNovoEstado(evt) {
        that.getModel().create(`/Estados`,
            that.getProperty("viewModel>/novoEstado"),
            {
                success: function (data) {
                    dialogService.showMessageToast("Estado incluído com Sucesso!");
                    atualizaLista();
                },
                error: dialogService.errorService,
            });
    }

    /**
     * abre um popover 
     * @param {*} evt 
     */
    function onNovoEstado(evt) {
        if (!that._novoEstado) {
            that._novoEstado = sap.ui
                .xmlfragment(
                    "templateHackaton.domain.estados.novoEstadoPopover",
                    that);
            that.getView().addDependent(that._novoEstado);
        }

        that.setProperty("viewModel>/novoEstado", { sigla: '', nome: '' });
        that._novoEstado.bindElement("viewModel>/novoEstado");

        that._novoEstado.openBy(evt.getSource());
    }

    function onAbreDialog(sourceView) {

        //abro o dialog
        if (!that.listaEstados) {
            that.listaEstados = sap.ui.xmlfragment("templateHackaton.domain.estados.listaEstadosDialog", that);
            that.getView().addDependent(that.listaEstados);
        }
        that.listaEstados.open();

    }

    /**
     * atualiza (do backend) a lista da tela
     */
    function atualizaLista() {
        that.getModel().refresh();
    }


    /**
     * evento de exclusão
     * @param {*} evt 
     */
    function onExcluir(evt) {

        let source = evt.getSource();
        let fnExclusao = function () {
            that.getModel().remove(`/Estados/${source.data().sigla}`,
                {
                    success: function (data) {
                        dialogService.showMessageToast("Estado removido com Sucesso!");
                        atualizaLista();
                    },
                    error: dialogService.errorService,
                });
        }
        dialogService.dialogConfirmaExclusao("dialog.confirmaExclusao", fnExclusao);
    }



    function onSalvar(evt) {
        let source = evt.getSource();
        that.getModel().update(`/Estados/${source.data().sigla}`,
            {
                nome: that.getProperty(source.getBindingContext().sPath + "/nome")
            },
            {
                success: function (data) {
                    dialogService.showMessageToast("Estado atualizado com Sucesso!");
                    atualizaLista();
                },
                error: dialogService.errorService,
            });
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