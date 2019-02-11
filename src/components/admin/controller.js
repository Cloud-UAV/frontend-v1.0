var Controller = (function () {
    var Controller = function () {
        this.client = undefined;
        this.loggedinUser = undefined;
        this.data = {
            users: undefined,
            projects: undefined,
            drones: undefined,
            files: undefined
        };
        this.currIDList = {
            userID: undefined,
            projectID: undefined,
            droneID: undefined
        };
        this.mqttInfo = {
            'projectsExpandDrones': [],
            'staDS': []
        };
        // toastr.options = {
        //     "closeButton": true,
        //     "debug": false,
        //     "newestOnTop": true,
        //     "progressBar": false,
        //     "positionClass": "toast-top-right",
        //     "preventDuplicates": true,
        //     "onclick": null,
        //     "showDuration": "300",
        //     "hideDuration": "1000",
        //     "timeOut": "5000",
        //     "extendedTimeOut": "1000",
        //     "showEasing": "swing",
        //     "hideEasing": "linear",
        //     "showMethod": "fadeIn",
        //     "hideMethod": "fadeOut"
        // };
    };

    Controller.prototype.getUsers = function () {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/users').then(function (data) {
            // sort the users array by the role type, put admin first
            data.sort(function(a,b){
              return a.role > b.role;
            });

            self.data.users = data;
            deferred.resolve(data);
        }, function (data) {
            console.log('error');
            console.log(data);
            deferred.reject();
        });
        return deferred.promise();
    };

    Controller.prototype.getDS = function () {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/'+this.loggedinUser.id+'/projects?$expand=drones').then(function (data) {
            self.mqttInfo.projectsExpandDrones = data;
            var filterStr = undefined;

            if (data.length > 0) {
                var drones = [].concat.apply([], data.map(function(curr){
                   return curr['Drones'];
                }));

                drones.forEach(function (curr, i) {
                    if (filterStr == undefined) {
                        filterStr = 'id eq ' + curr['thingID'];
                    } else {
                        filterStr += ' or id eq ' + curr['thingID'];
                    }
                });

                var url = '';
                if(filterStr != undefined){
                  url = '/Things?$filter=' + filterStr + '&$expand=Datastreams/ObservedProperty';
                }else{
                  url = '/Things?$expand=Datastreams/ObservedProperty';
                }
                
                httpCalls.sta_getEntity(url).then(function (response) {
                    console.log(response);
                    self.mqttInfo.staDS = response;
                    deferred.resolve(self.mqttInfo);
                }, function (err) {
                    deferred.reject(err);
                });
            }


        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    };

    Controller.prototype.changeRole = function (user) {
        var self = this;
        var roleType = user.role == 'admin' ? 'user' : 'admin';
        var data = {
            'role': roleType
        };
        var deferred = $.Deferred();

        httpCalls.db_patch('/users/' + user.id, JSON.stringify(data)).then(function (response) {
            user.role=roleType;
            self.data.users.some(function (curr, i) {
                if (curr.id == response.id) {
                    self.data.users[i] = user;
                    return true;
                }
            });
            deferred.resolve(user);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise();
    };

    Controller.prototype.deleteItem = function (query, type, id) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_delete(query).then(function () {
            self.data[type].some(function (curr, i) {
                if (curr.id == id) {
                    self.data[type].splice(i, 1);
                    return true;
                }
            });
            deferred.resolve();
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    };

    Controller.prototype.showContents = function (type, id, name) {
        var self = this;
        var deferred = $.Deferred();
        var prevType;

        if (type == 'projects') {
            prevType = 'users';
            self.currIDList.userID = id;

            httpCalls.db_getData('/' + id + '/projects').then(function (data) {
                self.data.projects = data;
                deferred.resolve({
                    'data': data,
                    'prevType': prevType
                });
            }, function (err) {
                deferred.reject(err);
            });
        } else if (type == 'drones') {
            prevType = 'projects';
            self.currIDList.projectID = id;

            httpCalls.db_getData('/projects/' + id + '/drones').then(function (data) {
                self.data.drones = data;
                deferred.resolve({
                    'data': data,
                    'prevType': prevType
                });
            }, function (err) {
                deferred.reject(err);
            });
        } else if (type == 'files') {
            prevType = 'drones';
            self.currIDList.droneID = id;

            httpCalls.db_getData('/'+id+'/files').then(function (data) {
                data.forEach(function (curr, i) {
                    var extension = curr.name.split('.')[1].toLowerCase();

                    if (extension == 'jpeg' || extension == 'png' || extension == 'jpg' || extension == 'gif') {
                    data[i]['thumbnailURL'] = dataStorageURL + '/drones/'+id+'/thumbnail-' + curr.name;
                    }else{
                        data[i]['thumbnailURL'] = '/img/file_icon.png';
                    }
                });
                self.data.files = data;
                deferred.resolve({
                    'data': data,
                    'prevType': prevType
                });
            }, function (err) {
                deferred.reject(err);
            });
        }

        return deferred.promise();
    };

    Controller.prototype.initMQTT = function () {
        var self = this;

        this.client = new Paho.MQTT.Client('wss://'+mqtt.url+':'+mqtt.port+'/mqtt', 'clouduav-' + new Date().getTime());

        this.client.onConnectionLost = function (responseObj) {
            if (responseObj.errorCode !== 0) {
                console.log('Connection Lost.... Reconnecting....' + responseObj.errorMessage);
                self.mqttConnect();
            }
        };

        this.client.onMessageArrived = function (message) {
            var messageStr = JSON.parse(message.payloadString);
            console.log(messageStr);
            httpCalls.sta_getEntity('/Observations(' + messageStr['@iot.id'] + ')/Datastream' + '?$expand=Thing')
                .then(function (data) {
                    console.log(messageStr.phenomenonTime + " - "+ messageStr.result)
                    toastr.info(messageStr.phenomenonTime + " - "+ messageStr.result);
                    /*
                    self.data.users.some(function (curr) {
                        if (curr['id'] == data.Thing['description'].replace('undefined [','').replace(']','')) {
                            toastr.info(messageStr.phenomenonTime + " - "+ messageStr.result,
                            '<h5>' + curr['firstName'] + " " + curr['lastName'] + '</h5>');
                        }
                    });
                    */
                }, function (err) {
                    console.log(err);
                });          
        }; 

        this.mqttConnect();
    };
    Controller.prototype.mqttConnect = function () {
        var self = this;
        this.client.connect({
            onSuccess: function () {
                self.client.subscribe('v1.0/+/Observations');
                console.log('MQTT Connected!');
            },
            userName: 'main',
            password: 'ffcf2c3c-a210-53c5-81af-f31427e52d78'
        });
    };

    return Controller; 
})();
