// var viewModel = new ViewModel();
$(document).ready(function () {
    var viewModel = new ViewModel();
    viewModel.pageContainer.loadingSpinner(false);

    $('#file').click(function () {
        viewModel.pageContainer.messageBox = false
    });
    $('#file').change(function () {
        var tokens = $(this).val().split('\\');
        viewModel.pageContainer.showFileLabel = false;
        viewModel.pageContainer.fileNames = [];

        var keys = Object.keys($(this).get(0).files);

        for (var i in keys) {
            viewModel.pageContainer.fileNames.push($(this).get(0).files[i].name);
        }
        viewModel.pageContainer.disableUploadBtn = false;
    });

    $('#file').bind('mousewheel', function (event) {
        if (event.originalEvent.deltaY > 0) {
            $('.fileInputBoxBorder').scrollTop(event.originalEvent.deltaY);
        } else {
            $('.fileInputBoxBorder').scrollTop(event.originalEvent.deltaY);
        }
    });

    $('#project').change(function () {
        viewModel.pageContainer.projectChangedEvent(this.value);
    });

    $('#droneProject').change(function () {
        viewModel.pageContainer.droneChangedEvent(this.value);
    });
});
