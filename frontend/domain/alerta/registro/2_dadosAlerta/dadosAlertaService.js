

var dadosAlertaService = (function () {
    "use strict";
    let that;


    return {
        bind,
        adicionaRegrasPendencias,
        onSalvarCuidado,
        onExcluirCuidado,
        onSalvarMotivo,
        onExcluirMotivo,
        onSalvarComoEvitar,
        onExcluirComoEvitar,
        onSalvarAcaoAndamento,
        onExcluirAcaoAndamento

    };
    function adicionaRegrasPendencias() {
        pendenciaService.addRegra(0, "viewModel>/alerta/titulo", that.getI18NTranslation("pendencia.titulo"));
        pendenciaService.addRegra(0, "viewModel>/alerta/descricao", that.getI18NTranslation("pendencia.descricao"));
        pendenciaService.addRegra(0, "viewModel>/alerta/dataOcorrencia", that.getI18NTranslation("pendencia.dataOcorrencia"));
        pendenciaService.addRegra(0, "viewModel>/alerta/dataEmissao", that.getI18NTranslation("pendencia.dataEmissao"));
        pendenciaService.addRegra(0, "viewModel>/alerta/instalacao", that.getI18NTranslation("pendencia.instalacao"));
    }

    function bind(_that) {
        that = _that;
    }

    function onSalvarCuidado(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/cuidados");
        let max = 1;
        cuidados.forEach(x => {
        x.empty = false;
            if (x.passo >= max) { max = x.passo + 1; }
        });
        cuidados.push({ passo: max, empty: true });
        that.setProperty("viewModel>/alerta/cuidados", cuidados);
    }

    function onExcluirCuidado(evt) {
        let path = evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/cuidados");
        let cuidadoExcluido = that.getProperty("viewModel>" + path);
        cuidados = cuidados.filter(x => x != cuidadoExcluido);
        that.setProperty("viewModel>/alerta/cuidados", cuidados);
    }

    function onSalvarMotivo(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/motivos");
        cuidados.forEach(x => x.empty = false);
        cuidados.push({ empty: true });
        that.setProperty("viewModel>/alerta/motivos", cuidados);
    }

    function onExcluirMotivo(evt) {
        let path = evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/motivos");
        let cuidadoExcluido = that.getProperty("viewModel>" + path);
        cuidados = cuidados.filter(x => x != cuidadoExcluido);
        that.setProperty("viewModel>/alerta/motivos", cuidados);
    }

    function onSalvarComoEvitar(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/comoEvitar");
        cuidados.forEach(x => x.empty = false);
        cuidados.push({ empty: true });
        that.setProperty("viewModel>/alerta/comoEvitar", cuidados);
    }

    function onExcluirComoEvitar(evt) {
        let path = evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/comoEvitar");
        let cuidadoExcluido = that.getProperty("viewModel>" + path);
        cuidados = cuidados.filter(x => x != cuidadoExcluido);
        that.setProperty("viewModel>/alerta/comoEvitar", cuidados);
    }

    function onSalvarAcaoAndamento(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/acoesEmAndamento");
        cuidados.forEach(x => x.empty = false);
        cuidados.push({ empty: true });
        that.setProperty("viewModel>/alerta/acoesEmAndamento", cuidados);
    }

    function onExcluirAcaoAndamento(evt) {
        let path = evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/acoesEmAndamento");
        let cuidadoExcluido = that.getProperty("viewModel>" + path);
        cuidados = cuidados.filter(x => x != cuidadoExcluido);
        that.setProperty("viewModel>/alerta/acoesEmAndamento", cuidados);
    }
})();

