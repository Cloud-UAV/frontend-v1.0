var ViewModel = (function() {
  var ViewModel = function() {
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
        messageBox: false,
        droneModel: {
          name: undefined,
          description: undefined,
          inventory: undefined,
          disableBtn: false,
          messageBox: false,
          reviewDrone: [],
          showExistingDrones: false,
          showCreateDrone: false,
          dronesArr: [],
          selectedDrone: [],
          type: undefined,
        },
        projectModel: {
          projectCreated: false,
          selectedProjectID: undefined,
          name: undefined,
          description: undefined,
          showCreateProject: false,
          showExistingProject: false,
          projects: [],
          type: undefined,
          selectedProject: undefined,
          existingProjectData: {}
        },
        shareModel: {
          email: undefined,
          emailsArr: [],
        },
        personnel: {
          personnelArr: [],
          selectedPersonnel: [],
          selectedRoles: [],
          reviewPersonnel: []
        },
        sensor: {
          selectedSensor: [],
          sensorArr: [],
          reviewSensor: [],
        },
        review: {
          reviewErrorMsge: false,
          errorMessageContent: '',
        },
        complianceFiles: {
          fileNames: [],
          showFileLabel: true,
          dragDropArea: false
        }
      },
      methods: {
        loadingSpinner: function(value) {
          this.loading = value;
        },
        closeMessageBox: function() {
          this.messageBox = false;
        },
        iframeResize: function() {
          setTimeout(function() {
            window.parent.iframeLoaded();
          }, 1);
        },
        reset: function() {
          this.droneModel.name = undefined;
          this.droneModel.description = undefined;
          $(':radio').prop('checked', false);

          this.projectModel.showExistingProject = false;
          this.projectModel.showCreateProject = false;
          this.projectModel.name = undefined;
          this.projectModel.description = undefined;
          setTimeout(function() {
            $('.tab-content').removeAttr('style');
          }, 450);

        },
        selectedRadioBtn: function(type) {
          if (type == 'existingProject') {
            this.projectModel.showExistingProject = true;
            this.projectModel.showCreateProject = false;
            this.projectModel.name = this.projectModel.existingProjectData.name;
            this.projectModel.description = this.projectModel.existingProjectData.description;
            this.projectModel.type = type;
          } else if (type == 'newProject') {
            this.projectModel.name = undefined;
            this.projectModel.description = undefined;
            this.projectModel.showCreateProject = true;
            this.projectModel.showExistingProject = false;
            this.projectModel.type = type;
          } else if (type == 'existingDrone') {
            this.droneModel.showExistingDrones = true;
            this.droneModel.showCreateDrone = false;
            this.droneModel.type = type;
          } else if (type == 'newDrone') {
            this.droneModel.showExistingDrones = false;
            this.droneModel.showCreateDrone = true;
            this.droneModel.type = type;
          }


          this.iframeResize();
          $('#nextBtn').removeClass('disabled');

        },
        removeEmail: function(email) {
          console.log(email);
          var index;
          this.shareModel.emailsArr.some(function(curr, i) {
            if (curr == email) {
              index = i;
              return true;
            }
          });
          this.shareModel.emailsArr.splice(index, 1);
        },
        addSharedWithUsersEmail: function() {
          // console.log(this.shareModel.email);
          // this.shareModel.emailsArr.push(this.shareModel.email);
          // this.shareModel.email = undefined;
          function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            return pattern.test(emailAddress);
          }

          if (this.shareModel.email != undefined) {
            if (isValidEmailAddress(this.shareModel.email)) {
              $("#emailLabel").attr('data-success', "Looks good!");
              this.shareModel.emailsArr.push(this.shareModel.email);
              this.shareModel.email = undefined;
              $("#emailLabel").removeAttr('data-success');
              return;

            } else {
              $("#email").addClass("invalid");
              $("#emailLabel").attr('data-error', "Please enter a valid email address!");

              this.showToast("Please enter valid email address", 'danger');
              return;
            }
          }
        },

        projectValidate: function() {
          if (this.projectModel.name == undefined || this.projectModel.name == '' && this.projectModel.type == 'newProject') {
            this.showToast("Please create a new project or select one from the existing projects", 'danger');
            $('.stepper').prevStep();
            return;
          }
        },

        filesValidate: function() {
          if (this.complianceFiles.fileNames.length == 0 && this.projectModel.type == 'newProject') {
            this.showToast("Please upload and attach project files including SFOCs and project information.", 'danger');
            $('.stepper').prevStep();
            return;
          }
        },

        uavValidate: function() {
          if (this.droneModel.selectedDrone.length == 0 && this.projectModel.type == 'newProject') {
            this.showToast("Please select one or more UAVs for the project", 'danger');
            $('.stepper').prevStep();
            return;
          }
        },

        sensorValidate: function() {
          if (this.sensor.selectedSensor.length == 0 && this.projectModel.type == 'newProject') {
            this.showToast("Please select one or more sensors for the project", 'danger');
            $('.stepper').prevStep();
            return;
          }
        },

        personnelValidate: function() {
          if (this.personnel.selectedPersonnel.length == 0 && this.projectModel.type == 'newProject') {
            this.showToast("Please select one or more personnels for the project", 'danger');

            var projectPersRoleIDs = _.map(this.personnel.selectedRoles, function(curr) {
              return curr['roleID'];
            });

            if (this.personnel.selectedRoles.length == 0 && this.projectModel.type == 'newProject') {
              this.showToast("Please select one or more roles for the personnel", 'danger');
              $('.stepper').prevStep();
              return;
            }
          }
        },

        emailValidate: function() {
          if (this.shareModel.email != undefined) {
            if (this.shareModel.email != this.shareModel.emailsArr.slice(-1)[0]) {
              $("#emailLabel").attr('data-error', "Please adding this user by clicking the button on the right");
              this.showToast("Please add the user to the project sharing list with the 'add' button", 'danger');
              $('.stepper').prevStep();
              return;
            }
          }
        },

        createDrone: function() {
          this.droneModel.messageBox = false;
          this.review.reviewErrorMsge = false;
          var self = this;

          var projectPersRoleIDs = _.map(this.personnel.selectedRoles, function(curr) {
            return curr['roleID'];
          });

          this.projectValidate();
          this.filesValidate();
          this.uavValidate();
          this.sensorValidate();
          this.personnelValidate();

          var json = {
            userID: this.user.id,
            Drones: this.droneModel.selectedDrone,
            Sensors: this.sensor.selectedSensor,
            Personnels: this.personnel.selectedPersonnel,
            ShareProject: this.shareModel.emailsArr,
            ProjectPersonnelRoles: projectPersRoleIDs
          };
          if (this.projectModel.selectedProjectID != undefined && this.projectModel.showExistingProject == true) {
            json['projectID'] = this.projectModel.selectedProjectID;
          } else {
            json['name'] = this.projectModel.name;
            json['description'] = this.projectModel.description;
          }
          var formData = new FormData();

          $.each($('#file')[0].files, function(i, file) {
            formData.append('file-' + i, file);
          });

          formData.append('ProjectData', JSON.stringify(json));

          droneController.db_postProjectWithFile('/projects', formData).then(function() {

            if (self.projectModel.selectedProjectID != undefined && self.projectModel.showExistingProject == true) {

              self.showToast('The project has been updated', 'success');
              setTimeout(function() {
                location.href = "/components/projects/projects.html"
              }, 2000);

            } else {

              self.showToast('The project ' + self.projectModel.name + ' has been created', 'success');
              setTimeout(function() {
                location.href = "/components/projects/projects.html"
              }, 2000);

            }

          }, function(xhr) {
            self.showToast("Sorry, something went wrong. Please try again.", 'danger');
            console.log(xhr);
          });
        },
        getDrones: function() {
          var self = this;
          httpCalls.db_getData('/' + this.user.id + '/drones').then(function(data) {
            self.droneModel.dronesArr = data;

            setTimeout(function() {
              $('select').material_select();
              $('input[type="checkbox"]').addClass('customCheckbox');
            }, 100);

          });
        },
        getProjects: function() {
          var self = this;
          httpCalls.db_getData('/' + this.user.id + '/projects').then(function(data) {
            self.projectModel.projects = data;
            if (data.length > 0) {
              self.projectModel.selectedProject = data[0].id;
              viewModel.pageContainer.projectModel.selectedProjectID = data[0].id;
              self.projectModel.existingProjectData = data[0];
            }

            setTimeout(function() {
              $('select').material_select();
            }, 1);


            if (data.length != 0) {
              $('#existingProject').removeAttr('disabled');
            }
          });
        },
        getPersonnels: function() {
          var self = this;
          httpCalls.db_getData('/' + this.user.id + '/personnel').then(function(data) {
            self.personnel.personnelArr = data;

            setTimeout(function() {
              $('select').material_select();
              $('input[type="checkbox"]').addClass('customCheckbox');
            }, 100);

          });
        },
        getSensors: function() {
          var self = this;
          httpCalls.db_getData('/' + this.user.id + '/sensors').then(function(data) {
            self.sensor.sensorArr = data;

            setTimeout(function() {
              $('select').material_select();
              $('input[type="checkbox"]').addClass('customCheckbox');
            }, 100);

          });
        },
        getUserInfo: function() {
          var userInfo = localStorage.getItem("user");
          if (userInfo == undefined || userInfo.length == 0) {
            window.location.href = '../../index.html';
          } else {
            this.user = JSON.parse(userInfo);

            this.loadingSpinner(false);
            this.initSideNav();
            this.brandTopBtn();
            this.getProjects();
            this.getDrones();
            this.getSensors();
            this.getPersonnels();
          }
        }

      }
    });
  };

  return ViewModel;
})();
