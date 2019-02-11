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

                },
                forgotPassword: function(){
                  window.location.href='../forgotPassword/forgotPassword.html';
                },
                signupPage: function () {
                    window.location.href = '../signup/signup.html';
                },
                loginBtnClicked: function () {
                    this.errorMsg = undefined;
                    var self = this;

                    if (this.userInput.password == undefined || this.userInput.password.length == 0 || this.userInput.email == undefined || this.userInput.email.length == 0) {
                        $('#password').addClass('invalid');
                        this.errorMsg = 'Missing Fields';
                    } else if (this.userInput.password.length < 6) {
                        $('#password').addClass('invalid');
                        this.errorMsg = 'Incorrect Password!';
                    } else {
                        $.get(dbURL+ '/users?email='+this.userInput.email+'&password='+this.userInput.password).then(function (data) {
                            localStorage.setItem("user", JSON.stringify(data));
                            window.location.href = '/components/home/home.html';
                        }, function (data) {
                            self.errorMsg = 'Incorrect email or password';
                        });
                    }
                }
            }
        });
    };

    return ViewModel;
})();
