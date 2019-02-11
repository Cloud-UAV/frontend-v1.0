$(document).ready(function() {
    imagesMapController.user = JSON.parse(localStorage.getItem('user'));

    var queryString = window.location.search.substring(1, window.location.search.length);
    var token = queryString.split('&');

    token.forEach(function(curr, i, arr) {
        var splitToken = curr.split('=');
        imagesMapController[splitToken[0]] = splitToken[1];
    });

    var imagesMapViewModel = new ImagesMapView();
    imagesMapViewModel.pageContainer.getUserInfo();

    var dataArr = [];
    imagesMapController.getObservations('', dataArr).then(function(data) {
        var line = [];
        imagesMapController.obsData = data;
        var imagesArr = [];

        httpCalls.db_getData('/' + imagesMapController['droneID'] + '/files').then(function(data) {
            console.log(data);
            data.forEach(function(curr) {
                if (curr.name.toLowerCase().indexOf('.jpg') > -1 || curr.name.toLowerCase().indexOf('.jpeg') > -1 || curr.name.toLowerCase().indexOf('.png') > -1) {
                    imagesArr.push(dataStorageURL + '/drones/'+imagesMapController['droneID']+'/' + curr['name']);
                }
            });

            gifshot.createGIF({
                'images': imagesArr,
                'gifWidth': 300,
                'gifHeight': 300,
                'text': 'Video of captured images',
                'textAlign ': 'right',
                'fontSize': '16px',
                'numWorkers': 10,
                'interval': 0.2,
                'numFrames': imagesArr.length
            }, function(obj) {
                
                if (!obj.error) {
                    var image = obj.image,
                        animatedImage = $('#imagePlayer')[0];
                    $('#imagePlayer').hide();
                    animatedImage.src = image;
                    imagesMapViewModel.pageContainer.videoSpinner = false;
                    
                }
            });
            
        });
        data.forEach(function(curr, i, arr) {
            line.push([curr['FeatureOfInterest']['feature']['coordinates'][1], curr['FeatureOfInterest']['feature']['coordinates'][0]]);
        });


        imagesMapViewModel.polyline = L.polyline(line, {
            color: '#009933',
            opacity: 0.7
        });

        imagesMapViewModel.map.fitBounds(imagesMapViewModel.polyline.getBounds(), {
            maxZoom: 17
        });

        imagesMapViewModel.animatedMarker = L.animatedMarker(imagesMapViewModel.polyline.getLatLngs(), {
            distance: 100,
            icon: imagesMapViewModel.customMarker,
            //interval: 1000,
            autoStart: false,
            onEnd: function() {
                this.setLine(imagesMapViewModel.polyline.getLatLngs());
                imagesMapViewModel.pageContainer.toggleStart = false;
                imagesMapViewModel.pageContainer.controlBtnText = 'Play';
                imagesMapViewModel.pageContainer.controlBtnIcon = true;
                $('#imagePlayer').fadeOut("slow");
            }
        });

        imagesMapViewModel.map.addLayer(imagesMapViewModel.animatedMarker);
    }, function(err) {

    });
});