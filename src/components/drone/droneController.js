var droneController = {
	db_deleteDrone: function(droneID) {
		var deferred = $.Deferred();

		$.ajax({
			type: 'DELETE',
			url: dbURL+'/drones/'+droneID,
			contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': httpCalls.getLSUser()['token']
            },
			success: function(){
				deferred.resolve();
			},
			error: function(xhr, err, text){
				console.log('error happened: '+xhr);
				deferred.reject(xhr);
			}
		});
		
		return deferred.promise();
	},
	sta_deleteThing: function(thingID){
		var deferred = $.Deferred();

		$.ajax({
			type: 'DELETE',
			url: sensorThingsURL+'/Things('+thingID+')',
			contentType: 'application/json; charset=utf-8',
            headers: {
                'auth-token': httpCalls.getLSUser()['token']
            },
			success: function(){
				deferred.resolve();
			},
			error: function(xhr, err, text){
				console.log('error happened: '+xhr);
				deferred.reject(xhr);
			}
		});
		
		return deferred.promise();
	},
    db_postProjectWithFile: function(query, formData){
        var deferred = $.Deferred();

        $.ajax({
            url: dbURL + query,
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