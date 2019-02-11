var InventoryView = (function () {
    var InventoryView = function () {
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
                    projects: [],
                    userProjects: []
                },
                inventoryList: []
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                projectChanged: function(id){
                    var self =this, index;
                    if(id == 'none'){
                        this.inventoryList=self.projectModel.userProjects;
                    }else{
                        this.projectModel.projects.some(function(curr, i){
                            if(curr['id']==id){
                                index=i;
                                return true;
                            }
                        });
                        this.inventoryList=this.projectModel.projects[index]['Drones'];
                    }

                },
                getUserDrones: function(){
                    var self=this;
                    httpCalls.db_getData('/'+this.user.id+'/drones').then(function(res){
                       var data = JSON.parse(res);
                        self.projectModel.userProjects=data;
                    }, function(err){

                    });
                },
                getProjects: function(){
                   var self =this;
                    inventoryController.getUserProjectsAndDrones(this.user.id).then(function(response){
                        self.projectModel.projects=response;
                        self.projectModel.selectedProject=response[0]['id'];
                        self.inventoryList=self.projectModel.projects[0]['Drones'];
                        setTimeout(function(){
                            $('select').material_select();
                        }, 10);
                  }, function(err){

                  });
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getProjects();
                        this.getUserDrones();
                        this.initSideNav();
                        this.brandTopBtn();
                        this.loadingSpinner(false);

                    }
                }

            }
        });
    };

    return InventoryView;
})();
