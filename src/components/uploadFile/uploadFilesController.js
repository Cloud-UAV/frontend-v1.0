var uploadFilesController = {
    _projects: [],
    getFileMetadata: function (data, file) {
        var deferred = $.Deferred();

        EXIF.getData(file, function () {
            var tags = EXIF.getAllTags(this);
            var GPSLat = tags['GPSLatitude'];
            var GPSLatRef = tags['GPSLatitudeRef'];
            var GPSLonRef = tags['GPSLongitudeRef'];
            var GPSLon = tags['GPSLongitude'];

            var lat = GPSLat[0].numerator + (GPSLat[1].numerator / (60 * GPSLat[1].denominator)) + (GPSLat[2].numerator / (3600 * GPSLat[2].denominator));
            var lon = GPSLon[0].numerator + (GPSLon[1].numerator / (60 * GPSLon[1].denominator)) + (GPSLon[2].numerator / (3600 * GPSLon[2].denominator));

            if (GPSLonRef.toLowerCase() == 'w' || GPSLonRef.toLowerCase() == 's') {
                lon = lon * (-1);
            }

            var momentObj = moment(tags['DateTime'], 'YYYY:MM:DD HH:mm:ss');

            var obsObj = {
                result: file.name,
                'phenomenonTime': momentObj.format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                'FeatureOfInterest': {
                    name: 'Drone Location',
                    description: 'Location of the drone',
                    encodingType: 'application/vnd.geo+json',
                    feature: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    }
                }
            };
            httpCalls.sta_addObservation(data['@iot.id'], JSON.stringify(obsObj)).then(function (data) {
                deferred.resolve(data);
            }, function (err) {
                console.log(err);
                deferred.reject();
            });
        });
        return deferred.promise();
    },
    checkObservedPropertyAndSensor: function (opQuery, sensorQuery, thingID, fileExtensions) {
        var data = {
            'ObservedProperties': undefined,
            'Sensors': undefined,
            'Thing': undefined
        };
        var deferred = $.Deferred();

        httpCalls.sta_getEntity(opQuery).then(function (obData) {
            data['ObservedProperties'] = obData;

            var opMap = {};
            if (obData.value.length > 0) {
                obData.value.forEach(function (curr, i, arr) {
                    opMap[curr['name']] = undefined;
                });
            }

            var keys = Object.keys(fileExtensions);
            var promises = [];
            keys.forEach(function (curr, i, arr) {
                var op, observedPropertyJSON;
                if (curr.toLowerCase() == 'jpg' || curr.toLowerCase() == 'jpeg' || curr.toLowerCase() == 'png') {
                    op = opMap.hasOwnProperty('Image');
                    observedPropertyJSON = {
                        name: 'Image',
                        description: 'Drone image',
                        definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html'
                    };
                } else if (curr.toLowerCase() == 'las' || curr.toLowerCase() == 'laz') {
                    op = opMap.hasOwnProperty('Point Cloud');
                    observedPropertyJSON = {
                        name: 'Point Cloud',
                        description: 'Drone point cloud data',
                        definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html'
                    };
                } else {
                    op = opMap.hasOwnProperty('Data ' + curr.toLowerCase());
                    observedPropertyJSON = {
                        name: 'Data ' + curr.toLowerCase(),
                        description: 'Data ' + curr.toLowerCase(),
                        definition: 'http://www.qudt.org/qudt/owl/1.0.0/quantity/Instances.html'
                    };
                }

                if (op != true) {
                    var promise = httpCalls.sta_post('/ObservedProperties', JSON.stringify(observedPropertyJSON));
                    promise.then(function (opCreated) {
                        data['ObservedProperties'].value.push(opCreated);
                    });
                    promises.push(promise);
                }
            });

            $.when.apply($, promises).then(function () {
                httpCalls.sta_getEntity('/Things(' + thingID + ')?$expand=Datastreams/ObservedProperty,Datastreams/Sensor').then(function (thingResponse) {
                    data['Thing'] = thingResponse;

                    httpCalls.sta_getEntity(sensorQuery).then(function (sensorsData) {
                        if (sensorsData.value.length == 0) {
                            var sensorJSON = {
                                name: 'Drone',
                                description: 'CloudUAV Drone',
                                encodingType: 'json',
                                metadata: 'https://clouduav.sensorup.com/'
                            };
                            httpCalls.sta_post('/Sensors', JSON.stringify(sensorJSON)).then(function (response) {
                                data['Sensors'] = response;
                                deferred.resolve(data);
                            });
                        } else {
                            data['Sensors'] = sensorsData;
                            deferred.resolve(data);
                        }
                    });
                });
            });
        });

        return deferred.promise();
    },
    sta_addFileToDatastream: function (file, thingID, data) {
        var self = this;
        var deferred = $.Deferred();
        var ds, op, sensor, dsJSON = {},
            sensorID;
        var fileExtension = file.name.toLowerCase().split('.')[1];

        if (data['Sensors'].hasOwnProperty('value')) {
            sensorID = data['Sensors'].value[0]['@iot.id'];
        } else {
            sensorID = data['Sensors']['@iot.id'];
        }

        if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png') {
            ds = data['dsMap']['Images'];
            op = data['opMap']['Image'];
            dsJSON = {
                name: 'Images',
                description: 'Images recieved from the drone. This could be jpg, jpeg, png, etc.',
                observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation',
                unitOfMeasurement: {
                    name: 'image',
                    symbol: fileExtension,
                    definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html'
                },
                'ObservedProperty': {
                    '@iot.id': op['@iot.id']
                },
                'Sensor': {
                    '@iot.id': sensorID
                }

            };
        } else if (fileExtension == 'las' || fileExtension == 'laz') {
            ds = data['dsMap']['Point Cloud Data'];
            op = data['opMap']['Point Cloud'];
            dsJSON = {
                name: 'Point Cloud Data',
                description: 'Point cloud data which is acquired from the drone.',
                observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation',
                unitOfMeasurement: {
                    name: 'Point Cloud',
                    symbol: fileExtension,
                    definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html'
                },
                'ObservedProperty': {
                    '@iot.id': op['@iot.id']
                },
                'Sensor': {
                    '@iot.id': sensorID
                }

            };
        } else {
            ds = data['dsMap']['Data ' + fileExtension];
            op = data['opMap']['Data ' + fileExtension];
            dsJSON = {
                name: 'Data ' + fileExtension,
                description: 'Data which is acquired from the drone.',
                observationType: 'http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation',
                unitOfMeasurement: {
                    name: 'Data',
                    symbol: fileExtension,
                    definition: 'http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html'
                },
                'ObservedProperty': {
                    '@iot.id': op['@iot.id']
                },
                'Sensor': {
                    '@iot.id': sensorID
                }

            };
        }

        if (ds == undefined) {
            httpCalls.sta_post('/Things(' + thingID + ')/Datastreams', JSON.stringify(dsJSON)).then(function (dsResponse) {
                data['Thing']['Datastreams'].push(dsResponse);
                data['dsMap'][dsResponse['name']] = dsResponse;

                if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png') {
                    self.getFileMetadata(dsResponse, file).then(function () {
                        deferred.resolve(data);
                    });
                } else {
                    deferred.resolve(data);
                }

            });
        } else {
            var observation = {
                result: file.name,
                'phenomenonTime': moment().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                'FeatureOfInterest': {
                    name: 'Drone Location',
                    description: 'Location of the drone',
                    encodingType: 'application/vnd.geo+json',
                    feature: {
                        type: 'Point',
                        coordinates: [-114.4545, 51.45481] //mockup location
                    }
                }
            };

            httpCalls.sta_getEntity('/Datastreams(' + ds['@iot.id'] + ')/Observations?$filter=result eq \'' + file.name + '\'').then(function (response) {
                if (response.value.length == 0) {
                    if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png') {
                        self.getFileMetadata(ds, file).then(function () {
                            deferred.resolve();
                        });
                    } else {
                        var showPosition = function (position) {
                            observation['FeatureOfInterest']['feature']['coordinates'] = [position.coords.longitude, position.coords.latitude];

                            httpCalls.sta_addObservation(ds['@iot.id'], JSON.stringify(observation)).then(function () {
                                deferred.resolve();
                            }, function (err) {
                                console.log(err);
                                deferred.reject();
                            });
                        };
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(showPosition)
                        } else {
                            httpCalls.sta_addObservation(ds['@iot.id'], JSON.stringify(observation)).then(function () {
                                deferred.resolve();
                            }, function (err) {
                                console.log(err);
                                deferred.reject();
                            });
                        }

                    }
                } else {
                    deferred.resolve();
                }
            });

        }

        return deferred.promise();
    },
    getDronesForCurrUser: function (projectID) {
        var deferred = $.Deferred();

        httpCalls.db_getData('/projects/' + projectID + '/drones').then(function (data) {
            deferred.resolve(data);
        }, function (err) {
            console.log('err');
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise();
    },
    getProjectsForCurrUser: function (userID) {
        var deferred = $.Deferred();
        var self = this;

        httpCalls.db_getData('/' + userID + '/projects').then(function (data) {
            var userData = _.remove(data, function(curr){
                return curr.userID == userID;
            });
            self._projects = userData;
            deferred.resolve(userData);
        }, function (err) {
            console.log('err');
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise();
    },
    db_addFile: function (droneID, formData) {
        var deferred = $.Deferred();

        $.ajax({
            url: dbURL + '/files?' + 'droneID=' + droneID,
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                'auth-token': httpCalls.getLSUser()['token']
            },
            xhr: function () {
                var myXhr = new window.XMLHttpRequest();

                myXhr.upload.addEventListener('progress', function (event) {
                    if (event.lengthComputable) {
                        var percentCompleted = event.loaded / event.total;

                        if ($('.progress > div').hasClass('indeterminate')) {
                            $('.progress > div').removeClass('indeterminate');
                            $('.progress > div').addClass('determinate');
                        }

                        $('.progress > div').css('width', (percentCompleted * 100) + '%');

                    }
                }, false);

                return myXhr;
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (xhr, text, error) {
                console.log('------ error -------');
                console.log(xhr);
                console.log(text);

                deferred.reject(xhr);
            }
        });

        return deferred.promise();
    }
};
