var filesController = {
    getDronesForCurrUser: function (userID) {
        var deferred = $.Deferred();

        httpCalls.db_getDroneForCurrUser(userID).then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.log('err');
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise();
    },
    getAllDatastreams: function (thingID) {
        var deferred = $.Deferred();

        $.ajax({
            type: 'GET',
            url: sensorThingsURL + '/Things(' + thingID + ')/Datastreams',
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
    getSharedFilesUsers: function(fileID){
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: dbURL+'/files/share/'+fileID,
            headers: {
                'auth-token': httpCalls.getLSUser()['token']
            },
            success: function(data){
                deferred.resolve(data);
            },
            error: function(xhr){
                console.log(xhr);
                deferred.reject(xhr);
            }
        });
        return deferred.promise();
    }
};
