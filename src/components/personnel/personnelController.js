var personnelController = {
    _personnelData: [],
    _roles: {
        '1': 'Spotter/Observer',
        '2': 'Commander/Ground Control',
        '3': 'Data Caretaker',
        '4': 'Analyst',
        '5': 'Pilot'
    },
    postPersonnel: function(data, view) {
        var deferred = $.Deferred();
        var self = this;

        $.ajax({
            url: dbURL + '/personnel',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
              'auth-token': httpCalls.getLSUser()['token']
            },
            xhr: function() {
                var myXhr = new window.XMLHttpRequest();
                myXhr.upload.addEventListener('progress', function(event) {
                    if (event.lengthComputable) {
                        var percentCompleted = event.loaded / event.total;
                        if (view.progressbarClass == true) {
                            view.progressbarClass = false;
                        }
                        view.progressbarWidth = (percentCompleted * 100) + '%';
                    }
                });
                return myXhr;
            },
            success: function(data) {
                deferred.resolve(data);
            },
            error: function(xhr, text, error) {
                console.log('------ error -------');
                console.log(xhr);
                console.log(text);

                deferred.reject(xhr);
            }
        });
        return deferred.promise();
    },
    getPersonnelByUserID: function(userID) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/' + userID + '/personnel').then(function(data) {
            if (data.length > 0) {
                data.forEach(function(curr, i) {
                    if (curr['imagePath'] != null) {
                        var tokens = curr['imagePath'].split('/');
                        curr['imgURL'] = dataStorageURL + '/personnel/' + curr.id + '/' + tokens[tokens.length - 1];
                    } else {
                        curr['imgURL'] = '/img/user.png';
                    }
                });
            }
            self._personnelData = data;
            deferred.resolve(data);
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise();
    },
    deletePersonnelByID: function(personnelID) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_delete('/personnel/' + personnelID).then(function(data) {
            var index;
            self._personnelData.some(function(curr, i) {
                if (curr['id'] == personnelID) {
                    index = i;
                    return true;
                }
            });

            self._personnelData.splice(index, 1);
            deferred.resolve(self._personnelData);
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise();
    },
    getPersonnelByID: function(id) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/personnel/' + id).then(function(data) {
            self._personnelData = JSON.parse(data);
            deferred.resolve(data);
        }, function(err) {
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
