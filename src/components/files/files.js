var viewModel;
$(document).ready(function () {
    viewModel = new ViewModel();
    viewModel.pageContainer.getUserInfo();

    var target = $('.drag-target')[0];
    var called = 0;

    $('#shareWithModal').modal();

//    var dsSelectObserver = new MutationObserver(function (mutations) {
//        viewModel.pageContainer.dsChanged($('#dsSelect').attr('data-value'));
//    });
//
//    dsSelectObserver.observe($('#dsSelect')[0], {
//        attributes: true,
//        attributeFilter: ['data-value']
//    });

    $('#project').change(function () {
        viewModel.pageContainer.projectChanged(this.value);
    });
    $('#drone').change(function () {
        viewModel.pageContainer.droneSelectEvent(this.value);
    });
    $('#dsSelect').change(function () {
        viewModel.pageContainer.dsChanged(this.value);
    });
    $('.collapsible').collapsible();

});

var shareModal = function (data) {
    if (viewModel != undefined) {
        viewModel.pageContainer.share.displayFile = undefined;
        var filename = data[data.length - 2];
        var publicData, sharedData;
        $('.modal-content input#email').removeClass('valid');
        $('.modal-content input#email').removeClass('invalid');
        viewModel.pageContainer.share.shareFileData = data;
        viewModel.pageContainer.share.sharedWithPeople = [];
        viewModel.pageContainer.share.filename = filename;
        
        var shareFilePromise = filesController.getSharedFilesUsers(data[0]).then(function(data){
            sharedData = data;
        });
        var publicFilePromise = $.ajax({
            type: 'GET',
            url: dbURL+ '/files/public/'+data[0],
            headers: {
              'auth-token': httpCalls.getLSUser()['token']  
            },
            success: function(data){
                publicData=data
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
        Promise.all([shareFilePromise, publicFilePromise]).then(function(){
            console.log(sharedData);
            console.log(publicData);
            viewModel.pageContainer.share.isPublicFile =false;
            viewModel.pageContainer.share.sharedWithPeople=[];
            
            if(sharedData.Users.length ==0 && Object.keys(publicData).length == 0){
                viewModel.pageContainer.share.isPublicFile =false;
                viewModel.pageContainer.share.sharedWithPeople=[];
            }else if(sharedData.Users.length > 0){
                viewModel.pageContainer.share.sharedWithPeople = sharedData;
                viewModel.pageContainer.share.isPublicFile =false;
            }else if(Object.keys(publicData).length > 0){
                viewModel.pageContainer.share.isPublicFile =true;
            }
            $('#shareWithModal').modal('open');
        }, function(err){
            console.log(err);
            $('#shareWithModal').modal('open');
        });
    }
};

var displayImage = function (data) {
    if (viewModel != undefined) {
        var droneID = viewModel.pageContainer.drones.droneSelected;
        var filename = data[data.length - 2];
        var uploadDate = data[data.length - 1];
        var name = data[data.length - 2].split('.')[1].toLowerCase();
        var path=dataStorageURL + '/drones/'+droneID+'/' + filename;
        
        if (name == 'las' || name == 'laz') {
            window.location.href = '../dataViewer/viewer.html?name=' + filename + '&url=' + path;
        } else if (name != 'jpeg' && name != 'png' && name != 'jpg' && name != 'gif') {
            // $('#file').attr('src', 'http://localhost:8080/api/files/'+viewModel.pageContainer.user.id+'/'+data[0]);
            // var viewer = new Viewer($('#file')[0]);
            // console.log(viewer);

            window.open(path, '_blank');
        } else {
            $('.lightboxImage').attr('href', path);
            $('.lightboxImage').attr('data-title', filename + '<br/>' + uploadDate);
            $('.lightboxImage').click();
        }

    }

};

var iframeLoaded = function () {
    if ($('#iframe')[0]) {
        $('#iframe').height($('#iframe')[0].contentWindow.document.body.scrollHeight);
    }

};
