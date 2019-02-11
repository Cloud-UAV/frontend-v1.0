var ImagesMapView = (function () {
    var ImagesMapView = function () {
        var self = this;
        this.map = L.map('map').setView([51.505, -114.454554], 4);
        this.animatedMarker;
        // this.markerGroup= L.layerGroup();
        this.markerClusterInit = false;
        this.markerCluster = L.markerClusterGroup();
        this.customMarker = L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'fa-plane',
            markerColor: 'blue'
        });

        var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        var OpenStreetMapBW = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        });
        var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(this.map);

        var baseMaps = {
            'OpenStreetMap': OpenStreetMap_Mapnik,
            'OpenStreetMap BW': OpenStreetMapBW,
            'ESRI World Imagery': Esri_WorldImagery
        };
        L.control.layers(baseMaps, {}, {
            position: 'topleft'
        }).addTo(this.map);

        this.pageContainer = new Vue({
            el: '#pageContainer',
            data: {
                toggleStart: false,
                controlBtnText: 'Play',
                controlBtnIcon: true,
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined
                },
                videoSpinner: true
            },
            methods: {
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");
                    var self = this;
                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                    }
                },
                controlBtnClickEvent: function () {
                    if (this.toggleStart == false) {
                        this.controlBtnText = 'Stop';
                        this.controlBtnIcon = false;
                        self.animatedMarker.animate();
                        this.toggleStart = true;
                        $('#imagePlayer').delay(300).slideUp( 400 ).fadeIn( 2500 );
                    } else {
                        this.controlBtnText = 'Play';
                        this.controlBtnIcon = true;
                        self.animatedMarker.stop();
                        this.toggleStart = false;

                        $('#imagePlayer').fadeOut("slow");
                    }

                }
            }
        });

        L.easyButton('fa-map-pin', function (btn, map) {
            // var keys = Object.keys(self.markerGroup._layers)

            if (self.map.hasLayer(self.markerCluster)) {
                self.map.removeLayer(self.markerCluster);
                // self.markerGroup.clearLayers();
            } else {
                if (self.markerClusterInit == false) {
                    self.markerClusterInit = true;

                    imagesMapController.obsData.forEach(function (curr, i, arr) {
                        var circle = L.circle([curr['FeatureOfInterest']['feature']['coordinates'][1], curr['FeatureOfInterest']['feature']['coordinates'][0]], {
                            color: '#0086b3',
                            fillColor: '#0099cc',
                            fillOpacity: 0.5,
                            radius: 5
                        }); //.addTo(self.markerGroup);
                        self.markerCluster.addLayer(circle);

                        circle.bindPopup('<h6>' + curr['result'] + '</h6><img class="popup" src="' + dataStorageURL + '/drones/'+imagesMapController['droneID']+'/' + curr['result'] + '"  width="300" height="auto"/>').on('mouseover', function () {
                            this.openPopup();
                        }).on('mouseout', function () {
                            this.closePopup();
                        });
                    });
                }

                self.map.addLayer(self.markerCluster);
                // self.markerGroup.addTo(self.map);
            }

        }).addTo(this.map);

        L.easyButton('fa-street-view', function (btn, map) {
            if (self.map.hasLayer(self.polyline)) {
                self.map.removeLayer(self.polyline);
            } else {
                self.polyline.addTo(self.map);
            }
        }).addTo(this.map);

    };
    return ImagesMapView;
})();
