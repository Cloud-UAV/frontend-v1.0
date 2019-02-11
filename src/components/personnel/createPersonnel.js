$(document).ready(function () {
    var personnelView = new PersonnelView();
    personnelView.pageContainer.getUserInfo();

    $('#personnelImage').change(function () {
        if (this.files.length != 0) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#previewImg').attr('src', e.target.result);
            };
            reader.readAsDataURL(this.files[0]);

            personnelView.pageContainer.personnelModel.img = this.files[0].name;
            personnelView.pageContainer.personnelModel.file = this.files[0];
        } else {
            $('#previewImg').attr('src', '/img/user.png');
            personnelView.pageContainer.personnelModel.img = undefined;
        }

    });

    $('#selectRole').on('change', function(){
        var values= $(this).val();
        var roles=[];

        if(values.length > 0){
            values.forEach(function(curr){
               roles.push(personnelController._roles[curr]);
            });
            personnelView.pageContainer.personnelModel.roles=roles;
        }else{
            personnelView.pageContainer.personnelModel.roles=[];
        }
    });

    $('#file').change(function () {
        var tokens = $(this).val().split('\\');
        personnelView.pageContainer.files.filesArr = [];

        var keys = Object.keys($(this).get(0).files);
        if (keys.length > 0) {
            personnelView.pageContainer.files.showFileLabel = false;
            for (var i in keys) {
                personnelView.pageContainer.files.filesArr.push($(this).get(0).files[i]);
            }

        } else {
            personnelView.pageContainer.files.showFileLabel = true;
        }

    });

    $('#file').bind('mousewheel', function (event) {
        if (event.originalEvent.deltaY > 0) {
            $('.fileInputBoxBorder').scrollTop(event.originalEvent.deltaY);
        } else {
            $('.fileInputBoxBorder').scrollTop(event.originalEvent.deltaY);
        }
    });

});
