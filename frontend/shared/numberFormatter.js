/**
 * Retorna um objeto com funções básicas para formatação e conversão de dados
 */

var numberFormatter = (function () {
    "use strict";
    return {
        inputFloat,
        formataValor,
        checkFloat
    };


    /**
     * Formata um valor numerico
     */
    function formataValor(value, decimais) {
        if (value || value === 0) {
            value = (!isNaN(value)) ? value * 1 : value;
            var digito = (!isNaN(decimais)) ? parseInt(decimais) : 2;
            var oNumberFormat = sap.ui.core.format.NumberFormat
                .getFloatInstance({
                    maxFractionDigits: digito,
                    minFractionDigits: digito,
                    groupingEnabled: true,
                    groupingSeparator: ".",
                    decimalSeparator: ","
                });
            return oNumberFormat.format(value);
        } else {
            return value;
        }
    }

    /**
     * Método para validar o dado inputado pelo usuário ao digitar
     * @param {*} oEvent 
     */
    function inputFloat(oEvent) {
        let _oInput = oEvent.getSource();
        let inputValue = _oInput.getValue();

        //remove tudo que não for número nem ponto 
        let numericValue = inputValue.replace(/[^0-9\,]+/g, '');

        let contaPonto = numericValue.split(",").length - 1;

        //garanto que só tenha uma vírgula no input
        while (contaPonto > 1) {
            numericValue = numericValue.replace(",", "");
            contaPonto = numericValue.split(",").length - 1;
        }

        //por algum motivo o evento onChange não é chamado quando o usuário digita alguma letra, permitindo criar valores errados pois não passa pelo checkFloat
        if (inputValue.replace(/[\W^0-9\,\.]/g, "") !== "" || aplicaConstraintsFloat(numericValue, _oInput) !== numericValue) {
            checkFloat.call(this, oEvent);
        }
    }


    /**
     * Evento chamado no evento change do input numérico
     * @param {*} oEvent 
     */
    function checkFloat(oEvent) {

        let isNullValidation;

        var _oInput = oEvent.getSource();
        var val = _oInput.getValue();

        val = val.replace(/[^0-9\,]+/g, '');
        //substituo , por . para poder formatar o valor corretamente
        while (val.indexOf(',') >= 0) {
            val = val.replace(',', '.');
        }

        //verifico o valor maximo e mínimo de acordo com os constraints definidos no campo
        val = aplicaConstraintsFloat(val, _oInput);

        //verifico se o valor digitado é vazio/undefined/NAN.
        //Se for, o campo fica vermelho
        isNullValidation = val === undefined || Number.isNaN(val) || val === '';

        if (isNullValidation) {

            sap.ui.getCore().fireValidationError({
                element: _oInput
            });

            _oInput.setValue('');

        }

        else {

            sap.ui.getCore().fireValidationSuccess({
                element: _oInput
            });
            _oInput.setValue(formataValor(val));
        }

    }

    /**
     * Verifico se o input informado possui algum constraint definido no mesmo
     * e aplico os mesmos no valor informado
     */
    function aplicaConstraintsFloat(value, _oInput) {
        var bindInfo = _oInput.getBindingInfo("value");
        var constraints = bindInfo.constraints;
        var floatValue = parseFloat(value.replace(/[^0-9\,\.]+/g, ''));
        if (constraints) {
            if (constraints.maximum && floatValue > constraints.maximum) {
                value = constraints.maximum;
            }
            if (constraints.minimum && floatValue < constraints.minimum) {
                value = constraints.minimum;
            }
        }
        return value;
    }

})();

