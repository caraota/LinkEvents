LinkEventsModule.service('LinkEventsService', ['$q', '$http', function($q, $http) {

    this.ACrearUsuario = function(fUser) {
        return  $http.post( 
            "/linkevents/ACrearUsuario",
            { data: fUser}
           );
    };

    this.VRegistrarUsuario = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VRegistrarUsuario',
            method: 'GET',
            params: args
        });
    };

    this.AIniciarSesion = function(fLogin) {
        return  $http({
            url: "linkevents/AIniciarSesion",
            data: fLogin,
            method: 'POST',
        });
    };

    this.VIniciarSesion = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VIniciarSesion',
            method: 'GET',
            params: args
        });
    };

    this.AEvents = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AEvents',
            method: 'GET',
            params: args
        });
    };

    this.VPrincipal = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VPrincipal',
            method: 'GET',
            params: args
        });
    };

    this.ACrearEvento = function(fEvento) {
        return  $http({
            url: "linkevents/ACrearEvento",
            data: fEvento,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }    });
    };

    this.VCrearEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VCrearEvento',
            method: 'GET',
            params: args
        });
    };

    this.VEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VEvento',
            method: 'GET',
            params: args
        });
    };

    this.VEditarEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VEditarEvento',
            method: 'GET',
            params: args
        });
    };

    this.AEditarEvento = function(fEvento,eventoid) {
        fEvento.eventoid = eventoid
        return  $http({
            url: "linkevents/AEditarEvento",
            data: fEvento,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }    });
    };

    this.AReservarEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AReservarEvento',
            method: 'GET',
            params: args
        });
    };

    this.VListarUsuarios = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VListarUsuarios',
            method: 'GET',
            params: args
        });
    };

    this.AGenerarCredencial = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AGenerarCredencial',
            method: 'GET',
            params: args
        });
    };

    this.AGenerarCertificado = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AGenerarCertificado',
            method: 'GET',
            params: args
        });
    };

    this.AEliminarReserva = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AEliminarReserva',
            method: 'GET',
            params: args
        });
    };

    this.ACerrarSesion = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/ACerrarSesion',
            method: 'GET',
            params: args
        });
    };

    this.AEliminarEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AEliminarEvento',
            method: 'GET',
            params: args
        });
    };

    this.AConfirmarAsist = function(evento,usuario) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AConfirmarAsist',
            method: 'GET',
            params: {evento,usuario}
        });
    };        
}]);
