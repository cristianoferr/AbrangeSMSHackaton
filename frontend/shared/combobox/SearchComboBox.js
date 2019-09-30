/**
 * Uma combobox que permite pesquisar de forma parcial
 */

jQuery.sap.declare("templateHackaton.shared.combobox.SearchComboBox");

jQuery.sap.require("sap.m.ComboBox");
jQuery.sap.require("sap.m.ComboBoxRenderer");
jQuery.sap.require("sap.m.ComboBoxBase");

sap.m.ComboBox.extend("templateHackaton.shared.combobox.SearchComboBox", {
    renderer: "sap.m.ComboBoxRenderer",


    filtrasPelosPrimeirosItems: function (qtd) {
        let aItems = this.getItems();
        let selectedItem = this.getSelectedItem();
        aItems.forEach(function (oItem, index) {
            this._setItemVisibility(oItem, index < qtd || oItem == selectedItem);
        }, this);
    },
    onBeforeOpenDialog: function () {
        let value = this.getValue();
        //defino um filtro inicial para um valor qualquer quando a quantidade de items for maior que a definida em constants
        if (this.getItems().length > constants.TAMANHO_MAXIMO_COMBO_SEM_FILTRO) {
            this.buscaPorTexto(value);
        } else {
            sap.m.ComboBox.prototype.onBeforeOpenDialog.apply(this);
        }
    },

    oninput: function (oEvent) {
        sap.m.ComboBoxBase.prototype.oninput.apply(this, arguments);

        // note: suppress input events of read-only fields (IE11)
        if (!this.getEditable()) {
            return;
        }

        var
            oInputDomRef = oEvent.target,
            sValue = oInputDomRef.value

        let bVisibleItems = this.buscaPorTexto(sValue);
        // open the picker on input
        if (bVisibleItems) {
            this.open();
        } else {
            //   this.isOpen() ? this.close() : this.clearFilter();
        }

    },
    buscaPorTexto: function (sValue) {
        let bVisibleItems = false;
        let countVisible = 0;
        let oSelectedItem = this.getSelectedItem();
        let aItems = this.getItems();
        let oItem;
        let bMatch;
        let bFirst = true;
        let i = 0;
        for (; i < aItems.length; i++) {

            // the item match with the value
            oItem = aItems[i];

            bMatch = ((oItem.getText().toLowerCase()).indexOf(sValue.toLowerCase()) > -1);

            if (sValue === "") {
                bMatch = true;
            }

            if (bMatch) {
                countVisible++;
            }
            if (countVisible > constants.TAMANHO_MAXIMO_COMBO_SEM_FILTRO) {
                bMatch = false;
            }
            this._setItemVisibility(oItem, bMatch || oItem == oSelectedItem);

            if (bMatch && !bVisibleItems) {
                bVisibleItems = true;
            }

            // first match of the value
            if (bFirst && bMatch && sValue !== "") {
                bFirst = false;

                this.setSelection(oItem, { suppressInvalidate: true });

                if (oSelectedItem !== this.getSelectedItem()) {
                    this.fireSelectionChange({ selectedItem: this.getSelectedItem() });
                }

                if (this._bDoTypeAhead) {
                    this.selectText(sValue.length, 9999999);
                }

                this.scrollToItem(this.getList().getSelectedItem());
            }
        }

        if (sValue === "" || !bVisibleItems) {
            this.setSelection(null, { suppressInvalidate: true });

            if (oSelectedItem !== this.getSelectedItem()) {
                this.fireSelectionChange({ selectedItem: this.getSelectedItem() });
            }
        }
        return bVisibleItems;

    }
});