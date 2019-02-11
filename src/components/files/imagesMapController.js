var imagesMapController={
	getObservations: function(query, dataArr) {
		var deferred = $.Deferred();
		var self=this;
/*
		$.get(sensorThingsURL+'/Datastreams('+this.dsID+')/Observations?$orderby=phenomenonTime asc&$expand=FeatureOfInterest'+query, function(data){
			dataArr = dataArr.concat(data.value);
			
			if(data.hasOwnProperty('@iot.nextLink')){
				self.getObservations('&$skip=100',dataArr).then(function(data){
					deferred.resolve(data);
				});
			}else{
				deferred.resolve(dataArr);
			}
		});
*/
		$.ajax({
			type:'get',
			url: sensorThingsURL+'/Datastreams('+this.dsID+')/Observations?$orderby=phenomenonTime asc&$expand=FeatureOfInterest'+query,
			headers: {
				'Authorization': auth
			},
			success : function(data) {
				dataArr = dataArr.concat(data.value);
				if(data.hasOwnProperty('@iot.nextLink')){
					self.getObservations('&$skip=100',dataArr).then(function(data){
						deferred.resolve(data);
					});
				}else{
					deferred.resolve(dataArr);
				}
			},
			error: function (xhr, err, text) {
                console.log('error happened: ' + xhr);
                deferred.reject(xhr);
            }
		})

		return deferred.promise();
	}
};