var HomeView = (function () {
    var HomeView = function () {
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
                project_num:0,
                drone_num:0,
                mission_num:0,
                sensor_num:0,
                flight_time:'',
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                calcFlightTime:function(totalDuration){
                  var flight_time = '';
                  if (totalDuration.hours() != 0) {
                      flight_time += totalDuration.hours() + ' h ';
                  }
                  if (totalDuration.hours() < 10 && totalDuration.minutes() != 0) {
                      flight_time += totalDuration.minutes() + ' m ';
                  }
                  if (flight_time == '')
                  {
                    flight_time = '0 m';
                  }

                  return flight_time;
                },
                getFlightTime:function (missions){
                  var format = 'MMM DD, YYYY, HH:mm:ss';
                  var formattedST = 0;
                  var formattedET = 0;
                  var totalDuration = moment.duration();

                    missions.forEach(function(mission){
                       formattedST = moment(mission.startTime);
                       formattedET = moment(mission.endTime);
                       var duration = moment.duration(formattedET.diff(formattedST));
                       totalDuration.add(duration);
                  });

                  return totalDuration;
                },
                getSumReportThroughEachEntity:function(){
                  var self = this;
                  httpCalls.db_getData('/' + this.user.id + '/projects').then(function(data) {
                    self.project_num = data.length;
                  }, function(err) {
                    console.log(err);
                    return 0;
                  });

                  httpCalls.db_getData('/' + this.user.id + '/sensors').then(function(data) {
                    self.sensor_num = data.length;
                  }, function(err) {
                    console.log(err);
                    return 0;
                  });

                  httpCalls.db_getData('/' + this.user.id + '/drones').then(function(data) {
                    self.drone_num = data.length;
                  }, function(err) {
                    console.log(err);
                    return 0;
                  });

                  httpCalls.db_getData('/' + this.user.id + '/projects?$expand=missions').then(function(data) {
                    var mission_num = 0;
                    data.forEach(function(project){
                      mission_num = mission_num + project.Missions.length;
                    });

                    var totalDuration = moment.duration();
                    var flight_time = '';
                    totalDuration.add(self.getFlightTime(data));
                    self.mission_num = mission_num;
                    self.flight_time = self.calcFlightTime(totalDuration);
                  }, function(err) {
                    console.log(err);
                    return 0;
                  });
                },
                getSumReport:function (){
                  var self = this;
                    self.getSumReportThroughEachEntity();
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.initSideNav();
                        this.getSumReport();
                        this.loadingSpinner(false);
                        this.brandTopBtn();
                    }
                }

            }
        });
    };

    return HomeView;
})();
