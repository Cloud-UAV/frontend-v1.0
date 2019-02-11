var ViewModel = (function() {
    var ViewModel = function() {
        this.pageContainer = new Vue({
            el: '#pageContainer',
            data: {
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined
                },
                droneModel: {
                    name: undefined,
                    description: undefined,
                    inventory: undefined,
                    disableBtn: false,
                    messageBox: false,
                    reviewDrone: [],
                    showExistingDrones: false,
                    showCreateDrone: false,
                    dronesArr: [],
                    selectedDrone: undefined,
                    type: undefined,
                },
                projectModel: {
                    name: undefined,
                    description: undefined,
                    showCreateProject: false,
                    showExistingProject: false,
                    projects: [],
                    type: undefined,
                    selectedProject: undefined,
                    existingProjectData: {}
                },
                shareModel: {
                    email: undefined,
                    emailsArr: [],
                },
                personnel: {
                    personnelArr: [],
                    selectedPersonnel: [],
                    reviewPersonnel: []
                },
                sensor: {
                    selectedSensor: [],
                    sensorArr: [],
                    reviewSensor: [],
                },
                review: {
                    reviewErrorMsge: false,
                    errorMessageContent: '',
                },
                complianceFiles: {
                    fileNames: [],
                    showFileLabel: true,
                    dragDropArea: false
                }
            },
            methods: {
                iframeResize: function() {
                    setTimeout(function() {
                        window.parent.iframeLoaded();
                    }, 1);
                },
                reset: function() {
                    this.droneModel.name = undefined;
                    this.droneModel.description = undefined;
                    $(':radio').prop('checked', false);

                    this.projectModel.showExistingProject = false;
                    this.projectModel.showCreateProject = false;
                    this.projectModel.name = undefined;
                    this.projectModel.description = undefined;
                    setTimeout(function() {
                        $('.tab-content').removeAttr('style');
                    }, 450);

                },
                selectedRadioBtn: function(type) {
                    if (type == 'existingProject') {
                        this.projectModel.showExistingProject = true;
                        this.projectModel.showCreateProject = false;
                        this.projectModel.name = this.projectModel.existingProjectData.name;
                        this.projectModel.description = this.projectModel.existingProjectData.description;
                        this.projectModel.type = type;
                    } else if (type == 'newProject') {
                        this.projectModel.name = undefined;
                        this.projectModel.description = undefined;
                        this.projectModel.showCreateProject = true;
                        this.projectModel.showExistingProject = false;
                        this.projectModel.type = type;
                    } else if (type == 'existingDrone') {
                        this.droneModel.showExistingDrones = true;
                        this.droneModel.showCreateDrone = false;
                        this.droneModel.type = type;
                    } else if (type == 'newDrone') {
                        this.droneModel.showExistingDrones = false;
                        this.droneModel.showCreateDrone = true;
                        this.droneModel.type = type;
                    }


                    this.iframeResize();
                    $('#nextBtn').removeClass('disabled');

                },
                removeEmail: function(email) {
                    console.log(email);
                    var index;
                    this.shareModel.emailsArr.some(function(curr, i) {
                        if (curr == email) {
                            index = i;
                            return true;
                        }
                    });
                    this.shareModel.emailsArr.splice(index, 1);
                },
                addSharedWithUsersEmail: function() {
                    console.log(this.shareModel.email);
                    this.shareModel.emailsArr.push(this.shareModel.email);
                    this.shareModel.email = undefined;
                },
                createDrone: function() {
                    this.droneModel.disablebleBtn = true;
                    this.droneModel.messageBox = false;
                    this.review.reviewErrorMsge = false;
                    var self = this;
                    this.review.errorMessageContent = 'One or more required fields is empty. Please review.';
                    var json = {
                        project: {},
                        drone: (this.droneModel.reviewDrone.length ==1  && !this.droneModel.reviewDrone[0].hasOwnProperty('id')) ? this.droneModel.reviewDrone[0] : this.droneModel.reviewDrone,
                        shareProject: self.shareModel.emailsArr,
                        sensor: self.sensor.reviewSensor,
                        personnel: self.personnel.reviewPersonnel,
                        'userID': self.user.id
                    };
                    if (this.droneModel.type == 'newDrone') {
                        if (this.droneModel.name == undefined || this.droneModel.description == undefined) {
                            this.review.reviewErrorMsge = true;
                            this.iframeResize();
                            return;
                        }
                    }

                    if (this.projectModel.type == 'newProject') {
                        if (this.projectModel.name == undefined || this.projectModel.description == undefined) {
                            this.review.reviewErrorMsge = true;
                            this.iframeResize();
                            return;
                        } else {
                            json['project'] = {
                                'name': self.projectModel.name,
                                'description': self.projectModel.description
                            };
                        }
                    } else {
                        if (this.projectModel.selectedProject == undefined) {
                            return;
                        } else {
                            json['project'] = this.projectModel.existingProjectData;
                        }
                    }

                    if (this.complianceFiles.fileNames.length == 0 && this.projectModel.type =='newProject') {
                        this.review.errorMessageContent = 'No compliance file uploaded. Please upload at least one compliance file.';
                        this.review.reviewErrorMsge = true;
                        this.iframeResize();
                        return;
                    }

                    if (this.droneModel.showCreateDrone == true) {
                        var thingData;
                        Promise.map(this.droneModel.reviewDrone, function(curr) {
                            return new Promise(function(resolve, reject) {
                                var obj = {
                                    'name': curr.name,
                                    'description': curr.description,
                                };
                                httpCalls.sta_postThings(JSON.stringify(obj)).then(function(data) {
                                    thingData = data;
                                    resolve();
                                }, function(err) {
                                    reject(err);
                                });
                            });
                        }).then(function() {
                            json['drone']['thingID'] = thingData['@iot.id'];
                            httpCalls.db_postData('/projects', JSON.stringify(json)).then(function() {
                                window.parent.showMessage();
                            }, function(xhr) {
                                console.log(xhr);
                            });
                        }, function(err) {

                        });
                    } else {
                        httpCalls.db_postData('/projects', JSON.stringify(json)).then(function() {
                            window.parent.showMessage();
                        }, function(xhr) {
                            console.log(xhr);
                        });
                    }

                },
                getDrones: function() {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/drones').then(function(data) {
                        self.droneModel.dronesArr = data;

                        setTimeout(function() {
                            $('select').material_select();
                            $('input[type="checkbox"]').addClass('customCheckbox');
                            $('span').removeClass('caret');
                            $('.input-field > span').html('');
                        }, 100);

                    });
                },
                getProjects: function() {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/projects/').then(function(data) {
                        console.log(data);
                        self.projectModel.projects = data;
                        if (data.length > 0) {
                            self.projectModel.selectedProject = data[0].id;
                            self.projectModel.existingProjectData = data[0];
                        }

                        $('.select-wrapper.initialized').remove('ul');

                        setTimeout(function() {
                            $('select').material_select();
                            $('span').removeClass('caret');
                            $('.input-field > span').html('');
                        }, 1);


                        if (data.length != 0) {
                            $('#existingProject').removeAttr('disabled');
                        }
                    });
                },
                getPersonnel: function() {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/personnel').then(function(data) {
                        self.personnel.personnelArr = data;

                        setTimeout(function() {
                            $('select').material_select();
                            $('input[type="checkbox"]').addClass('customCheckbox');
                            $('span').removeClass('caret');
                            $('.input-field > span').html('');
                        }, 100);

                    });
                },
                getSensor: function() {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/sensors').then(function(data) {
                        self.sensor.sensorArr = data;

                        setTimeout(function() {
                            $('select').material_select();
                            $('input[type="checkbox"]').addClass('customCheckbox');
                            $('span').removeClass('caret');
                            $('.input-field > span').html('');
                        }, 100);

                    });
                },
                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");
                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getProjects();
                        this.getPersonnel();
                        this.getSensor();
                        this.getDrones();
                    }
                }

            }
        });
    };

    return ViewModel;
})();