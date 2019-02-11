var DroneView = (function () {
    var DroneView = function () {
        this.pageContainer = new Vue({
            el: '#pageContainer',
            mixins: [mixin],
            data: {
                loading: true,
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined
                },
                drone: {
                    dronesArr: [],
                    userDrones: [],
                    viewUserDrones: false
                },
                projectModel: {
                    selectedProject: undefined,
                    projects: []
                }
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                selectEvent: function (value) {
                    var self = this;

                    if (value == 'none') {
                        this.drone.viewUserDrones = true;
                        this.getUserDrones();
                    } else {
                        this.drone.viewUserDrones = false;
                        this.getDronesForProject(value);
                    }

                },
                deleteDroneFromList: function (droneID) {
                    var index, self=this;
                    if (self.drone.viewUserDrones == true) {
                        self.drone.userDrones.some(function (curr, i, arr) {
                            if (curr['id'] == droneID) {
                                index = i;
                                return true;
                            }
                        });

                        self.drone.userDrones.splice(index, 1);
                    } else {
                        self.drone.dronesArr.some(function (curr, i, arr) {
                            if (curr['id'] == droneID) {
                                index = i;
                                return true;
                            }
                        });

                        self.drone.dronesArr.splice(index, 1);
                    }
                },
                deleteDrone: function (droneID, thingID) {
                    var self = this;

                    droneController.sta_deleteThing(thingID).then(function () {
                        droneController.db_deleteDrone(droneID).then(function () {
                            self.deleteDroneFromList(droneID);
                            $('.modal').modal('close');
                            self.showToast('The drone was deleted','success');
                        }, function(err) {
                          self.showToast("Sorry, something went wrong. Please try again.",'danger');
                        });
                    }, function (err) {
                        droneController.db_deleteDrone(droneID).then(function () {
                            self.deleteDroneFromList(droneID);
                            $('.modal').modal('close');
                            self.showToast('The drone was deleted','success');
                        }, function(err) {
                          self.showToast("Sorry, something went wrong. Please try again.",'danger');
                        });
                    });
                },
                getUserDrones: function () {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/drones').then(function (data) {
                        self.drone.userDrones = data;

                        self.$nextTick(function() {
                          self.initModal();
                          $('.card-content').matchHeight();
                        });
                    });
                },
                getDronesForProject: function (projectID) {
                    var self = this;
                    httpCalls.db_getData('/projects/' + projectID + '/drones').then(function (data) {
                        self.drone.dronesArr = data;

                        self.$nextTick(function() {
                          self.initModal();
                          $('.card-content').matchHeight();
                        });
                    });
                },
                getProjectsForCurrUser: function () {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/projects?$expand=Shared,Drones').then(function (response) {
                        self.projectModel.projects = response;
                        if(self.projectModel.projects.length != 0){

                            // self.projectModel.selectedProject = response[0].id;
                            // self.getDronesForProject(response[0].id);

                            self.getUserDrones();

                            self.$nextTick(function() {
                              self.initModal();
                              $('.card-content').matchHeight();
                            });
                        }
                        self.selectEvent('none');
                        
                        setTimeout(function () {
                            $('select').material_select();
                        }, 5);
                    });

                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getProjectsForCurrUser();
                        this.initSideNav();
                        this.brandTopBtn();
                        this.loadingSpinner(false);

                    }
                }
            },
            computed: {
              groupeddronesArr() {
                return _.chunk(this.drone.dronesArr, 2)
              },
              groupeduserDrones(){
                return _.chunk(this.drone.userDrones, 2)
              }
            }
        });
    };

    return DroneView;
})();
