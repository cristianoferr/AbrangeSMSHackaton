

var dadosAlertaService = (function () {
    "use strict";
    let that;

    let cuidadoSeq=0;

    return {
        bind,
        adicionaRegrasPendencias,
        onSalvarCuidado,
        onExcluirCuidado,
        onSalvarMotivo,
        onExcluirMotivo,
        onSalvarComoEvitar,
        onExcluirComoEvitar

    };
    function adicionaRegrasPendencias() {
        pendenciaService.addRegra(0, "viewModel>/anomalia/numero", that.getI18NTranslation("pendencia.numero"));
        pendenciaService.addRegra(0, "viewModel>/anomalia/titulo", that.getI18NTranslation("pendencia.titulo"));
        pendenciaService.addRegra(0, "viewModel>/anomalia/descricao", that.getI18NTranslation("pendencia.descricao"));
    }

    function bind(_that) {
        that = _that;
    }

    function onSalvarCuidado(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/cuidados");
        cuidados.forEach(x => x.empty = false);
        cuidados.push({ passo: ++cuidadoSeq, empty: true });
        that.setProperty("viewModel>/alerta/cuidados",cuidados);
    }

    function onExcluirCuidado(evt) {
        let path=evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/cuidados");
        let cuidadoExcluido = that.getProperty("viewModel>"+path);
        cuidados=cuidados.filter(x=>x!=cuidadoExcluido);
        that.setProperty("viewModel>/alerta/cuidados",cuidados);
    }

    function onSalvarMotivo(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/motivos");
        cuidados.forEach(x => x.empty = false);
        cuidados.push({empty: true });
        that.setProperty("viewModel>/alerta/motivos",cuidados);
    }

    function onExcluirMotivo(evt) {
        let path=evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/motivos");
        let cuidadoExcluido = that.getProperty("viewModel>"+path);
        cuidados=cuidados.filter(x=>x!=cuidadoExcluido);
        that.setProperty("viewModel>/alerta/motivos",cuidados);
    }

    function onSalvarComoEvitar(evt) {
        let cuidados = that.getProperty("viewModel>/alerta/comoEvitar");
        cuidados.forEach(x => x.empty = false);
        cuidados.push({ empty: true });
        that.setProperty("viewModel>/alerta/comoEvitar",cuidados);
    }

    function onExcluirComoEvitar(evt) {
        let path=evt.oSource.getBindingContext("viewModel").sPath;
        let cuidados = that.getProperty("viewModel>/alerta/comoEvitar");
        let cuidadoExcluido = that.getProperty("viewModel>"+path);
        cuidados=cuidados.filter(x=>x!=cuidadoExcluido);
        that.setProperty("viewModel>/alerta/comoEvitar",cuidados);
    }


})();

