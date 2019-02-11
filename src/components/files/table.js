var table, userInfo;
var optionsValues = {
    "delete": 0,
    "download": 1,
    "share": 2,
    'thumbnail': 3,
    "fileName": 4,
    "uploadTime": 5,
};
var filesData = {};
var shareData, droneID, droneArr;

$(document).ready(function() {
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
            targets: 0,
            visible: false,
            render: function(data, type, row, meta) {
                data = '<a id="removeFile"><i class="fa fa-trash"></i></a>';
                return data;
            }
        }, {
            targets: 1,
            visible: false,
            render: function(data, type, row, meta) {
                data = '<a id="download"><i class="fa fa-download"></i></a>';
                return data;
            }
        }, {
            targets: 2,
            visible: false,
            render: function(data, type, row, meta) {
                data = '<a id="share"><i class="fa fa-user-plus"></i></a>';
                return data;
            }
        }]
    });

    var deleteFromDB = function(fileID) {
        return httpCalls.db_delete('/files/' + fileID);
//        return $.ajax({
//            type: 'DELETE',
//            url: dbURL + '/files/' + fileID,
//            headers: {
//                'auth-token': httpCalls.getLSUser()['token']
//            },
//            success: function(data) {
//
//            },
//            error: function(xhr, err, text) {
//                console.log(xhr);
//                console.log('error ---- could not delete file');
//            }
//        });
    }

    $('#filesTable tbody').on('click', 'tr:not(:has(#removeFile,#download,#share))', function() {
        var rowData = table.row(this).data();
        window.parent.displayImage(rowData);
    });

    $('#filesTable tbody').on('click', 'tr > td #removeFile', function(e) {
        e.preventDefault();
        var parent = $(this).closest('tr');
        var data = table.row(parent).data();

        var thingID;
        var fileExtension = data[optionsValues['fileName']].split('.')[1].toLowerCase();
        var queryStr;

        if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg') {
            queryStr = 'Images';
        } else {
            queryStr = 'Data ' + fileExtension;
        }

        droneArr.some(function(curr, i, arr) {
            if (curr['id'] == droneID) {
                thingID = curr['thingID'];
                return true;
            }
        });

        $.ajax({
            type: 'GET',
            url: sensorThingsURL + '/Things(' + thingID + ')/Datastreams?$filter=name eq \'' + queryStr + '\'&$expand=Observations($filter=substringof(\'' + data[optionsValues['fileName']] + '\',result))',
            success: function(response) {
                console.log(response);
                if (response.value[0]['Observations'].length == 0) {
                    deleteFromDB(data[0]).then(function() {
                        table.row(parent).remove().draw();
                    });
                    return;
                }
                $.ajax({
                    type: 'DELETE',
                    url: sensorThingsURL + '/Observations(' + response.value[0]['Observations'][0]['@iot.id'] + ')',
                    success: function() {

                        deleteFromDB(data[0]).then(function() {
                            table.row(parent).remove().draw();
                        });
                    },
                    error: function(xhr, err, txt) {
                        console.log(xhr);
                        deleteFromDB(data[0]).then(function() {
                            table.row(parent).remove().draw();
                        });
                    }
                });

            },
            error: function(xhr, err, text) {
                console.log(xhr);
                deleteFromDB(data[0]).then(function() {
                    table.row(parent).remove().draw();
                });
            }
        });
    });

    $('#filesTable tbody').on('click', 'tr > td #download', function(e) {
        var parent = $(this).closest('tr');
        var data = table.row(parent).data();
        var filename = data[optionsValues['fileName']];
        
        var a = document.createElement('a');
        a.href = dataStorageURL + '/drones/' + droneID+'/'+filename;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        delete(a);
    });

    $('#filesTable tbody').on('click', 'tr > td #share', function(e) {
        var parent = $(this).closest('tr');
        var data = table.row(parent).data();
        shareData = data;
        console.log(data);
        window.parent.shareModal(data);
        // $.ajax({
        // 	type: 'GET',
        // 	url: dbURL+'/files/share/'+optionsValues['fileName']+'?userID='+userInfo.id+'&shareWithEmail='+email
        // });
    });

});

var options = function(action) {
    if (table != undefined) {
        var index = optionsValues[action];

        if (index != undefined) {
            var column = table.column(index);
            column.visible(!column.visible());

            for (var i = 0; i < 3; i++) {
                var column = table.column(i);
                if (column.visible() == true && index != i) {
                    column.visible(false);
                }
            }
        }
    }
};

var clearTableData=function(){
    table.clear().draw(false);
};

var getData = function(data) {
    table.clear().draw(false);

    //user files
    for (var i = 0; i < data.length; i++) {
        var time = moment.utc(data[i]['uploadDate'], 'YYYY-MM-DD HH:mm:ss').local().format('MMM D, YYYY h:mm a');
        var imageURL;
        var fileExtension = data[i].name.split('.')[1].toLowerCase();

        if (fileExtension == 'png' || fileExtension == 'jpeg' || fileExtension == 'jpg') {
            imageURL = dataStorageURL + '/drones/'+droneID+'/thumbnail-' + data[i].name;
        } else {
            imageURL = '/img/file_icon.png';
        }

        filesData[data[i].name] = data[i];
        table.row.add([data[i].id, 'download', 'share', '<img style="height: 50px;" src="' + imageURL + '"/>', data[i].name, time]).draw(false);
    }

    window.parent.iframeLoaded();
};