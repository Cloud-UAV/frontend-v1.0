var ViewModel = (function () {
    var ViewModel = function () {
        this.pageContainer = new Vue({
            el: '#pageContainer',
            data: {
                loading: true,
                errorMsg: undefined,
                userInput: {
                    email: undefined,
                    password: undefined
                }
            },
            methods: {
                loadingSpinner: function (value) {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo != undefined) {
                        if (userInfo.length > 0) {
                            window.location.href = '/components/files/files.html';
                        } else {
                            this.loading = value;
                        }
                    } else {
                        this.loading = value;
                    }

                }
            }
        });
    };

    return ViewModel;
})();
