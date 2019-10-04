sap.ui.define(['templateHackaton/shared/baseController'],

    function (baseController) {
        'use strict';

        let that;

        return baseController.extend('templateHackaton.layout.app', {

            onInit: function () {
                that = this;
                barraSuperiorService.bind(that);
            },

            barraSuperiorService,
            navBack


        });

        function navBack() {
            barraSuperiorService.navBack();
        }



    });