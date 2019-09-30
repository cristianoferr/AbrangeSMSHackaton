/**
 * Esse service se preocupa com a inicialização da aplicação, fazendo checagens de navegador
 * ligando tratamento de exceções globais e equivalentes
 * 
 */
var initializerService = (function () {
    "use strict";
    let that;
    var bundle;

    return {
        bind,
        onParseError,
        onMetadataFailedToLoad,
        onRequestFailed
    };


    function _isValidJSON(value) {

        try {
            return JSON.parse(value);

        } catch (e) {

            return null;
        }

    }

    /** 
 * Verifica se o firefox utilizado está numa versão menor que a 45. Em teste no firefox 31, a aplicação não iniciou corretamente.
 * Na época o navegador homologado pela petrobras era o FF 45. O metodo retorna false se a versao for maior do que a versão 45 ou se o navegador 
 * nao for o firefox
 * @function verificarFirefoxMenor45
 * @return true se a versão do FF usada para acessar a aplicação for menor que a 45 e false caso contrário
 */
    function verificarFirefoxMenor45() {
        let match = navigator.userAgent.match(/Firefox\/([0-9]+)\./);
        let versao = match ? parseInt(match[1]) : 100000; //se nao tiver a string firefox no user agent, versao recebe 100000.

        return versao < 45;
    }


    /**
* Caso algum navegador imcompatível acesse a aplicação, uma mensagem de erro é mostrada orientando o usuario a utilizar uma navegador compatível.
* @function bloqueiaAcessoNavegadorImcompativel
*/
    function bloqueiaAcessoNavegadorImcompativel() {

        let bundle = that.getModel('i18n').getResourceBundle();

        if (verificarFirefoxMenor45()) {

            let msg = bundle.getText('navegadorImcompativel.descricao');
            let titulo = bundle.getText('navegadorImcompativel.titulo');

            dialogService.showErrorDialog(titulo, msg);
        }
    }

    /**
     * 
     * @param {*} errorResponse 
     */
    function onParseError(errorResponse) {

        let msgError = bundle.getText('excecoes.erroParse', [
            errorResponse.getParameters().url,
            errorResponse.getParameters().reason,
            errorResponse.getParameters().errorCode,
            errorResponse.getParameters().statusText,
            errorResponse.getParameters().srcText,
            errorResponse.getParameters().line
        ]);

        dialogService.showErrorDialog(bundle.getText('excecoes.tituloErroParse'), msgError);
    }

    /**
     * @param  {Object} errorResponse 
     */
    function onMetadataFailedToLoad(errorResponse) {
        let msgError = bundle.getText('excecoes.erroObtencaoMetadata', [
            errorResponse.mParameters.request.requestUri,
            errorResponse.mParameters.message,
            errorResponse.getParameters().statusCode,
            errorResponse.mParameters.statusText,
            errorResponse.mParameters.response.body
        ]);
        dialogService.showErrorDialog(bundle.getText('excecoes.tituloErroMetadata'), msgError);

    }

    function _isValidJSON(value) {

        try {
            return JSON.parse(value);

        } catch (e) {

            return null;
        }

    }

    /**Executado sempre que uma request HTTP falhar
     * @param  {Object} errorResponse {description}
     */
    function onRequestFailed(errorResponse) {
        //erros do tipo 412 (pre condition failed) devem ser tratados especificamente no retorno das chamadas.
        if (errorResponse.mParameters.response.statusCode === 412) {
            return;
        }

        let specificCSRFErrorMessage;

        let parsedErrorMessage;

        parsedErrorMessage = _isValidJSON(errorResponse.getParameters().response.responseText);

        if (!parsedErrorMessage) {
            parsedErrorMessage = errorResponse.getParameters().response.responseText;

        }

        if (parsedErrorMessage.indexOf && parsedErrorMessage.indexOf('CSRF') === 0) {
            specificCSRFErrorMessage = bundle.getText('excecoes.solucaoAcessoHTTPS');
        }

        let msg = bundle.getText('excecoes.erroRequisicao', [
            errorResponse.getParameters().url,
            errorResponse.getParameters().response.message,
            errorResponse.getParameters().response.statusCode,
            parsedErrorMessage.hasOwnProperty('error') ? parsedErrorMessage.error.message.value : parsedErrorMessage,
            specificCSRFErrorMessage
        ]);

        //dialogService.showErrorDialog(bundle.getText('excecoes.tituloErroRequisicao'), msg);
        console.error(msg);


    }

    function definirlinguagemConfiguradaNavegador() {
        sap.ui.getCore().getConfiguration().setLanguage(window.navigator.language);
    }


    function bind(_that) {
        that = _that;
        //evito mostrar erros de odata onde seto uma propriedade que não existe (com dados locais)
        console.assert = function (result, message) {
            if (result) {
                console.warning(message);
            }
        }

        bloqueiaAcessoNavegadorImcompativel.apply(that);
        bundle = that.getModel('i18n').getResourceBundle();
        definirDeviceModel.apply(that);
        definirTituloAbaNavegador.apply(that);
        definirlinguagemConfiguradaNavegador();
        ativarTratamentoExcecaoGlobal();
    }

    function ativarTratamentoExcecaoGlobal() {
        window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
            sap.ui.core.BusyIndicator.hide();
            jQuery.sap.log.error(errorMsg);

            window.alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' +
                lineNumber +
                ' Column: ' + column + ' StackTrace: ' + errorObj +
                '. Recarregue a página e se o erro persistir, entre em contato com o 881 enviando um print screen dessa mensagem'
            );
        };


    };

    /**
     * O título da janela é atualizado automaticamente, não sendo mais necessário setar na mão o título e a versão: os mesmos são pegos do i18n.
     */
    function definirTituloAbaNavegador() {
        let bundle = that.getModel('i18n').getResourceBundle();

        let appTitle = bundle.getText('appTitulo');
        let appVersion = bundle.getText('appVersion');
        document.title = appTitle + ' - ' + appVersion;
    }


    /**
     * Configura um model com as características do dispositivo que a aplicação estiver executando.
     * A idéia é usar este model ao longo da aplicação para mudar o comportamento da aplicação em relação ao dispositivo onde a mesma
     * está executando
     * @function definirDeviceModel
     * @return {type} {description}
     */
    function definirDeviceModel() {

        let deviceModel = that.getModel('device');
        deviceModel.setData({
            rootPath: jQuery.sap.getModulePath(that.getManifest()["sap.app"].id) + "/",
            isTouch: sap.ui.Device.support.touch,
            isNoTouch: !sap.ui.Device.support.touch,
            isPhone: sap.ui.Device.system.phone,
            isNoPhone: !sap.ui.Device.system.phone,
            isDesktop: sap.ui.Device.system.desktop,
            isNoDesktop: !sap.ui.Device.system.desktop,
            listMode: sap.ui.Device.system.phone ? 'None' : 'SingleSelectMaster',
            listItemType: sap.ui.Device.system.phone ? 'Active' : 'Inactive'
        });
    }


})();