var table, userInfo;
var optionsValues = {
    fileID: 0,
    download: 1,
    thumbnail: 2,
    fileName: 3,
    sharedBy: 4,
    uploadTime: 5
};
var shareData;

$(document).ready(function () {
    userInfo = JSON.parse(localStorage.getItem("user"));

    table = $('#filesTable').DataTable({
        'paging': true,
        'ordering': false,
        'info': true,
        // order: [[1, 'desc']],
        columnDefs: [{
            targets: [0, 1],
            className: 'mdl-data-table__cell--non-numeric'
		}],
        columnDefs: [{
            targets: 1,
            visible: false,
            render: function (data, type, row, meta) {
                data = '<a id="download"><i class="fa fa-download"></i></a>';
                return data;
            }
		}, {
            targets: 0,
            visible: false
		}]
    });

    $('#filesTable tbody').on('click', 'tr:not(:has(#download))', function () {
        var rowData = table.row(this).data();
        window.parent.displayImage(rowData);
    });



    $('#filesTable tbody').on('click', 'tr > td #download', function (e) {
        var parent = $(this).closest('tr');
        var data = table.row(parent).data();
        var filename = data[optionsValues['fileName']];
        var droneID = data[optionsValues['fileID']];

        var a = document.createElement('a');
        a.href = dataStorageURL + '/drones/' +droneID+'/'+ filename;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        delete(a);
    });

});

var options = function (action) {
    if (table != undefined) {
        var index = optionsValues[action];

        if (index != undefined) {
            var column = table.column(index);
            column.visible(!column.visible());

            for (var i = 0; i < 2; i++) {
                var column = table.column(i);
                if (column.visible() == true && index != i) {
                    column.visible(false);
                }
            }
        }
    }
};

var getData = function (data) {
    table.clear().draw(false);

    //user files
    for (var i = 0; i < data.length; i++) {
        var time = moment(data[i]['sharedDate']).format('MMM D, YYYY h:mm a');
        var imageURL;
        var fileExtension = data[i]['File'].name.split('.')[1].toLowerCase();

        if (fileExtension == 'png' || fileExtension == 'jpeg' || fileExtension == 'jpg') {
            imageURL = dataStorageURL + '/drones/'+data[i]['File']['Drone'].id+'/thumbnail-' + data[i]['File'].name;
        } else {
            imageURL = '/img/file_icon.png';
        }

        table.row.add([data[i]['File']['Drone'].id, 'download', '<img style="height: 50px;" src="' + imageURL + '"/>', data[i]['File'].name, data[i]['File']['Drone']['User']['firstName'] + ' ' + data[i]['File']['Drone']['User']['lastName'], time]).draw(false);
    }

    window.parent.iframeLoaded();
};
