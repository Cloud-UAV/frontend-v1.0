var sensorsController = {
    postSensor: function(data) {
        var deferred = $.Deferred();
        httpCalls.db_postData('/sensors', JSON.stringify(data)).then(function() {
            deferred.resolve();
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise();
    },
    getSensors: function(userID) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/' + userID + '/sensors').then(function(data) {
            self._sensorData = data;
            deferred.resolve(data);
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise();
    },
    deleteSensor: function(sensorID){
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_delete('/sensors/' + sensorID).then(function() {
            deferred.resolve();
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise();
    }
};