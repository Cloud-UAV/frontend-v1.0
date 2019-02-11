var MissionsView = (function() {
    var MissionsView = function() {
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
                projectsModel: {
                    projects: [],
                    selectedProject: {
                        Missions: []
                    },
                }
            },
            methods: {
                validator: function (val) {
                  var format = 'MMM DD, YYYY, HH:mm';
                  if (val === null)
                    return 'N/A';
                  else
                    return moment(val).format(format);
                },
                loadingSpinner: function(value) {
                    this.loading = value;
                },
                projectChanged: function(value){
                    var elem = _.find(this.projectsModel.projects, function(curr){
                        return curr.id == value;
                    });
                    this.projectsModel.selectedProject=elem;

                },
                viewMissionInfo: function(id){
                  window.location.href='/components/missions/missionInfo.html?missionID='+id;
                },
                deleteMission: function(id, event){
                    event.stopPropagation();
                    event.preventDefault();

                    var self=this;
                  httpCalls.db_delete('/missions/'+id).then(function(){
                      var tempMissions = self.projectsModel.selectedProject.Missions;
                      var missions = _.remove(tempMissions, function(curr){
                          return curr.id == id;
                      });
                      self.projectsModel.selectedProject.Missions=[];
                      self.projectsModel.selectedProject.Missions=tempMissions;
                      self.showToast('The mission was deleted','success');
                  }, function(err){
                      var str = err.responseJSON.error;
                      var checkstr = "file"

                      if (str.indexOf(checkstr) > -1) {
                        self.showToast("The mission was deleted but this mission has no flight record on file.",'success');
                        setTimeout(function() {
                            location.reload();
                        }, 2500);
                      }

                      else {
                        self.showToast("Sorry, something went wrong. Please try again.",'danger');
                      }

                  });
                },
                getMissions: function() {
                    var self = this;
                    httpCalls.db_getData('/' + this.user.id + '/projects?$expand=missions').then(function(data) {
                        self.projectsModel.projects = data;
                        if (data.length > 0) {
                            var format = 'MMM DD, YYYY, HH:mm';
                            for (var i = 0; i < data[0].Missions.length; i++) {
                              data[0].Missions[i].startTime = moment(data[0].Missions[i].startTime).format(format);
                            }
                            self.projectsModel.selectedProject = data[0];

                            self.$nextTick(function() {
                              self.initModal();
                            });
                        }
                        setTimeout(function() {
                            $('select').material_select();
                        }, 10);
                    }, function(err) {
                        console.log(err);
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
                        this.getMissions();
                        this.loadingSpinner(false);

                    }
                }

            }
        });
    };

    return MissionsView;
})();
