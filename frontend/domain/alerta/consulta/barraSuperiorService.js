var barraSuperiorService = (function () {
    let that;

    return {
        bind,
        navBack,
        countNotificacoesNaoLidas,
        countTypeState,
        onListaPendentes
    }


    function onListaPendentes(){
        that.navigateToRoute("routeConsultaPendentes");
    }
    
    function countNotificacoesNaoLidas(arr) {
        if (!arr) { return ""; }
        arr=arr.filter(x=>!x.lido);
        if ( arr.length == 0) { return ""; }
        return arr.length;
    }
    function countTypeState(arr) {
        if (!arr) { return "Transparent"; }
        arr=arr.filter(x=>!x.lido);
        if ( arr.length == 0) { return "Transparent"; }
        return "Reject";
    }

    function navBack() {
        that.navigateToRoute(that.getModel("viewModel").getProperty("/backRoute"));
    }

    /**
   * Init necessário para pegar a referencia do model com as propriedades
   * @param {*} _viewModel 
   * @param {*} _that - referencia ao controller em uso, não deve ser usado para acessar elementos de tela (idealmente apenas para 'traduzChave')
   */
    function bind(_that) {
        that = _that;

    }
})();