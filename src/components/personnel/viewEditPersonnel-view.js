var PersonnelView = (function () {
    var PersonnelView = function () {
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
                    personnel: {
                        'imgURL': '/img/user.png'
                    },
                    edit: false
                }
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                getPersonnel: function (properties) {
                    var self = this;
                    personnelController.getPersonnelByID(properties['id']).then(function (response) {
                        var data = JSON.parse(response);                        
                        
                        if (data['imagePath'] != null) {
                            var tokens = data['imagePath'].split('/');
                            data['imgURL'] = dataStorageURL + '/personnel/' + data.id + '/' + tokens[tokens.length - 1];
                        } else {
                            data['imgURL'] = '/img/user.png';
                        }

                        self.personnelModel.personnel = data;
                    }, function (err) {

                    });
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        var properties = personnelController.getURLParams();
                        this.getPersonnel(properties);

                        this.loadingSpinner(false);
                        this.initSideNav();
                    }
                }

            }
        });
    };

    return PersonnelView;
})();
