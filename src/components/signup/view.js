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
					firstName: undefined,
					lastName: undefined,
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
				signupBtnClicked: function(){
					this.errorMsg=undefined;
                    this.successMsge= false;
					var self =this;

					if(this.userInput.firstName == undefined || this.userInput.lastName == undefined || this.userInput.email == undefined || this.userInput.password == undefined || this.userInput.confirmPassword == undefined || this.userInput.firstName.length == 0 || this.userInput.lastName.length == 0 || this.userInput.email.length == 0 || this.userInput.password.length == 0 || this.userInput.confirmPassword.length == 0){
						this.errorMsg='Some fields are missing.'
						if(this.userInput.firstName == undefined || this.userInput.firstName.length == 0){
							$("#firstName").addClass('invalid');
						}if(this.userInput.lastName == undefined || this.userInput.lastName.length == 0){
							$("#lastName").addClass('invalid');
						}if(this.userInput.email == undefined || this.userInput.email.length == 0){
							$("#email").addClass('invalid');
						}if(this.userInput.password == undefined || this.userInput.password.length == 0){
							$("#password").addClass('invalid');
						}if(this.userInput.confirmPassword == undefined || this.userInput.confirmPassword.length == 0){
							$("#confirmPassword").addClass('invalid');
						}
					}else if(this.userInput.password.length < 6){
						$('#password').addClass('invalid');
						this.errorMsg='Password must be 6 or more characters long!';
					}else if(this.userInput.password != this.userInput.confirmPassword){
						$('#confirmPassword').addClass('invalid');
						this.errorMsg='Password and confirm password are not the same.';
					}else{
						var obj={
							firstName: this.userInput.firstName,
							lastName: this.userInput.lastName,
							email: this.userInput.email,
							password: this.userInput.password,
                            role: 'user'
						};

                        $.ajax({
                            type: 'POST',
                            url: dbURL+'/users',
                            data: JSON.stringify(obj),
                            contentType: 'application/json; charset=utf-8',
                            success: function(data){
                                self.successMsge=true;
                            },
                            error: function(err){
                                console.log(err);
                                self.errorMsg="Could not add user! User may already exist.";
                            }
                        });
					}
				}
			}
		});
	};

	return ViewModel;
})();
