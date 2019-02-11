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
                    selectedProject: undefined,
                    projects: []
                }
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                viewProjectInfo: function(id, event){
                    window.location.href='/components/projects/projectInfo.html?id='+id;
                },
                deleteProject: function (id, event) {
                    event.stopPropagation();
                    var self = this;
                    projectsController.deleteProjectByID(id).then(function(data){
                        self.projectModel.projects = data;
                        self.selectedProject = data[0].id

                        $('.modal').modal('close');
                        $('.modal-overlay').remove();
                        self.showToast('The sensor was deleted','success');
                    }, function(err) {
                      self.showToast("Sorry, something went wrong. Please try again.",'danger');
                    });
                },
                getProjects: function () {
                    var self = this;
                    projectsController.getAllProjects(this.user.id).then(function (data) {
                        console.log(JSON.stringify(data));
                        self.projectModel.projects = data;
                        if(data.length > 0){
                            self.selectedProject = data[0].id;
                        }

                        self.$nextTick(function() {
                          this.initModal();
                          $('.card-content').matchHeight();
                        });
                    });
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getProjects();
                        this.initSideNav();
                        this.brandTopBtn();
                        this.loadingSpinner(false);

                    }
                }
            },

            computed: {
              groupedProjectData() {
                return _.chunk(this.projectModel.projects, 3)
              }
            }
        });
    };

    return ProjectsView;
})();
