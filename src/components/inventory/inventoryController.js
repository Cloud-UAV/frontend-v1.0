var inventoryController = {
    _inventory: undefined, 
    getDronesWithInventory: function (userID) {
        var self = this;
        var deferred = $.Deferred();
        httpCalls.db_getData('/'+userID+'/inventory').then(function (data) {
            self._inventory = data;
            deferred.resolve(data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    },
    getUserProjectsAndDrones: function (userID) {
        var self = this;
        var deferred = $.Deferred();
        httpCalls.db_getData('/'+userID+'/projects?$expand=Drones').then(function (data) {
            self._projects = data;
            deferred.resolve(data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    },
    getUserSensors: function(userID){
        var self = this;
        var deferred = $.Deferred();
        httpCalls.db_getData('/'+userID+'/sensors').then(function (data) {
            self._sensors = data;
            deferred.resolve(data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    }
};