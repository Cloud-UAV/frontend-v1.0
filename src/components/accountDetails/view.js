var ViewModel = (function() {
    var ViewModel = function() {
        var controller = new Controller();

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

            },
            methods: {
                loadingSpinner: function(value) {
                    this.loading = value;
                },

                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");
                    var self = this;

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        controller.loggedinUser = JSON.parse(userInfo);
                        this.loading=false;

                        this.initSideNav();
                        this.brandTopBtn();
                    }
                }

            }
        });
    };

    return ViewModel;
})();
