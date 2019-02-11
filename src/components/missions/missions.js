$(document).ready(function () {
    var missionsView = new MissionsView();
    missionsView.pageContainer.getUserInfo();

    $('.projectSelect').on('change', function(){
       missionsView.pageContainer.projectChanged($(this).val()); 
    });
});
