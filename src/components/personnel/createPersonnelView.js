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
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    phoneNumber: undefined,
                    roles: [],
                    img: undefined,
                    file: undefined
                },
                files: {
                    showFileLabel: true,
                    filesArr: [],
                    dragDropArea: false
                },
                messageBox: false,
                showProgressbar: false,
                progressbarClass: true,
                disableSubmitBtn: false,
                progressbarWidth: '0%',
            },
            methods: {
                loadingSpinner: function (value) {
                    this.loading = value;
                },
                closeMessagAlert: function () {
                    this.messageBox = false;
                },
                createPersonnel: function () {
                    var self = this;
                    self.messageBox = false;
                    this.disableSubmitBtn = true;
                    this.progressbarClass = true;
                    this.showProgressbar = true;

                    if (this.personnelModel.firstName == undefined || this.personnelModel.lastName == undefined || this.personnelModel.email == undefined || this.personnelModel.phoneNumber == undefined || this.personnelModel.roles.length ==0) {
                        this.showToast("Please provide necessary information",'danger');
                        return;
                    } else {
                        var formData = new FormData();
                        formData.append('firstName', this.personnelModel.firstName);
                        formData.append('lastName', this.personnelModel.lastName);
                        formData.append('email', this.personnelModel.email);
                        formData.append('userID', this.user.id);
                        formData.append('phoneNumber', this.personnelModel.phoneNumber);
                        formData.append('roles', JSON.stringify(this.personnelModel.roles));

                        if (this.personnelModel.img != undefined) {
                            formData.append('personnelImage', this.personnelModel.file);
                        }

                        if (this.files.filesArr.length > 0) {
                            this.files.filesArr.forEach(function (curr, i) {
                                formData.append('personnelFiles-' + i, curr);
                            });
                        }

                        personnelController.postPersonnel(formData, self).then(function (data) {
                            self.disableSubmitBtn = false;
                            self.showProgressbar = false;
                            self.progressbarClass = false;
                            self.showToast('The personel ' + self.personnelModel.firstName + ' ' + self.personnelModel.lastName + ' has been created','success');
                            setTimeout(function(){location.href="../personnel/personnel.html"} , 2000);
                          }, function (err) {
                            self.disableSubmitBtn = false;
                            self.showProgressbar = false;
                            self.progressbarClass = false;
                            this.showToast("Sorry, something went wrong. Please try again.",'danger');
                        });

                    }
                },
                getUserInfo: function () {
                    var userInfo = localStorage.getItem("user");

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);

                        this.loadingSpinner(false);
                        $('select').material_select();
                        $('input[type="checkbox"]').addClass('customCheckbox');

                        this.initSideNav();
                    }
                }

            }
        });
    };

    return PersonnelView;
})();
