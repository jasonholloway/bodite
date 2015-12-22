(function () {

    require('angular');
    require('angular-dialog-service');


    var app = angular.module('BoditeAdmin');



    app.service('user', ['$http', 'dialogs', function ($http, dialogs) {
        var self = this;
        var currentUser = null;

        this.login = function (user, password) {
            self.logout();

            $http.post('login', { user: user, password: password })
            .then(function (r) {
                currentUser = {
                    user: r.data.user,
                    key: r.data.key
                }
            }, function (r) {
                alert('Error logging in...');
            });
        }

        this.logout = function () {
            if (currentUser) {
                currentUser = null;
            }
        }

        this.getCurrent = function () {
            if (!currentUser) {
                dialogs.create('loginTemplate', 'loginController', { user: null, password: null });
            }

            return currentUser;
        }

    }])


    app.controller('loginController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        this.done = function () {
            $modalInstance.close('ok');
        }
    }])


    app.run(['$templateCache', function ($templateCache) {
        $templateCache.put(
            'loginTemplate',
            [
                '<div class="modal-header">',
                    '<h4 class="modal-title">Log-in</h4>',
                '</div>',
                '<div class="modal-body">',
                    '<p class="input-group">',
                        '<input type="text" class="form-control" ng-model="data.user" />',
                        '<input type="password" class="form-control" ng-model="data.password" />',
                    '</p>',
                '</div>',
                '<div class="modal-footer">',
                    '<button class="btn btn-default" ng-click="done()">Done</button>',
                '</div>'
            ].join('\n'));


    }]);

})();


