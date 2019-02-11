var CreateMissionView = (function() {
    var CreateMissionView = function() {
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
                missionName: undefined,
                missionDescription: undefined,
                missionModel: {
                    project: {
                        Drones: [],
                        Personnels: [],
                        Sensors: [],

                    },
                    selectedDrone: undefined,
                    selectedSensor: undefined,
                    selectedPersonnels: undefined,
                    projectList: []
                },
                messageBox: false
            },
            methods: {
                loadingSpinner: function(value) {
                    this.loading = value;
                },
                closeMessageBox: function() {
                    this.messageBox = false;
                },
                createMission: function(){
                    var self=this;
                    if(this.missionName == undefined){
                        return;
                    }
                  var mission={
                      name: this.missionName,
                      projectID: this.missionModel.project.id
                  };

                    if(this.missionModel.selectedSensor != undefined){
                        mission['sensorID']=this.missionModel.selectedSensor;
                    }if(this.missionModel.selectedDrone != undefined){
                        mission['droneID']=this.missionModel.selectedDrone;
                    }if(this.missionModel.selectedPersonnels != undefined){
                        mission['Personnels']=this.missionModel.selectedPersonnels;
                    }if(this.missionDescription != undefined){
                        mission['description']=this.missionDescription;
                    }

                    httpCalls.db_postData('/missions', JSON.stringify(mission)).then(function(data){
                        self.showToast('The mission ' + self.missionModel.missionName + ' has been created','success');
                        setTimeout(function(){location.href="../missions/missions.html"} , 2000);
                    }, function(err){
                        console.log(err);
                        self.showToast("Sorry, something went wrong. Please try again.",'danger');
                    });
                },
                selectChanged: function(name, value){
                    console.log(value);
                    if(name == 'drone'){
                        this.missionModel.selectedDrone=value;
                    }else if(name == 'sensor'){
                        this.missionModel.selectedSensor=value;
                    }else if(name == 'personnel'){
                        this.missionModel.selectedPersonnels=value;
                    }
                },
                projectChanged: function(value) {
                    var elem = _.find(this.missionModel.projectList, function(curr) {
                        return curr.id == value;
                    });
                    this.missionModel.project = elem;

                    setTimeout(function() {
                        $('select').material_select();
                        $('input[type="checkbox"]').addClass('customCheckbox');
                    }, 10);
                },
                getUserProjects: function() {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/projects?$expand=drones,sensors,personnels').then(function(data) {
                        self.missionModel.projectList = data;
                        if (data.length > 0) {
                            self.missionModel.project = data[0];
                        }

                        setTimeout(function() {
                            $('select').material_select();
                            $('input[type="checkbox"]').addClass('customCheckbox');
                        }, 10);
                    });
                },
                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.initSideNav();
                        this.brandTopBtn();
                        this.getUserProjects();
                        $('select').material_select();
                        this.loadingSpinner(false);

                    }
                }

            }
        });
    };

    return CreateMissionView;
})();
