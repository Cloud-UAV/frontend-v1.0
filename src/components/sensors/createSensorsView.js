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
        sensor: {
          name: undefined,
          description: undefined,
          inventory: undefined
        },
        errors:[]
      },
      methods: {
        loadingSpinner: function(value) {
          this.loading = value;
        },
        checkForm:function(){
          this.errors = [];
          if(!this.errors.length) return true;
        },
        postSensor: function() {
          this.checkForm();

          var self = this;

          if (this.sensor.name == undefined || this.sensor.name == '') {
            this.showToast("Please enter sensor name",'danger');
            return;
          }

          if (this.sensor.inventory == undefined || this.sensor.inventory == '') {
            this.showToast("Please enter sensor inventory",'danger');
            return;
          }

          var data = {
            name: this.sensor.name,
            description: this.sensor.description,
            Inventory: {
              description: this.sensor.inventory.toString().replace(/\n\r/g, '\n'),
            },
            'userID': this.user.id
          };
          sensorsController.postSensor(data).then(function() {
            self.showToast('The sensor ' + self.sensor.name + ' has been created','success');
            $('.btn').prop('disabled', true);
            setTimeout(function(){location.href="../sensors/sensors.html"} , 2000);
          }, function(err) {
            this.showToast("Sorry, something went wrong. Please try again.",'danger');
            $('.btn').prop('disabled', false);
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
