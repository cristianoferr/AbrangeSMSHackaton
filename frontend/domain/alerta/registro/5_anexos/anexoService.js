

var anexoService = (function () {
    "use strict";
    let that;

    let uploadControl;

    return {
        onChange,
        bind,
        adicionaRegrasPendencias,
        limpaAnexos

    };
    function adicionaRegrasPendencias() {

    }

    function limpaAnexos() {
        uploadControl.removeAllItems();
    }

    function bind(_that) {
        that = _that;
        uploadControl = that.getView().byId("UploadCollection");

        //pega o token csrf
        if (that._token) {
            return;
        }
        var metaUrl = that.getModel().sServiceUrl + "/$metadata";
        $.ajax({
            url: metaUrl,
            type: "GET",
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRF-Token", "Fetch");
            },
            complete: function (xhr) {
                that._token = xhr.getResponseHeader("X-CSRF-Token");
            }
        });

    }


    /**
     * Sempre que um usuário inserir um arquivo no uploadCollection, este método é disparado.
     * Nele eu verifico se o arquivo passa pelos pré-requisitos (se ele for maior que o tamanho permitido, eu tento reduzí-lo). Caso ele passe, eu o adiciono como uma propriedade (jsFile) do próprio  fileUploadItem. Depois, para enviá-los para o backend eu verifico o fileUploadItem pela propriedade jsFile inserida neste método.
     * @param {*} event 
     */
    async function onChange(event) {

        arquivoService.configureFile(event.mParameters.files[0]);
        let arquivoObj;

        try {
            arquivoObj = await arquivoService.tranformFileToDataUrl();
        } catch (error) {

            dialogService.showMessageToast('Erro ao transformar o arquivo para o formato base64:' + error);
            throw new Error('Erro ao transformar o arquivo para o formato base64', error);
        }
        salvarArquivoNoUploadCollection(arquivoObj);

    }

    /**
     * Se o anexo passar por todas as regras de validação eu o insiro como uma nova propriedade do control uploadCollection
     */
    function salvarArquivoNoUploadCollection(arquivoObj) {
        uploadControl.getItems()
            .forEach(arquivoUploadCollection => {
                if (arquivoUploadCollection.mProperties.fileName === arquivoObj.arquivoJS.name) {
                    arquivoUploadCollection.jsFile = { Conteudo: arquivoObj.fileInBase64, NomeAnexo: arquivoObj.arquivoJS.name };
                }

            });
    }


})();

