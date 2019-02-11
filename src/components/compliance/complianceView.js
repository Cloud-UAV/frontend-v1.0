var ComplianceView = (function () {
    var ComplianceView = function () {
        var self = this;

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
                }
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    // if (userInfo == undefined || userInfo.length == 0) {
                    //     window.location.href = '../../index.html';
                    // } else {
                        this.user = JSON.parse(userInfo);
                        this.initSideNav();
                        this.brandTopBtn();
                        this.loadingSpinner(false);
                        this.brandTopBtn();
                    // }
                }

            }
        });

        this.map = L.map('map').setView([51.4343, -114.343], 4);
        var flag=false;

        var openSurferRoads = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        var osmb = new OSMBuildings(this.map).load();
        this.layerControl = L.control.layers({}, {
            '3D Buildings': osmb
        }).addTo(self.map);

        openSurferRoads.on('load', function(){
            if(self.featureGroup != undefined && !flag){
                self.map.fitBounds(self.featureGroup.getBounds());
                flag=true;
            }
            self.map.invalidateSize();
        });


        this.addGeoJSONDataToMap();
    };

    ComplianceView.prototype.addGeoJSONDataToMap = function () {
        var self = this;
        complianceController.getGeoJSONFile().then(function () {
            var layerGroup = {};
            var totalLayers = [];

            complianceController._geojsonData.features.forEach(function (curr) {
                var geoJSON = L.geoJSON(curr, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            fillColor: '#336699',
                            color: '#2d5986'
                        });
                    },
                    style: function (feature) {
                        return {
                            color: '#336699'
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup('<h6>' + feature.properties['TITLE'] + '</h6>Base: ' + feature.properties['BASE'] + '<br/>Tops: ' + feature.properties['TOPS'] + '<br/>Class: ' + feature.properties['CLASS'] + '<br/>Type: ' + feature.properties['TYPE']);
                        layer.on('click', function (e) {
                            this.openPopup();
                        });
                    }
                });
                if (layerGroup.hasOwnProperty(curr.properties['CLASS'])) {
                    layerGroup[curr.properties['CLASS']].push(geoJSON);
                } else {
                    layerGroup[curr.properties['CLASS']] = [geoJSON];
                }
                totalLayers.push(geoJSON);
            });

            Object.keys(layerGroup).forEach(function (curr) {
                var group = L.layerGroup(layerGroup[curr]).addTo(self.map);
                self.layerControl.addOverlay(group, 'Class '+curr);
            });
            self.featureGroup =  new L.featureGroup(totalLayers);
            self.map.fitBounds(self.featureGroup.getBounds());
            self.map.invalidateSize();
        });
    };

    return ComplianceView;
})();
