var viewModel;

$(document).ready(function() {
  viewModel = new ViewModel();
  viewModel.pageContainer.getUserInfo();
  $('.stepper').activateStepper({
    autoFocusInput: false
  });

  $('.tooltipped').tooltip({
    delay: 50
  });


  $('.selectProject').change(function() {
    if (this.value.length > 0) {
      viewModel.pageContainer.projectModel.selectedProject = this.value;
      var elem, value = this.value;

      viewModel.pageContainer.projectModel.projects.some(function(curr, i) {
        if (curr.id == value) {
          elem = curr;
          return true;
        }
      });
      console.log(value);
      viewModel.pageContainer.projectModel.selectedProjectID = elem.id;
      //            viewModel.pageContainer.projectModel.existingProjectData = elem;
      viewModel.pageContainer.projectModel.name = elem.name;
      viewModel.pageContainer.projectModel.description = elem.description;
    }

  });

  $('.list').on('change', '.selectPersonnelRole', function() {
    var value = $(this).val();

    if (value.length > 0) {
      var roleID = undefined;
      var obj = _.find(viewModel.pageContainer.personnel.reviewPersonnel, function(curr) {
        return _.find(curr['Roles'], function(elem) {
          if (elem.id == value) {
            roleID = elem.id;
            return true;
          }
          return false;
        });
      });
      var index = _.findIndex(viewModel.pageContainer.personnel.selectedRoles, function(curr) {
        return curr['personnelID'] == obj.id;
      });

      if (index != -1) {
        viewModel.pageContainer.personnel.selectedRoles[index]['roleID'] = roleID;
      } else {
        viewModel.pageContainer.personnel.selectedRoles.push({
          roleID: roleID,
          personnelID: obj.id
        });
      }
    }
  });

  $('.selectPersonnel').change(function() {
    viewModel.pageContainer.personnel.selectedPersonnel = $(this).val();
    viewModel.pageContainer.personnel.selectedRoles = [];
    var obj = [];
    viewModel.pageContainer.personnel.selectedPersonnel.forEach(function(curr) {
      viewModel.pageContainer.personnel.personnelArr.some(function(elem) {
        if (elem['id'] == curr) {
          obj.push(elem);

          viewModel.pageContainer.personnel.selectedRoles.push({
            roleID: elem['Roles'][0].id,
            personnelID: elem.id
          });

          return true;
        }
      });
    });
    viewModel.pageContainer.personnel.reviewPersonnel = obj;
    setTimeout(function() {
      $('select').material_select();
      $('input[type="checkbox"]').addClass('customCheckbox');
    }, 1);
  });

  $(".collapsible-body").removeAttr("style")

  $('.collapsible').collapsible();

  $('.selectedDrone').change(function() {
    if ($(this).val().length > 0) {
      viewModel.pageContainer.droneModel.selectedDrone = $(this).val();

      var obj = [];
      viewModel.pageContainer.droneModel.selectedDrone.forEach(function(curr) {
        viewModel.pageContainer.droneModel.dronesArr.some(function(elem) {
          if (elem['id'] == curr) {
            obj.push(elem);
            return true;
          }
        });
      });
      viewModel.pageContainer.droneModel.reviewDrone = obj;
    }

  });

  $('.selectedSensor').change(function() {
    viewModel.pageContainer.sensor.selectedSensor = $(this).val();

    var obj = [];
    viewModel.pageContainer.sensor.selectedSensor.forEach(function(curr) {
      viewModel.pageContainer.sensor.sensorArr.some(function(elem) {
        if (elem['id'] == curr) {
          obj.push(elem);
          return true;
        }
      });
    });
    viewModel.pageContainer.sensor.reviewSensor = obj;
  });

  $('#file').change(function() {
    var tokens = $(this).val().split('\\');
    viewModel.pageContainer.complianceFiles.fileNames = [];

    var keys = Object.keys($(this).get(0).files);

    for (var i in keys) {
      viewModel.pageContainer.complianceFiles.fileNames.push($(this).get(0).files[i].name);
    }
  });

  $('#file').bind('mousewheel', function(event) {
    if (event.originalEvent.deltaY > 0) {
      $('.fileInputBoxBorder').scrollTop(event.originalEvent.deltaY);
    } else {
      $('.fileInputBoxBorder').scrollTop(event.originalEvent.deltaY);
    }
  });

});

var iframeLoaded = function() {
  if ($('#iframe')[0]) {
    $('#iframe').height($('#iframe')[0].contentWindow.document.body.scrollHeight);
  }
};

var showMessage = function() {
  viewModel.pageContainer.messageBox = true;

  setTimeout(function() {
    $(".mesge").fadeOut(3000);
    setTimeout(function() {
      viewModel.pageContainer.messageBox = false;
    }, 3001);

  }, 1000);
};
