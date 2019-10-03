sap.ui.define(["templateHackaton/shared/baseController"],

    function (baseController) {
        "use strict";

        let that;

        return baseController.extend("templateHackaton.domain.alerta.consulta.alerta", {

            onInit: function () {
                that = this;

                if (that.getRouter()) {
                    that.getRouter().getRoute('routeConsultaAlerta').attachPatternMatched(
                        onRouteOrSubRoutesMatched);
                }


            },
            juntaTexto,
            userVote,
            buscaImagemRegraOuro,
            buscaDescricaoRegraOuro,
            usuarioCiente

        });



        /** Caso a rota routeAppHome ou alguma de suas subrotas sejam utilizadas na URL, o método abaixo é disparado. Nele deve ser realizada o bind com as informações do backend.
         * @function onRouteOrSubRoutesMatched
         * @return {type} {description}
         */
        function onRouteOrSubRoutesMatched(event) {
            let path = `/Alertas/${event.getParameters().arguments.id}/`;
            that.path = path;
            that.getView().bindElement({ path: path });
            let tipo = "tipoAlerta." + that.getProperty(`/Alertas/${event.getParameters().arguments.id}/tipoAlerta`);
            that.setProperty("viewModel>/tituloAtual", that.getI18NTranslation(tipo));
            if (that.getProperty("device>/isPhone")) {
                that.setProperty("viewModel>/backRoute", "routeConsultaAlertas");
            } else {
                that.setProperty("viewModel>/backRoute", "routeAppHome");

            }
            mostraTags();
            sap.that = that;

            that.setProperty("viewModel>/usuarioPrecisaDarCiencia", !that.getProperty(path + "/lido"));
        }

        function usuarioCiente() {
            that.setProperty(that.path + "/lido", true);
            that.setProperty(that.path, that.getProperty(that.path));
        }

        function mostraTags() {
            let path = that.getView().getBindingContext().sPath;
            var panel = that.getView().byId("panelTags");
            panel.removeAllContent();
            let tags = that.getProperty(path + "/palavrasChave");
            var html = "";
            for (var i = 0; i < tags.length; i++) {
                html = html + `<a href="#" class="tag" title="${tags[i].palavraChave}">${tags[i].palavraChave}</a>`;
            }
            if (html != "") {
                var oHTML = new sap.ui.core.HTML();
                oHTML.setContent(html);
                panel.insertContent(oHTML);
            }

        }

        function buscaImagemRegraOuro(nomeRegraOuro) {
            if (!nomeRegraOuro) return "";
            let regrasDominio = that.getProperty("dominio>/regrasDeOuro");
            let regra = regrasDominio.find(x => x.nome == nomeRegraOuro);
            if (regra) {
                return regra.icone;
            }
            return "";
        }

        function buscaDescricaoRegraOuro(nomeRegraOuro) {
            if (!nomeRegraOuro) return "";
            let regrasDominio = that.getProperty("dominio>/regrasDeOuro");
            let regra = regrasDominio.find(x => x.nome == nomeRegraOuro);
            if (regra) {
                return regra.descricao;
            }
            return "";
        }

        function userVote(evt) {
            let source = evt.oSource;
            let userVoto = parseInt(source.data().voto);
            let path = source.getBindingContext().sPath;
            that.setProperty(path + "/userVotou", userVoto);
            let qtdVotos = that.getProperty(path + "/votos");
            qtdVotos += userVoto;
            that.setProperty(path + "/votos", qtdVotos);
        }

        function juntaTexto(array) {
            if (!array) {
                return "";
            }
            let saida = "";
            return array.map(x => { return (x.passo ? x.passo + ". " : " ") + x.descricao + "\n\n" });
        }


    });