var ViewModel = (function() {
	var ViewModel = function(){
		this.pageContainer = new Vue({
			el: '#pageContainer',
            mixins: [mixin],
			data: {
				loading: true,
				errorMsg: undefined,
				closeSideBar: true,
				user: {
					firstName: undefined,
					lastName: undefined,
					email: undefined,
					id: undefined
				},
				viewFile: true,
			},
			methods: {
				loadingSpinner: function(value){
					this.loading=value;
				},
				options: function(event){
					var name = $(event.currentTarget).attr('id');

					if($('#'+name).hasClass('active')){
						$('.optionBtnsList > a.active').removeClass('active');
					}else{
						$('.optionBtnsList > a.active').removeClass('active');
						$('.optionBtnsList > a#'+name).addClass('active');
					}

					$('#iframe')[0].contentWindow.options(name);
				},
				getAllFiles: function(){
					var promise = httpCalls.db_getData('/'+this.user.id+'/files/share');
					promise.then(function(data){
                        console.log(data);
						var interval = setInterval(function(){ checkIframe(); }, 1);
						var checkIframe=function(){
							if(typeof $('#iframe')[0].contentWindow.getData == 'function'){
								$('#iframe')[0].contentWindow.getData(data);
								clearInterval(interval);
								interval=undefined;
							}
						}
					}, function(data){
						console.log('error');
						console.log(data);
					});
				},
				getUserInfo: function(){
					var userInfo = localStorage.getItem("user");
					if(userInfo == undefined || userInfo.length == 0){
						window.location.href='../../index.html';
					}else{
						this.user=JSON.parse(userInfo);
						this.getAllFiles();
            this.initSideNav();
						this.brandTopBtn();
						this.loadingSpinner(false);

						$('.uploadFilesLink').dropdown();

					}
				}

			}
		});
	};

	return ViewModel;
})();
