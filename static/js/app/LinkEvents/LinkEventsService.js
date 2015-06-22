LinkEventsModule.service('LinkEventsService', ['$q', '$http', function($q, $http) {

    this.ACrearUsuario = function(fUser) {
        return  $http.post( 
            "/linkevents/ACrearUsuario",
            { data: fUser}
           );
           //    var labels = ["/VIniciarSesion", "/VRegistrarUsuario", ];
           //    var res = labels[0];
           //    var deferred = $q.defer();
           //    deferred.resolve(res);
           //    return deferred.promise;
    };

    this.VRegistrarUsuario = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VRegistrarUsuario',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.AIniciarSesion = function(fLogin) {
        return  $http({
            url: "linkevents/AIniciarSesion",
            data: fLogin,
            method: 'POST',
        });
        //    var labels = ["/VPrincipal", "/VIniciarSesion", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.VIniciarSesion = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VIniciarSesion',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.AEvents = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AEvents',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VListEvents", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.VPrincipal = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VPrincipal',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
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
            //    var labels = ["/VShowEvent", "/VRegisterEvent", ];
            //    var res = labels[0];
            //    var deferred = $q.defer();
            //    deferred.resolve(res);
            //    return deferred.promise;
    };

    this.VListEvents = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VListEvents',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.ADeleteEvent = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/ADeleteEvent',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VListEvents", "/VListEvents", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.VEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VEvento',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.VShowUser = function(args) {
        if(typeof args == 'undefined') args={};
        console.log(args); 
        return $http({
            url: 'linkevents/VShowUser',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.ADeleteUser = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/ADeleteUser',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VListUsers", "/VListUsers", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.AEditEvent = function(fEvent) {
        return  $http({
            url: "linkevents/AEditEvent",
            data: fEvent,
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
            //    var labels = ["/VShowEvent", ];
            //    var res = labels[0];
            //    var deferred = $q.defer();
            //    deferred.resolve(res);
            //    return deferred.promise;
    };

    this.VEditEvent = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VEditEvent',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.AReserveEvent = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AReserveEvent',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VShowEvent", "/VShowEvent", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.VCrearEvento = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VCrearEvento',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.AUsers = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AUsers',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VListUsers", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.VListUsers = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VListUsers',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.AGenerateCredentials = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AGenerateCredentials',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VCredential", "/VShowEvent", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.VCredential = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VCredential',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.AGenerateCertificate = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AGenerateCertificate',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VCertificate", "/VShowEvent", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.VCertificate = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/VCertificate',
            method: 'GET',
            params: args
        });
        //    var res = {};
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };

    this.ACancelReservation = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/ACancelReservation',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VShowEvent", "/VShowEvent", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.ALogOutUser = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/ALogOutUser',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VIniciarSesion", "/VPrincipal", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
    this.AVerifyAssitance = function(args) {
        if(typeof args == 'undefined') args={};
        return $http({
            url: 'linkevents/AVerifyAssitance',
            method: 'GET',
            params: args
        });
        //    var labels = ["/VListUsers", "/VListUsers", ];
        //    var res = labels[0];
        //    var deferred = $q.defer();
        //    deferred.resolve(res);
        //    return deferred.promise;
    };
}]);
