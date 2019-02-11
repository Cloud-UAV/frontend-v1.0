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
                inventoryList: []
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                getSensors: function(){
                   var self =this;
                    inventoryController.getUserSensors(this.user.id).then(function(response){
                      console.log(JSON.stringify(response));
                        self.inventoryList=response;

                  }, function(err){

                  });
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getSensors();
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
