var projectsController = {
    _userData: [],
    getAllProjects: function (userID) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/' + userID + '/projects?$expand=Shared').then(function (data) {
            self._userData = data;
            deferred.resolve(data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    },
    deleteProjectByID: function (projectID) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_delete('/projects/' + projectID).then(function (data) {
            var index;
            self._userData.some(function (curr, i) {
                if (curr['id'] == projectID) {
                    index = i;
                    return true;
                }
            });

            self._userData.splice(index, 1);
            deferred.resolve(self._userData);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    },
    getURLParams: function() {
        var url = decodeURIComponent(window.location.search.substring(1, window.location.search.length));
        var tokens = url.split('&');
        var properties = {};

        tokens.forEach(function(curr) {
            var elem = curr.split('=');
            properties[elem[0]] = elem[1];

        });
        return properties;
    }
};
