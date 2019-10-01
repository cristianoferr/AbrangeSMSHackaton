/**
Essa classe tem por objetivo centralizar a validação dos dados de tela da
solicitação do usuário.
 */
var pendenciaService = (function () {
    'use strict';

    let that;

    //só é necessário anexar o evento uma vez
    let eventAttached = false;

    //model onde ficam armazenadas as pendências da solicitação atual
    let viewModel;

    //relacao de 'requerimentos' que a solicitação precisa para ser aprovada
    //exemplo de objeto {passo:1,campo:'Regio',mensagemPendencia:'Falta preencher estado da instituição'}
    let regras = [];

    //templates usados para mostrar popup com as pendências da solicitação
    var oMessageTemplate = new sap.m.MessagePopoverItem({
        type: '{type}',
        title: '{title}',
        description: '{description}',
        subtitle: '{subtitle}',
        counter: '{counter}'
    });

    var oMessagePendencia = new sap.m.MessagePopover({
        items: {
            path: '/pendencias',
            template: oMessageTemplate
        }
    });

    return {
        bind,
        handlePendenciaViewPress,
        addRegra,
        validaPendencias,
        validaPassoAtual,
        regraCNPJValido,
        pendenciasOk,
        getCNPJState,
        getTypePendenciaCount,
        getRegras
    };

    function getRegras() {
        return regras;
    }

    /**
  * Retorna um 'type' para o botão de pendencias, 
  */
    function getTypePendenciaCount(pendenciaCount) {
        if (pendenciaCount === 0) {
            return "Accept";
        } else {
            return "Reject";
        }
    }

    /**
     * Verifico se há alguma pendência de preenchimento para cada tipo de rota possível: alteração/confirmação/cancelamento
     */
    function validaPendencias() {
        var pendencias = [];
        console.log("validaPendencias...")


        //aplicação não iniciou corretamente ainda...
        if (!viewModel) {
            return false;
        }

        regras.forEach((regra) => {
            if (!validaRegra(regra)) {
                pendencias.push({ type: 'Error', title: regra.mensagemPendencia });
            }
        });

        let wizardOk = pendencias.length === 0;

        //se está tudo bem, está tudo bem
        viewModel.setProperty("/pendenciaOk", wizardOk);
        viewModel.setProperty("/pendenciaCount", pendencias.length);

        viewModel.setProperty("/pendencias", pendencias);

        return wizardOk;
    }

    /**
     * retorna true se não tiver pendencia no sistema (usado na etapa final)
     */
    function pendenciasOk(passo, pendenciaCount) {
        return pendenciaCount === 0;
    }

    /**
         * Função que verifica se o passo (WizardStep) atual está ok e se o usuário pode passar para o próximo
         * @param {*} passo
         */
    function validaPassoAtual(passo) {
        let resultado = true;
        regras
            .filter(regra => { return regra.passo === passo; })
            .forEach(regra => {
                resultado = resultado && validaRegra(regra);
            });

        return resultado;
    }

    /**
     * valido a regra informada 
     * @param {*} regra 
     */
    function validaRegra(regra) {

        //valido a propriedade da qual essa regra depende
        if (regra.dependeDe !== null) {
            var propriedadeDependente = that.getProperty(regra.dependeDe);
            if (!propriedadeDependente) {
                return true;
            }
          
        }

        return regra.funcaoValidacao(that.getProperty(regra.campo));
    }

    /**
     * Retorna 'Success' se o cnpj informado for válido e 'Error' se for inválido.
     * @param {*} cnpj 
     */
    function getCNPJState(cnpj) {
        if (regraCNPJValido(cnpj)) {
            return "Success";
        } {
            return "Error";
        }
    }

    /**
     * Função default: false se o valor estiver vazio 
     * @param {*} vlrPreenchido 
     */
    function regraNaoVazio(vlrPreenchido) {
        return vlrPreenchido !== false && vlrPreenchido !== null && vlrPreenchido !== undefined && vlrPreenchido !== "" && !(Array.isArray(vlrPreenchido) && vlrPreenchido.length==0);
    }

    function regraCNPJValido(cnpj) {

        if (!cnpj || cnpj === "" || cnpj.indexOf('_') >= 0 || !cnpj.match(/[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/)) {
            return false;
        }

        return validarCNPJ(cnpj);

    }

    function validarCNPJ(cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj === '') { return false; }

        if (cnpj.length !== 14) {
            return false;
        }

        // Elimina CNPJs invalidos conhecidos
        if (cnpj === "00000000000000" ||
            cnpj === "11111111111111" ||
            cnpj === "22222222222222" ||
            cnpj === "33333333333333" ||
            cnpj === "44444444444444" ||
            cnpj === "55555555555555" ||
            cnpj === "66666666666666" ||
            cnpj === "77777777777777" ||
            cnpj === "88888888888888" ||
            cnpj === "99999999999999") {
            return false;
        }

        // Valida DVs
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) {
            return false;
        }

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) {
            return false;
        }

        return true;

    }

    /**
     * Adiciona uma regra de preenchimento à verificação de pendência
     * @param {string} passo - passo onde essa regra se aplica
     * @param {string} campo - qual o caminho a partir da raiz do viewModel essa propriedade está gravada
     * @param {string} mensagemPendencia - Qual a mensagem que aparece na relação de pendências
     * @param {function} funcaoValidacao - opcional, qual a função que será usada para validar a regra
     * @param {string} dependeDe - opcional, a regra só é validada se o campo definido aqui for diferente de vazio
     */
    function addRegra(passo, campo, mensagemPendencia, funcaoValidacao, dependeDe = null) {
        //função de validação default: valida se o campo foi preenchido
        if (!funcaoValidacao) {
            funcaoValidacao = regraNaoVazio;
        }
        var regra = {
            passo: passo,
            campo: campo,
            mensagemPendencia: mensagemPendencia,
            funcaoValidacao: funcaoValidacao,
            dependeDe: dependeDe

        };

        regras.push(regra);

    }
    /**
    * Init necessário para pegar a referencia do model com as propriedades
    * @param {*} _viewModel 
    * @param {*} _that - referencia ao controller em uso, não deve ser usado para acessar elementos de tela (idealmente apenas para 'traduzChave')
    */
    function initBusiness(_viewModel) {
        viewModel = _viewModel;
        regras = [];
    }

    /**
     * Método chamado quando o usuário clica no botão para mostrar as pendências
    */
    function handlePendenciaViewPress(oEvent) {

        oMessagePendencia.setModel(viewModel);
        if (!oMessagePendencia.isOpen()) {
            oMessagePendencia.openBy(oEvent.getSource());
        } else {
            oMessagePendencia.close();
        }

        oMessagePendencia._oPopover.setShowArrow(true);
        oMessagePendencia._oPopover.setContentWidth('640px');
        oMessagePendencia._oPopover.setContentHeight('340px');
    }

    /**
    * Init necessário para pegar a referencia do model com as propriedades
    * @param {*} _viewModel 
    * @param {*} _that - referencia ao controller em uso, não deve ser usado para acessar elementos de tela (idealmente apenas para 'traduzChave')
    */
    function bind(_that) {
        that = _that;
        viewModel = that.getModel("viewModel");
        regras = [];
        if (!eventAttached) {
            that.getModel("viewModel").attachPropertyChange(function () { pendenciaService.validaPendencias(); });
            that.getModel().attachPropertyChange(function () { pendenciaService.validaPendencias(); });
            eventAttached = true;
        }
    }

}
)();