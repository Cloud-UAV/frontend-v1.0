var ViewModel = (function() {
	var ViewModel = function(){
		this.pageContainer = new Vue({
			el: '#pageContainer',
			data: {
				loading: true,
				showErrorMsg: false,
				errorMsg: undefined,
                successMsge: false,
				userInput: {
					email: undefined,
					password: undefined,
					confirmPassword: undefined
				}
			},
			methods: {
				loadingSpinner: function(value){
					this.loading=value;
				},
				loginPage: function(){
					window.location.href='../../components/login/login.html';
				},
				resetPassword: function(){
                    if(this.userInput.password.length < 6){
						$('#password').addClass('invalid');
						this.errorMsg='Password must be 6 or more characters long!';
					}else if(this.userInput.password != this.userInput.confirmPassword){
						$('#confirmPassword').addClass('invalid');
						this.errorMsg='Password and confirm password are not the same.';
					}else{
                        var self=this;
                        self.successMsge=false;

                        var obj={
                            email: this.userInput.email,
                            password: this.userInput.password
                        };

                        $.ajax({
                            type: 'PATCH',
                            url: dbURL+'/users/forgotPassword',
                            data: JSON.stringify(obj),
                            contentType: 'application/json; charset=utf-8',
                            success: function(data){
                                console.log(data);
                                self.successMsge=true;
                            },
                            error: function(err){
                                console.log(err);
                            }
                        });
                    }
                }
            }
		});
	};

	return ViewModel;
})();
