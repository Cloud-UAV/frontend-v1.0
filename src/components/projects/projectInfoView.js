var ProjectsView = (function () {
    var ProjectsView = function () {
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
                projectModel: {
                    projectInfo: {
                        Drones: [],
                        Sensors: [],
                        Personnels: [],
                        Missions: [],
                        ComplianceFiles: []
                    }
                }
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                summaryCardClicked: function(tabName){
                  $('ul.tabs').tabs('select_tab', tabName);
                },
                getProjectInfo: function () {
                    var self = this;
                    var params = projectsController.getURLParams();

                    httpCalls.db_getData('/projects/'+params['id']).then(function(response){
//                        if(response['ComplianceFiles'].length > 0){
//                            response['ComplianceFiles'].forEach(function(curr, i){
//                                curr['imgURL']=dbURL+'/projects/compliance/files/'+curr.id;
//                            });
//
//                        }
//                        console.log(response);
                        self.projectModel.projectInfo=response;
                    }, function(err){

                    });
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getProjectInfo();

                        this.loadingSpinner(false);
                        $('ul.tabs').tabs();

                        this.initSideNav();
                        this.brandTopBtn();
                    }
                }

            }
        });
    };

    return ProjectsView;
})();
