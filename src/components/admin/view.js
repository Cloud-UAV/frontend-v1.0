var ViewModel = (function() {
    var ViewModel = function() {
        var controller = new Controller();

        this.pageContainer = new Vue({
            el: '#pageContainer',
            mixins: [mixin],
            data: {
                loading: true,
                errorMsg: undefined,
                closeSideBar: true,
                user: {
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    id: undefined
                },
                contentData: {
                    itemsArr: [],
                    usersArr: []
                },
                searchWord: undefined,
                chipsArr: [],
                content: {
                    projects: false,
                    users: true,
                    drones: false,
                    files: false
                }
            },
            methods: {
                            
                loadingSpinner: function(value) {
                    this.loading = value;
                    
                },
                show_hide_contents: function(type) {
                    var self = this;

                    Object.keys(this.content).forEach(function(curr, i) {
                        if (curr == type) {
                            self.content[curr] = true;
                        } else {
                            self.content[curr] = false;
                        }
                    });
                },
                usesRoleIsAdmin : function(user){
                    return user.role == 'user'
                },
                changeRoleToggle: function (user){
                  var self = this;

                  controller.changeRole(user).then(function(response) {
                      console.log(response);
                      self.contentData.usersArr.some(function(curr, i) {
                          if (curr.id == response.id) {
                              self.contentData.usersArr[i] = response;
                              var temp = self.contentData.usersArr;
                              self.contentData.usersArr = [];
                              self.contentData.usersArr = temp;
                              return true;
                          }
                      });
                        self.contentData.usersArr.sort(function(a,b){
                        return a.role > b.role;
                      });
                  });
                },
                deleteItem: function(type, item, event) {
                    event.stopPropagation();
                    var query, id, itemsArr, self = this;

                    if (type == 'users') {
                        id = item.id;
                        itemsArr = self.contentData.usersArr;
                        query = '/users/' + id;
                    } else if (type == 'projects') {
                        id = item.id;
                        itemsArr = self.contentData.itemsArr;
                        query = '/projects/' + id;
                    } else if (type == 'drones') {
                        id = item.id;
                        itemsArr = self.contentData.itemsArr;
                        query = '/drones/' + id;
                    } else if (type == 'files') {
                        id = item.id;
                        itemsArr = self.contentData.itemsArr;
                        query = '/files/' + item.userID + '/' + item.droneID + '/' + item.name;
                    }

                    controller.deleteItem(query, type, id).then(function() {
                        itemsArr.some(function(curr, i) {
                            if (curr.id == id) {
                                itemsArr.splice(i, 1);
                                return true;
                            }
                        });

                        $('.modal.open').modal('close');
                        $('.modal-overlay').remove();
                        self.showToast('The ' + type.slice(0, -1) + ' was deleted','success');
                    });
                },
                showImage: function(item) {
                    var extension = item.name.split('.')[1].toLowerCase();

                    if (extension == 'las' || extension == 'laz') {
                        window.location.href = '../dataViewer/viewer.html?name=' + item.name + '&url=' + dataStorageURL + '/drones/' + item.droneID + '/' + item.name;
                    } else if (extension != 'jpeg' && extension != 'png' && extension != 'jpg' && extension != 'gif') {
                        window.open(dataStorageURL + '/drones/' + item.droneID + '/' + item.filename, '_blank');
                    } else {
                        $('.lightboxImage').attr('href', dataStorageURL + '/drones/' + item.droneID + '/' + item.name);
                        $('.lightboxImage').attr('data-title', item.name + '<br/>' + item.uploadDate);
                        $('.lightboxImage').click();
                    }
                },
                removeChip: function(key) {
                    var index, elem, specificID;
                    var self = this;

                    this.chipsArr.some(function(curr, i) {
                        if (curr.name == key) {
                            index = i;
                            elem = curr;
                            return true;
                        }
                    });
                    var length = 1,
                        value;
                    if (this.chipsArr.length > 1) {
                        length = (this.chipsArr.length) - index;
                    }

                    if (this.chipsArr.length >= 1) {
                        if (elem.prevType == 'drones') {
                            specificID = controller.currIDList.projectID;
                        } else if (elem.prevType == 'projects') {
                            specificID = controller.currIDList.userID;
                        }
                        value = elem.prevType;

                        self.showContent(elem.prevType, specificID, elem.name, false);
                    } else {
                        value = 'users'
                    }

                    this.show_hide_contents(value);
                    var deleteItems = this.chipsArr.splice(index, length);
                },
                showContent: function(type, id, name, addFlag) {
                    var self = this;

                    controller.showContents(type, id, name).then(function(response) {
                        var data = response.data;
                        var prevType = response.prevType;
                        self.contentData.itemsArr = data;
                        self.show_hide_contents(type);

                        if (addFlag) {
                            self.chipsArr.push({
                                name: name,
                                value: id,
                                type: type,
                                prevType: prevType
                            });
                        }

                        self.$nextTick(function() {
                          this.initModal();
                          $('.card-content').matchHeight();
                        });
                    });

                },
                search: function() {
                    var search = new JsSearch.Search('name'),
                        self = this;

                    if (this.content.users == true) {
                        search.addIndex('email');
                        search.addIndex('firstName');
                        search.addIndex('lastName');
                        search.addIndex('role');
                        search.addDocuments(this.contentData.usersArr);
                    } else if (this.content.projects == true) {
                        search.addIndex('name');
                        search.addIndex('description');
                        search.addDocuments(controller.data.projects);
                    } else if (this.content.drones == true) {
                        search.addIndex('name');
                        search.addIndex('description');
                        search.addDocuments(controller.data.drones);
                    } else if (this.content.files == true) {
                        search.addIndex('name');
                        search.addDocuments(controller.data.files);
                    }

                    if (this.searchWord.length == 0) {
                        if (this.content.users == true) {
                            this.contentData.usersArr = controller.data.users;
                        } else if (this.content.projects == true) {
                            this.contentData.itemsArr = controller.data.projects;
                        } else if (this.content.drones == true) {
                            this.contentData.itemsArr = controller.data.drones;
                        } else if (this.content.files == true) {
                            this.contentData.itemsArr = controller.data.files;
                        }
                    } else {
                        var searchedArr = search.search(this.searchWord);

                        if (this.content.users == true) {
                            this.contentData.usersArr = searchedArr;
                        } else {
                            this.contentData.itemsArr = searchedArr;
                        }

                    }
                },
                getAllUsers: function() {
                    var self = this;
                    var deferred = $.Deferred();
                    controller.getUsers().then(function(data) {
                        self.contentData.usersArr = data;
                        deferred.resolve(data);
                        self.$nextTick(function() {
                          this.initModal();
                          $('.card-content').matchHeight();
                        });
                    });
                    return deferred.promise();
                },
                getUserInfo: function() {
                    var userInfo = localStorage.getItem("user");
                    var self = this;

                    if (userInfo == undefined || userInfo.length == 0) {
                        window.location.href = '../../index.html';
                    } else {
                        this.user = JSON.parse(userInfo);
                        controller.loggedinUser = JSON.parse(userInfo);

                        this.initSideNav();
                        this.brandTopBtn();
                        this.getAllUsers().then(function() {
                            controller.getDS().then(function(data) {
                                controller.initMQTT();
                                self.loadingSpinner(false);
                            });
                        });


                    }
                }

            }
        });
    };

    return ViewModel;
})();
