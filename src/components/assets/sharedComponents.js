var SideNavBar_Component = Vue.component('side-nav-bar', {
    template: "<ul id=\"slide-out\" class=\"side-nav fixed z-depth-3\">"+
        '<li class="center no-padding">'+
          '<div class="theme white-text" style="height: 184px;">'+
            '<div class="row">'+
              '<div class="col s12">'+
              '<img style="margin-top: 20%;" height="40" src="../../img/CloudUAV_White.png">'+
              '<p>{{user.firstName}} {{user.lastName}}</p>'+
              '</div>'+
              // '<p>{{user.email}}</p>'+
            '</div>'+
        '  </div>'+
        '</li>'+
        "<li><a href=\"/components/home/home.html\" tabindex=\"-1\"><i class=\"fa fa-home\" aria-hidden=\"true\"></i> Home</a></li>" +
        //create
        "<li><a href=\"/components/drone/addDrone.html\" tabindex=\"-1\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Create/Edit Project</a></li>" +
        //components map
        "<li><a href=\"/components/compliance/compliance.html\" tabindex=\"-1\"><i class=\"fa fa-map\" aria-hidden=\"true\"></i> Compliance Map</a></li>" +
        //project
        "<li><a href=\"/components/projects/projects.html\" tabindex=\"-1\"><i class=\"fa fa-folder\" aria-hidden=\"true\"></i> Projects</a></li>" +
        //UAVs
        "<li class=\"dropdown\" v-bind:class='{highlight: droneDropdown}'>" +
        "<a class=\"ripple-effect dropdown-toggle\" data-toggle=\"dropdown\" v-on:click='dropdownToggle($event, \"drone\")'>" +
        "<i class=\"fa fa-plane\" aria-hidden=\"true\"></i>UAVs<b class='fa fa-angle-down'></b></a>" +
        "<ul class=\"drone dropdown-menu\">" +
        "<li><a href=\"/components/drone/drone.html\" tabindex=\"-1\">View</a></li>" +
        "<li><a href=\"/components/drone/createDrone.html\" tabindex=\"-1\">Create</a></li>" +
        // "<li><a href=\"/components/inventory/droneInventory.html\" tabindex=\"-1\">Inventory</a></li>" +
        "</ul></li>" +

        //sensor
        "<li class=\"dropdown\" v-bind:class='{highlight: sensorsDropdown}'>" +
        "<a class=\"ripple-effect dropdown-toggle\" data-toggle=\"dropdown\" v-on:click='dropdownToggle($event, \"sensors\")'>" +
        "<i class=\"fa fa-rss\" aria-hidden=\"true\"></i>Sensors<b class='fa fa-angle-down'></b></a>" +
        "<ul class=\"sensors dropdown-menu\">" +
        "<li><a href=\"/components/sensors/sensors.html\" tabindex=\"-1\">View</a></li>" +
        "<li><a href=\"/components/sensors/createSensor.html\" tabindex=\"-1\">Create</a></li>" +
        "<li><a href=\"/components/inventory/sensorInventory.html\" tabindex=\"-1\">Inventory</a></li>" +
        "</ul></li>" +

        //personnel
        "<li class=\"dropdown\" v-bind:class='{highlight: personnelDropdown}'>" +
        "<a class=\"ripple-effect dropdown-toggle\" data-toggle=\"dropdown\" v-on:click='dropdownToggle($event,\"personnel\")'>" +
        "<i class=\"fa fa-user\" aria-hidden=\"true\"></i>Personnel<b class='fa fa-angle-down'></b></a>" +
        "<ul class=\"personnel dropdown-menu\">" +
        "<li><a href=\"/components/personnel/personnel.html\" tabindex=\"-1\">View</a></li>" +
        "<li><a href=\"/components/personnel/createPersonnel.html\" tabindex=\"-1\">Create</a></li>" + "</ul></li>" +

        //missions
        "<li class=\"dropdown\" v-bind:class='{highlight: missionsDropdown}'>" +
        "<a class=\"ripple-effect dropdown-toggle\" data-toggle=\"dropdown\" v-on:click='dropdownToggle($event,\"missions\")'>" +
        "<i class=\"fa fa-rocket\" aria-hidden=\"true\"></i>Missions<b class='fa fa-angle-down'></b></a>" +
        "<ul class=\"missions dropdown-menu\">" +
        "<li><a href=\"/components/missions/missions.html\" tabindex=\"-1\">View</a></li>" +
        "<li><a href=\"/components/missions/createMission.html\" tabindex=\"-1\">Create</a></li>" + "</ul></li>" +

        //files
        "<li class=\"dropdown\" v-bind:class='{highlight: filesDropdown}'>" +
        "<a class=\"ripple-effect dropdown-toggle\" data-toggle=\"dropdown\" v-on:click='dropdownToggle($event, \"files\")'>" +
        "<i class=\"fa fa-file\" aria-hidden=\"true\"></i>Media<b class='fa fa-angle-down'></b></a>" +
        "<ul class=\"files dropdown-menu\">" +
        "<li><a href=\"/components/files/files.html\" tabindex=\"-1\">My Media</a></li>" +
        "<li><a href=\"/components/sharedFiles/sharedFiles.html\" tabindex=\"-1\">Shared</a></li>" +
        "<li><a href=\"/components/publicFiles/publicFiles.html\" tabindex=\"-1\">Public</a></li>" +
        "<li><a href=\"/components/uploadFile/uploadFiles.html\" tabindex=\"-1\">Upload</a></li></ul></li>" +
        "<li><div class=\"divider\"></div></li>" +
        "<li style='height: 10px;'><a class=\"subheader\"></a></li>" +
        "<li v-show='adminLink'><a class=\"waves-effect\" href=\"/components/admin/admin.html\">Admin</a></li>" +
        "<li><a href=\"https://www.clouduav.ca/single-post/2018/04/09/CloudUAV---Frequently-Asked-Questions\" target=\"_blank\" class=\"waves-effect\">FAQ</a></li>" +
        "<li><a href=\"/components/faq/faq.html\" target=\"_blank\" class=\"waves-effect\">Help</a></li>" +
        // "<li><a href=\"/components/accountDetails/accountDetails.html\" class=\"waves-effect\">My Account</a></li>" +
        "<li><a class=\"waves-effect\" v-on:click='logoutBtn'>Logout</a></li></ul>",
    data: function () {
        return {
            filesDropdown: false,
            droneDropdown: false,
            projectsDropdown: false,
            personnelDropdown: false,
            missionsDropdown: false,
            sensorsDropdown: false,
            adminLink: false
        }
    },
    props: ['user'],
    watch: {
        user: function () {
            if (this.user != undefined) {
                if (this.user.role == 'admin') {
                    this.adminLink = true;
                }
            }
        }
    },
    methods: {
        logoutBtn: function () {
            localStorage.removeItem("user");
            window.location.href = '/components/login/login.html';
//            httpCalls.logout().then(function(){
//                localStorage.removeItem("user");
//                window.location.href = '/index.html';
//            }, function(err){
//                console.log(err);
//            });
        },
        dropdownToggle: function (event, identifier) {
            event.preventDefault();
            event.stopPropagation();

            if ($('.' + identifier + '.dropdown-menu').css('display') == 'block') {
                this[identifier + 'Dropdown'] = false;

                $('.' + identifier + '.dropdown-menu').css('display', 'none');
            } else {
                this[identifier + 'Dropdown'] = true;

                $('.' + identifier + '.dropdown-menu').css('display', 'block');
            }

        },
    }
});


