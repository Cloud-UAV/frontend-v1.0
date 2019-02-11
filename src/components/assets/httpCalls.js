var httpCalls = {
    getLSUser: function(){
      var obj = localStorage.getItem('user');
        var data = JSON.parse(obj);
        return data;
    },
    logout: function(){
        var deferred = $.Deferred();

        $.ajax({
            type: 'DELETE',
            url: dbURL + '/'+this.getLSUser()['id']+'/logout',
            contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': this.getLSUser()['token']
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    getAllSharedFiles: function (id) {
        return $.get(dbURL + '/files/share/' + id);
    },
    getAllPublicFiles: function () {
        return $.get(dbURL + '/files/public');
    },
    sta_postThings: function (data) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'POST',
            url: sensorThingsURL + '/Things',
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': auth
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    db_postDrone: function (data) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'POST',
            url: dbURL + '/drones',
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': this.getLSUser()['token']
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    sta_getEntity: function (query) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'GET',
            url: sensorThingsURL + query,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': auth
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    sta_post: function (query, data) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'POST',
            url: sensorThingsURL + query,
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': auth
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    sta_getDatastream: function (id, dsName, filename) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'GET',
            url: sensorThingsURL + '/Things(' + id + ')/Datastreams?$filter=name eq \'' + dsName + '\'&$expand=Observations($filter=substringof(\'' + filename + '\',result))',
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': auth
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    db_getData: function (query) {
        var deferred = $.Deferred();
        var data = this.getLSUser(), token;
        
        if(data != undefined){
            token = data['token'];
        }
        
        $.ajax({
            type: 'GET',
            url: dbURL + query,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': token
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    db_patch: function(query, data){
        var deferred = $.Deferred();

        $.ajax({
            type: 'PATCH',
            url: dbURL + query,
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': this.getLSUser()['token']
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    db_delete: function(query){
        var deferred = $.Deferred();

        $.ajax({
            type: 'DELETE',
            url: dbURL + query,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': this.getLSUser()['token']
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    db_postData: function (query, data) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'POST',
            url: dbURL + query,
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': this.getLSUser()['token']
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    sta_createDatastream: function (id, data) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'POST',
            url: sensorThingsURL + '/Things(' + id + ')/Datastreams',
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': auth
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    sta_addObservation: function (dsID, data) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'POST',
            url: sensorThingsURL + '/Datastreams(' + dsID + ')/Observations',
            data: data,
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': auth
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    },
    db_getDroneForCurrUser: function (userID) {
        return $.get(dbURL + '/' + userID + '/drones');
    }
};
