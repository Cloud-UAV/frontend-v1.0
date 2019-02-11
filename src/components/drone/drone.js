$(document).ready(function () {
    var droneView = new DroneView();
    droneView.pageContainer.getUserInfo();
    $('select').material_select();
    
    $('.selectProject').change(function () {
        droneView.pageContainer.selectEvent(this.value);
    });
});
