var complianceController = {
    _geojsonData: undefined,
    getGeoJSONFile: function(){
       var self=this; 
       var deferred = $.Deferred();
        $.getJSON('/airspaceFiles/canadian_airspace_noE_below12500_259R1.geojson').then(function(data){
           self._geojsonData=data;
            deferred.resolve();
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise();
    }
};
