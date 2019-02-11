var CreateSensorView = (function() {
    var CreateSensorView = function() {
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
                    name: undefined,
                    description: undefined,
                    inventory: undefined
                }
            },
            methods: {
                loadingSpinner: function(value) {
                    this.loading = value;
                },
                checkForm:function(){
                  this.errors = [];
                  if(!this.errors.length) return true;
                },
                postDrone: function() {
                    var self = this;
                    self.checkForm();

                    if (this.drone.name == undefined || this.drone.name == '') {
                        this.showToast("Please enter drone name",'danger');
                        return;
                    }

                    if (this.drone.inventory == undefined || this.drone.inventory == '') {
                      this.showToast("Please enter drone inventory",'danger');
                      return;
                    }

                    var data = {
                        name: this.drone.name,
                        description: this.drone.description,
                        Inventory: {
                            description: this.drone.inventory.toString().replace(/\n\r/g,'\n'),
                        },
                        'userID': this.user.id
                    };


                    httpCalls.sta_postThings(JSON.stringify({
                        name: this.drone.name,
                        description: this.drone.description+' ['+this.user.id+']'
                    })).then(function(sta) {
                        data['thingID']=sta['@iot.id'];

                        httpCalls.db_postData('/drones', JSON.stringify(data)).then(function() {
                          var str = 'The drone '+ self.drone.name + ' was created';
                          self.showToast(str,'success');
                          $('.btn').prop('disabled', true);
                          setTimeout(function(){location.href="../drone/drone.html"} , 2000);
                        }, function(err) {
                          this.showToast("Sorry, something went wrong. Please try again.",'danger');
                          $('.btn').prop('disabled', false);
                        });
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
                        this.loadingSpinner(false);

                    }
                }

            }
        });
    };

    return CreateSensorView;
})();
