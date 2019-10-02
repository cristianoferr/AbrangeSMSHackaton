var barraSuperiorService = (function () {
    let that;

    return {
        bind,
        navBack
    }

    function navBack(){
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