$(document).ready(function() {
    var viewModel = new ViewModel();
    viewModel.pageContainer.getUserInfo();
    $('select').material_select();
    $('.select-wrapper > span').removeClass('caret');

    $('#smartwizard').smartWizard({
        theme: 'arrows',
        selected: 0,
        useURLhash: true,
        toolbarSettings: {
            showNextButton: false,
            showPreviousButton: false,
            toolbarExtraButtons: [
                $('<a id="resetBtn" class="reset waves-effect waves-light red darken-1 btn">Reset</a>').on('click', function() {
                    $('#smartwizard').smartWizard('reset');
                    viewModel.pageContainer.reset();
                    viewModel.pageContainer.iframeResize();
                }),
                $('<a class="waves-effect waves-light btn disabled" id="previousBtn">Previous</a>').on('click', function() {
                    $('#smartwizard').smartWizard('prev');
                    viewModel.pageContainer.iframeResize();
                }),
                $('<a class="waves-effect waves-light btn disabled" id="nextBtn">Next</a>').on('click', function() {
                    $('#smartwizard').smartWizard('next');

                    viewModel.pageContainer.iframeResize();
                })
            ]
        }
    });

    $("#smartwizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection, stepPosition) {
        if (stepPosition === 'first') {
            $("#previousBtn").addClass('disabled');
        } else if (stepPosition === 'final') {
            if(viewModel.pageContainer.droneModel.reviewDrone.length ==0){
                viewModel.pageContainer.droneModel.reviewDrone=[{
                    name: viewModel.pageContainer.droneModel.name,
                    description: viewModel.pageContainer.droneModel.description,
                    inventory: viewModel.pageContainer.droneModel.inventory,
                }];
            }
            $("#nextBtn").addClass('disabled');
        } else {
            $("#previousBtn").removeClass('disabled');
            $("#nextBtn").removeClass('disabled');
        }
        viewModel.pageContainer.iframeResize();
    });

    $('.selectProject').change(function() {
        viewModel.pageContainer.projectModel.selectedProject = this.value;
        var elem, value = this.value;

        viewModel.pageContainer.projectModel.projects.some(function(curr, i) {
            if (curr.id == value) {
                elem = curr;
                return true;
            }
        });
        console.dir(viewModel.pageContainer.projectModel.projects);
        viewModel.pageContainer.projectModel.existingProjectData = elem;
        viewModel.pageContainer.projectModel.name = elem.name;
        viewModel.pageContainer.projectModel.description = elem.description;
    });

    $('.selectPersonnel').change(function() {
        viewModel.pageContainer.personnel.selectedPersonnel = $(this).val();

        var obj = [];
        viewModel.pageContainer.personnel.selectedPersonnel.forEach(function(curr) {
            viewModel.pageContainer.personnel.personnelArr.some(function(elem) {
                if (elem['id'] == curr) {
                    obj.push(elem);
                    return true;
                }
            });
        });
        viewModel.pageContainer.personnel.reviewPersonnel = obj;
    });
    
    $('.selectedDrone').change(function() {
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