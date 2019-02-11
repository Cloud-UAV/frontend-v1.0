var PersonnelView = (function() {
    var PersonnelView = function() {
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
                personnelModel: {
                    personnel: []
                }
            },
            methods: {
                loadingSpinner: function(value) {
                    this.loading = value;
                },
                deletePersonnel: function(id, event) {
                    var self = this;
                    event.stopPropagation();

                    personnelController.deletePersonnelByID(id).then(function(data) {
                        self.personnelModel.personnel = data;
                        $('.modal').modal('close');
                        $('.modal-overlay').remove();
                        self.showToast('The personnel was deleted','success');
                    }, function(err){
                        var str = err.responseJSON.genErr.index;
                        var checkstr = "missionpersonnels_ibfk_3"

                        if (str.indexOf(checkstr) > -1) {
                          self.showToast("The personnel can't be deleted because the personel is in a mission.",'danger');
                          $('.modal.open').modal('close');
                          $('.modal-overlay').remove();
                        }
                        else {
                          self.showToast("Sorry, something went wrong. Please try again.",'danger');
                        }
                    });
                },
                viewPersonnelInfo: function(id) {
                    console.log(id);
                    window.location.href = '/components/personnel/viewEditPersonnel.html?id=' + id;
                },
                getPersonnel: function() {
                    var self = this;
                    personnelController.getPersonnelByUserID(this.user.id).then(function(data) {
                        if (data.length > 0) {
                            self.personnelModel.personnel = data;
                            self.$nextTick(function() {
                              this.initModal();
                              $('.card-content').matchHeight();
                            });
                        }
                    });
                },
                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        this.getPersonnel();

                        this.loadingSpinner(false);
                        this.initSideNav();
                    }
                }

            },
            computed: {
              groupedPersonnelData() {
                return _.chunk(this.personnelModel.personnel, 3)
              }
            }
        });
    };

    return PersonnelView;
})();
