var MissionInfoView = (function() {
    var MissionInfoView = function() {
        this.pageContainer = new Vue({
            el: '#pageContainer',
            mixins: [mixin],
            data: {
                loading: true,
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined
                },
                map: undefined,
                missionModel: {
                    mission: {
                        id: undefined,
                        name: undefined,
                        Drone: {
                            name: undefined,
                            description: undefined
                        },
                        Sensor: {
                            name: undefined,
                            description: undefined
                        },
                        Personnels: [],
                        Files: []
                    },

                }
            },
            methods: {
              validator: function (val) {
                if (val === null)
                  return 'N/A';
                else
                  return val;
              },
                loadingSpinner: function(value) {
                    this.loading = value;
                },
                initMap: function(mission) {
                    var coordinates = [51.434, -114.3434],
                        scale = 3;

                    this.map = L.map('map', {
                        fullscreenControl: true
                    }).setView(coordinates, scale);

                    if (this.missionModel.mission.location != null) {
                        coordinates = this.missionModel.mission.location.coordinates;
                        scale = 10;
                        this.map.setView(coordinates, scale);
                        var marker = L.marker(coordinates).addTo(this.map);
                        marker.bindPopup("Lat: " + coordinates[0] + "<br/>Long: " + coordinates[1]);

                    }

                    var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 20,
                        attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(this.map);

                    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    });
                    var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    });
                    var baseMaps = {
                        "Esri World Imagery": Esri_WorldImagery,
                        "Hydda Full": Hydda_Full,
                        "Open Street Map France": OpenStreetMap_France
                    };
                    L.control.layers(baseMaps, {}).addTo(this.map);

                    this.map.invalidateSize();

                },
                downloadFile: function(name) {
//                    httpCalls.db_getData('/missions/files/' + id).then(function(data){
//                        console.log(data);
//                    });
                    window.location.href = dataStorageURL + '/missions/'+this.missionModel.mission.id+'/' + name;
                },
                getMissionInfo: function() {
                    var self = this;
                    var properties = missionsController.getURLParams();

                    if (properties.hasOwnProperty('missionID')) {
                        httpCalls.db_getData('/missions/' + properties['missionID'] + '?$expand=Sensor,Drone,Personnel,Files').then(function(data) {
                            var format = 'MMM DD, YYYY, HH:mm:ss',
                                str = '';

                            if (data['startTime'] != null && data['endTime'] != null) {
                                data.formattedST = moment(data['startTime']).format(format);
                                data.formattedET = moment(data['endTime']).format(format);
                                var duration = moment.duration(moment(data['endTime']).diff(moment(data['startTime'])));

                                if (duration.hours() != 0) {
                                    str += duration.hours() + ' hours ';
                                }
                                if (duration.minutes() != 0) {
                                    str += duration.minutes() + ' minutes ';
                                }
                                if (duration.seconds() != 0) {
                                    str += duration.seconds() + ' seconds ';
                                }
                            }
                            data.totalFlightTime = str;

                            self.missionModel.mission = data;
                            self.initMap(data);
                        }, function(err) {
                            console.log(err);
                        });
                    }

                },
                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.initSideNav();
                        this.brandTopBtn();
                        this.getMissionInfo();
                        this.loadingSpinner(false);

                    }
                }

            }
        });
    };

    return MissionInfoView;
})();
