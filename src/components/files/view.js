var ViewModel = (function() {
    var ViewModel = function() {
        this.pageContainer = new Vue({
            el: '#pageContainer',
            mixins: [mixin],
            data: {
                loading: true,
                errorMsg: undefined,
                closeSideBar: true,
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined,
                    role: undefined
                },
                projects: {
                    projectList: [],
                    projectSelected: undefined,
                },
                drones: {
                    droneList: [],
                    droneSelected: undefined,
                },
                viewFile: true,
                share: {
                    filename: undefined,
                    messageBox: false,
                    message: undefined,
                    shareFile: undefined,
                    shareFileWith_email: undefined,
                    errorMessageBox: false,
                    sharedWithPeople: [],
                    shareFileData: undefined,
                    showEmailInput: false,
                    isPublicFile: false
                },
                droneProjectData: [],

                selectedDroneProject: undefined,
                selectedDrone: undefined,
                selectedDS: undefined,
                staDatastreams: [],
                showImagesLink: false,
            },
            methods: {
                closeMessagAlert: function() {
                    this.share.messageBox = false;
                },
                loadingSpinner: function(value) {
                    this.loading = value;
                },
                removePublicFile: function() {
                    var self = this;

                    httpCalls.db_delete('/files/public/' + this.share.shareFileData[0]).then(function(data){
                        self.share.isPublicFile = false;
                    }, function(err){
                        console.log(err);
                    });
//                    $.ajax({
//                        type: 'DELETE',
//                        url: dbURL + '/files/public/' + this.share.shareFileData[0],
//                        headers: {
//                          'auth-token': httpCalls.getLSUser()['token']
//                        },
//                        success: function() {
//                            self.share.isPublicFile = false;
//                        },
//                        error: function(xhr) {
//                            console.log(xhr);
//                        }
//                    });
                },
                removePersonFromSharedFile: function(user) {
                    var self = this;

                    httpCalls.db_delete('/files/share/'+this.share.shareFileData[0] + '?userID=' + user.id).then(function(data){
                        console.log('deleted.....');
                        _.remove(self.share.sharedWithPeople.Users, function(curr) {
                            return curr.id == user.id;
                        });
                        var temp = self.share.sharedWithPeople;
                        self.share.sharedWithPeople = [];
                        self.share.sharedWithPeople = temp;
                    }, function(xhr){
                        console.log(xhr);
                    });
//                    $.ajax({
//                        type: 'DELETE',
//                        url: dbURL + '/files/share/' + this.share.shareFileData[0] + '?userID=' + user.id,
//                        headers: {
//                          'auth-token': httpCalls.getLSUser()['token']
//                        },
//                        success: function() {
//                            console.log('deleted.....');
//                            _.remove(self.share.sharedWithPeople.Users, function(curr) {
//                                return curr.id == user.id;
//                            });
//                            var temp = self.share.sharedWithPeople;
//                            self.share.sharedWithPeople = [];
//                            self.share.sharedWithPeople = temp;
//                        },
//                        error: function(xhr) {
//                            console.log(xhr);
//                        }
//                    });
                },
                shareFile: function() {
                    var self = this;
                    self.share.errorMessageBox = false;
                    self.share.messageBox = false;
                    console.log(this.share.shareFile);

                    if (this.share.shareFile == 'public') {
                        $.ajax({
                            type: 'POST',
                            url: dbURL + '/files/public',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify({
                                fileID: this.share.shareFileData[0]
                            }),
                            headers: {
                              'auth-token': httpCalls.getLSUser()['token']
                            },
                            success: function(data) {
                                self.share.isPublicFile = true;
                                self.share.message = 'File added to public domain.';
                                self.share.messageBox = true;
                                setTimeout(function() {
                                    $(".mesge").fadeOut(1000)
                                }, 2000);
                            },
                            error: function(xhr, error, text) {
                                console.log(xhr);
                                console.log('error in sharing ---------');
                                self.share.message = 'File already in public domain.';
                                self.share.errorMessageBox = true;

                                setTimeout(function() {
                                    $(".errorMesge").fadeOut(1000);
                                }, 3500);

                            }
                        });
                    } else {
                        if (this.share.shareFileWith_email != undefined) {
                            if (this.share.shareFileWith_email.length > 0) {
                                $.ajax({
                                    type: 'POST',
                                    url: dbURL + '/files/share',
                                    data: JSON.stringify({
                                        "fileID": this.share.shareFileData[0],
                                        "email": this.share.shareFileWith_email
                                    }),
                                    headers: {
                                      'auth-token': httpCalls.getLSUser()['token']
                                    },
                                    contentType: 'application/json; charset=utf-8',
                                    success: function(data) {
                                        filesController.getSharedFilesUsers(self.share.shareFileData[0]).then(function(data) {
                                            console.log(data);
                                            self.share.sharedWithPeople = data;
                                        }, function(err) {
                                            console.log(err);
                                        });

                                        self.share.message = 'File has been shared!';
                                        self.share.messageBox = true;
                                        setTimeout(function() {
                                            $(".mesge").fadeOut(1000)
                                        }, 2000);
                                    },
                                    error: function(xhr, error, text) {
                                        console.log(xhr);
                                        console.log('error in sharing ---------');
                                        self.share.message = 'User does not exist in the system!';
                                        self.share.errorMessageBox = true;

                                        setTimeout(function() {
                                            $(".errorMesge").fadeOut(1000);
                                        }, 3500);

                                    }
                                });
                            }
                        }
                    }

                },
                viewMapOfImages: function() {
                    window.location.href = '/components/files/imagesMap.html?dsID=' + this.selectedDS + '&droneID=' + this.drones.droneSelected;
                },
                options: function(event) {
                    var name = $(event.currentTarget).attr('id');

                    if ($('#' + name).hasClass('active')) {
                        $('.optionBtnsList > a.active').removeClass('active');
                    } else {
                        $('.optionBtnsList > a.active').removeClass('active');
                        $('.optionBtnsList > a#' + name).addClass('active');
                    }

                    $('#iframe')[0].contentWindow.options(name);
                },
                getAllFiles: function() {
                    var self = this;
                    this.showImagesLink = false;
                    var promise = httpCalls.db_getData('/' + this.drones.droneSelected + '/files');

                    promise.then(function(data) {
                        var interval = setInterval(function() {
                            checkIframe();
                        }, 1);
                        var checkIframe = function() {
                            if (typeof $('#iframe')[0].contentWindow.getData == 'function') {
                                $('#iframe')[0].contentWindow.droneID = self.drones.droneSelected;
                                $('#iframe')[0].contentWindow.droneArr = self.drones.droneList;
                                $('#iframe')[0].contentWindow.getData(data);
                                clearInterval(interval);
                                interval = undefined;
                            }
                        }
                    }, function(data) {
                        console.log('error');
                        console.log(data);
                    });
                },
                dsChanged: function(dsID) {
                    var self = this;
                    var ds;

                    if (dsID != 'all') {
                        this.staDatastreams.some(function(curr, i, arr) {
                            if (curr['@iot.id'] == dsID) {
                                ds = curr;
                                return true;
                            }
                        });
                        this.selectedDS=ds['@iot.id'];
                        if (ds['name'].toLowerCase() == 'images') {
                            this.showImagesLink = true;
                        } else {
                            this.showImagesLink = false;
                        }

                        httpCalls.db_getData('/' + self.drones.droneSelected + '/files?filter=' + ds['unitOfMeasurement']['symbol']).then(function(data) {
                            $('#iframe')[0].contentWindow.getData(data);
                        }, function(err) {
                            console.log(err);
                        });
                    } else {
                        var promise = httpCalls.db_getData('/' + self.drones.droneSelected + '/files');

                        promise.then(function(data) {
                            $('#iframe')[0].contentWindow.getData(data);
                        });
                    }
                },
                getSTADatastreamsForThing: function() {
                    var self = this;
                    var elem = _.find(this.drones.droneList, function(curr) {
                        return curr.id == self.drones.droneSelected;
                    });

                    if (elem == undefined) {
                        self.staDatastreams = [];
                    } else {
                        filesController.getAllDatastreams(elem['thingID']).then(function(data) {
                            self.staDatastreams = data.value;
                        }, function(err) {

                        });
                    }

                },
                droneSelectEvent: function(value) {
                    var self = this;
                    this.drones.droneSelected = value;
                    this.getAllFiles();

                    this.getSTADatastreamsForThing();
                },
                projectChanged: function(projectID) {
                    var self = this;

                    var elem = _.find(self.projects.projectList, function(curr) {
                        return curr.id == projectID;
                    });

                    if (elem['Drones'].length > 0) {
                        this.drones.droneList = elem['Drones'];
                        this.drones.droneSelected = elem['Drones'][0]['id'];
                        self.getAllFiles();

                    } else {
                        this.drones.droneList = [];
                        this.drones.droneSelected = undefined;
                        $('#iframe')[0].contentWindow.clearTableData();
                    }
                    this.getSTADatastreamsForThing();

                    setTimeout(function() {
                        $('select').material_select();
                    }, 1);
                },
                getUserProjectsWithDrones: function() {
                    var self = this;

                    httpCalls.db_getData('/' + this.user.id + '/projects?$expand=Drones').then(function(response) {
                        self.projects.projectList = response;
                        if (response.length > 0) {
                            var elem = _.find(self.projects.projectList, function(curr) {
                                return curr.userID == self.user.id;
                            });
                            self.projects.projectSelected = elem.id;
                            self.projectChanged(elem['id']);
                        } else {
                            $('#iframe')[0].contentWindow.clearTableData();
                        }

                        setTimeout(function() {
                            $('select').material_select();
                        }, 1);
                    });
                },
                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");
                    var self = this;

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.loadingSpinner(false);
                        this.initSideNav();
                        this.brandTopBtn();
                        this.getUserProjectsWithDrones();

                        $('.uploadFilesLink').dropdown();
                        $('select').material_select();


                    }
                }

            }
        });


    };

    return ViewModel;
})();
