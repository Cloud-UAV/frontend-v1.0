var ViewModel = (function () {
    var ViewModel = function () {
        this.pageContainer = new Vue({
            el: '#pageContainer',
            mixins: [mixin],
            data: {
                loading: true,
                errorMsg: undefined,
                dbURL: dbURL,
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined
                },
                droneList: [],
                selectedDrone: undefined,
                projects: [],
                selectedProject: undefined,

                disableUploadBtn: true,
                fileNames: [],
                showFileLabel: true,
                messageBox: false,
                dragDropArea: false,
                progressbar: false,
            },
            methods: {
                loadingSpinner: function (value) {
                    this.disableUploadBtn = true;
                    this.loading = value;
                    var self = this;
                    var data = localStorage.getItem("user");

                    if (data == undefined) {
                        window.location.href = '/index.html';
                    } else {
                        this.user = JSON.parse(data);

                        this.initSideNav();
                        this.brandTopBtn();

                        $('.uploadFilesLink').dropdown();

                        uploadFilesController.getProjectsForCurrUser(this.user.id).then(function (response) {
                            self.projects = response;
                            self.selectedProject = response[0].id;
                            self.getDronesForCurrProject(response[0].id);

                        });

                    }
                },
                getDronesForCurrProject: function (projectID) {
                    var self = this;

                    uploadFilesController.getDronesForCurrUser(projectID).then(function (data) {
                        if (data.length > 0) {
                            self.droneList=data;
                            self.selectedDrone = data[0]['id'];
                        } else {
                            self.dragDropArea = true;
                        }
                    }, function (err) {

                    });
                },
                droneChangedEvent: function(droneID){
                    var self=this;
                    this.selectedDrone=droneID;
                },
                projectChangedEvent: function (projectID) {
                    var self = this;

                    self.selectedProject = projectID;
                    self.getDronesForCurrProject(projectID);
                },
                closeMessagAlert: function () {
                    this.messageBox = false;
                },
                callFiles: function (length, thingID, data) {
                    var self = this;
                    var deferred = $.Deferred();

                    if (length >= 0) {
                        uploadFilesController.sta_addFileToDatastream($('#file')[0].files[length], thingID, data).then(function (response) {
                            length -= 1;
                            if (response != undefined) {
                                data = response;
                            }
                            self.callFiles(length, thingID, data).then(function () {
                                deferred.resolve();
                            });
                        });
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise();
                },
                uploadFile: function (event) {
                    var self = this;
                    this.progressbar = true;
                    var formData = new FormData();
                    var self = this;
                    this.disableUploadBtn = true;
                    this.dragDropArea = true;
                    self.messageBox = false;

                    var droneID = this.selectedDrone;
                    var thingID;
                    // formData.append('date', moment().format('YYYY-MM-DD HH:mm:ss'));

                    self.droneList.some(function (curr, i, arr) {
                        if (curr['id'] == droneID) {
                            thingID = curr['thingID'];
                            return true;
                        }
                    });

                    var fileExtensions = {};
                    $.each($('#file')[0].files, function (i, file) {
                        formData.append('file-' + i, file);
                        fileExtensions[file.name.split('.')[1]] = undefined;
                    });

                    var keys = Object.keys(fileExtensions);
                    var fileExtConfirm = {};
                    var opQuery = '/ObservedProperties?$filter=';
                    keys.forEach(function (curr, i, arr) {
                        if (!fileExtConfirm.hasOwnProperty(curr)) {
                            if (curr.toLowerCase() == 'jpg' || curr.toLowerCase() == 'jpeg' || curr.toLowerCase() == 'png') {
                                if (Object.keys(fileExtConfirm).length == 0) {
                                    opQuery += 'name eq \'Image\'';
                                } else {
                                    opQuery += ' or name eq \'Image\'';
                                }

                            } else if (curr.toLowerCase() == 'las' || curr.toLowerCase() == 'laz') {
                                if (Object.keys(fileExtConfirm).length == 0) {
                                    opQuery += 'name eq \'Point Cloud\'';
                                } else {
                                    opQuery += ' or name eq \'Point Cloud\'';
                                }
                            } else {
                                if (Object.keys(fileExtConfirm).length == 0) {
                                    opQuery += 'name eq \'Data ' + curr.toLowerCase() + '\'';
                                } else {
                                    opQuery += ' or name eq \'Data ' + curr.toLowerCase() + '\'';
                                }
                            }
                            fileExtConfirm[curr] = undefined;
                        }

                    });

                    uploadFilesController.checkObservedPropertyAndSensor(opQuery, '/Sensors?$filter=name eq \'Drone\'', thingID, fileExtensions).then(function (data) {
                        data['dsMap'] = {};
                        data['opMap'] = {};
                        data['Thing']['Datastreams'].forEach(function (curr, i, arr) {
                            data['dsMap'][curr['name']] = curr;
                        });
                        data['ObservedProperties'].value.forEach(function (curr, i, arr) {
                            data['opMap'][curr['name']] = curr;
                        });

                        self.callFiles($('#file')[0].files.length - 1, thingID, data).then(function () {
                            uploadFilesController.db_addFile(droneID, formData).then(function () {
                                self.progressbar = false;
                                self.messageBox = true;
                                $(".mesge").fadeOut(3000);

                                self.disableUploadBtn = true;
                                self.dragDropArea = false;

                                $('#file').value = '';
                                self.fileNames = [];
                                self.showFileLabel = true;
                            }, function (data) {
                                self.progressbar = false;
                                self.disableUploadBtn = false;
                                self.dragDropArea = false;
                            });
                        });
                    });

                }

            }
        });
    };

    return ViewModel;
})();
