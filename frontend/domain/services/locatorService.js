/**
 * Esse service faz uma chamada remota para determinar a posição geográfica atual do usuário
 * Há dois métodos sendo usados: um via ip com baixa precisão (do qual eu aproveito e pego o estado do usuário)
 * e o de maior precisão via GPS do usua´rio mas que depende da aprovação do usuário
 */
var locatorService = (function () {
    "use strict";

    let that;
    let objetoPosicao = null;
    let coordenada = null;
    let precisaoAtual = 0;
    let idGPS;

    //api free, limitado a 10.000 chamadas mensais
    const API_KEY = "46799f6b125f48d7a116013bae339234";

    return {
        executaRequisicaoGeografica,
        getEstado,
        getPais,
        buscaSiglaEstado,
        getDistanceFromLatLonInKm,
        getDistanceTo,
        bind
    };

    function bind(_that) {
        that = _that;
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }


    function getDistanceTo(lat, long) {
        return getDistanceFromLatLonInKm(coordenada.latitude, coordenada.longitude, lat, long);
    }

    /**
     * calcula distancia com base na coordenada obtida
     * retorna uma lista parcialmente ordenada por distancia (<= constants.DISTANCIA_CORTE_INSTALACOES) e o resto ordenado pelo nome 
     */
    function calculaDistancia() {
        let instalacoes = that.getModel("dominio").getProperty("/instalacoes");

        //objetoPosicao.longitude = -43.19710;
        //objetoPosicao.latitude = -22.90830;
        instalacoes.forEach(instalacao => {
            let distancia = getDistanceFromLatLonInKm(coordenada.latitude, coordenada.longitude, instalacao.lat, instalacao.long);
            instalacao.distancia = distancia;
            if (instalacao.lat) {
                instalacao.distanciaDesc = parseInt(distancia) + " km";
            } else {
                instalacao.distancia = 999999;
                instalacao.distanciaDesc = "";
            }
            instalacao.orderBy = 0;
        });

        //ordeno por distancia
        instalacoes.sort(function (a, b) {
            return a.distancia < b.distancia ? -1 : 1;
        });

        //marco essas como sendo instalações próximas
        instalacoes.forEach((instalacao, index) => {
            instalacao.orderBy = index;
            instalacao.grupo = "Instalações Próximas";
        });

        that.getModel("dominio").setProperty("/instalacoes", instalacoes);
        return instalacoes;

    }



    function buscaSiglaEstado(listaEstados) {
        let estadoAtual = getEstado();
        if (estadoAtual == "") return null;
        let estado = listaEstados.find(x => formatter.removeAcento(x.nome) == estadoAtual);
        if (estado) {
            return estado.sigla;
        }
        return null;
    }

    function getPais() {
        if (objetoPosicao) {
            return objetoPosicao.country_name;
        }
        return "Brasil";
    }

    function getEstado() {
        if (objetoPosicao) {
            return formatter.removeAcento(objetoPosicao.state_prov);
        }
        return "";
    }

    /**
     * resultado obtido da geolocalização do usuário
     * @param {*} position 
     */
    function posicaoGPS(position) {
        console.log("Posição GPS obtida: ");
        console.log(position);
        navigator.geolocation.clearWatch(idGPS);
        atualizaCoordenada(2, position.coords.latitude, position.coords.longitude)
    }


    function executaRequisicaoGeografica() {
        return new Promise((resolve, reject) => {

            let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`;
            jQuery.ajax(
                {
                    url: url,
                    type: "GET",
                    contentType: "application/json; charset=UTF-8",
                    context: "document.body",
                    dataType: "json",
                    async: true,
                    crossDomain: true,
                    success: function (result) {
                        console.log("Sucesso na geolocalização do usuário:");
                        console.log(result);
                        objetoPosicao = result;
                        //ip tem baixa precisão
                        atualizaCoordenada(1, objetoPosicao.latitude, objetoPosicao.longitude)
                        if (navigator.geolocation) {
                            idGPS = navigator.geolocation.watchPosition(posicaoGPS);
                        }
                        resolve();

                    },
                    error: function (result) {
                        console.error("Erro ao requisitar a geolocalização");
                        console.error(err);
                        reject(err);
                    }
                });

        });
    }

    /**
     * Atualizo a coordenada com base nos resultados obtidos, sempre dando preferência à uma precisão maior
     * @param {*} precisao 
     * @param {*} latitude 
     * @param {*} longitude 
     */
    function atualizaCoordenada(precisao, latitude, longitude) {
        if (precisao > precisaoAtual) {
            coordenada = { latitude: latitude, longitude: longitude };
            precisaoAtual = precisao;
            calculaDistancia();
        }
    }


})();