var mixin = {
    methods: {
        initSideNav: function () {
            $(".button-collapse").sideNav({
                menuWidth: 300,
                edge: 'left',
                closeOnClick: false,
                draggable: true
            });
        },
        logoutBtn: function () {
            localStorage.removeItem("user");
            window.location.href = '/components/login/login.html';
        },
        brandTopBtn: function () {
          $('.dropdown-button').dropdown({
              inDuration: 300,
              outDuration: 225,
              constrainWidth: false, // Does not change width of dropdown to that of the activator
              hover: false, // Activate on hover
              gutter: 0, // Spacing from edge
              belowOrigin: false, // Displays dropdown below the button
              alignment: 'left', // Displays dropdown with edge aligned to the left of button
              stopPropagation: false // Stops event propagation
            }
          );
        },
        initModal:function(){
          $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .8, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '40%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
          });
        },
        showToast:function(content, type, duration=4){
          Materialize.toast(content, duration*1000, type);
        }
    }

};

var Toolbar_Menu_Component = Vue.component('menubar-icon', {
    template: '<a data-activates="slide-out" class=\'button-collapse\'><i class="fa fa-bars" aria-hidden="true"></i></a>',
    mixins: [mixin]
});

Vue.directive('select', {
    el: '#droneProject',
    componentUpdated: function (el, binding) {
        $(el).material_select();
    },
    bind: function (el, binding, vnode) {
        $(el).material_select();

        $(el).on('change', function () {
            el.dataset.selectedvalue = $(el).val();
        });
    },
    unbind: function (el) {
        $(el).material_select('destroy');
    }
});
