var SensorsView = (function() {
  var SensorsView = function() {
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
          data: [],
        }
      },
      methods: {
        loadingSpinner: function(value) {
          this.loading = value;
        },
        deleteSensor: function(sensorID, event) {
          event.stopPropagation();
          var self = this;

          sensorsController.deleteSensor(sensorID).then(function() {
            var index;
            self.sensor.data.some(function(curr, i) {
              if (curr['id'] == sensorID) {
                index = i;
                return true;
              }
            });
            self.sensor.data.splice(index, 1);
            $('.modal').modal('close');
            $('.modal-overlay').remove();
            self.showToast('The sensor was deleted','success');
          }, function(err) {
            self.showToast("Sorry, something went wrong. Please try again.",'danger');
          });
        },
        getSensors: function() {
          var self = this;
          sensorsController.getSensors(this.user.id).then(function(data) {
            console.log(data);
            self.sensor.data = data;

            self.$nextTick(function() {
              this.initModal();
              $('.card-content').matchHeight();
            });

          }, function(err) {});
        },
        getUserInfo: function() {
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
        },
      },
      computed: {
        groupedSensorData() {
          return _.chunk(this.sensor.data, 3)
        }
      }
    });
  };

  return SensorsView;
})();
