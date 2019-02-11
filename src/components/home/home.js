$(document).ready(function () {
    var homeView = new HomeView();
    homeView.pageContainer.getUserInfo();
    $('.tooltipped').tooltip({delay: 10});
});
