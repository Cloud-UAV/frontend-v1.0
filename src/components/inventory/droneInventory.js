$(document).ready(function () {
    var inventoryView = new InventoryView();
    inventoryView.pageContainer.getUserInfo();
    
    $('.selectProject').change(function () {
        inventoryView.pageContainer.projectChanged(this.value);
    });
});
