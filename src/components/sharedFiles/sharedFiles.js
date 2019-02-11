var viewModel;
$(document).ready(function() {
	viewModel = new ViewModel();
	viewModel.pageContainer.getUserInfo();

});

var displayImage=function(data){
	if(viewModel != undefined){
		var filename = data[data.length-3];
		var uploadDate = data[data.length-1];
		var name = data[data.length-3].split('.')[1].toLowerCase();
		var droneID=data[0];
        var path=dataStorageURL + '/drones/'+droneID+'/'+filename ;
		console.log(data);

		if(name == 'las' || name == 'laz'){
			window.location.href = '../dataViewer/viewer.html?name=' + filename + '&url=' + path;
		}else if(name != 'jpeg' && name != 'png' && name != 'jpg' && name != 'gif'){
			window.open(path, '_blank');
		}else{
			$('.lightboxImage').attr('href', path);
			$('.lightboxImage').attr('data-title',filename+'<br/>'+uploadDate);
			$('.lightboxImage').click();
		}
		
	}
	
}

var iframeLoaded=function(){
	if($('#iframe')[0]){
		$('#iframe').height($('#iframe')[0].contentWindow.document.body.scrollHeight);
	}
	
}