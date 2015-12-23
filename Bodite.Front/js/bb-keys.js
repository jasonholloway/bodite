(function () {
    
    var app = angular.module('BoditeAdmin');

    // Get map of access keys from server

    app.service('accessKeyProvider', [function () {

        var keys;

        this.getKeys = function () {
            if (!keys) {
                //load this from server...
                keys = {
                    aws: {
                        accessKeyId: 'AKIAJBNPCUXVCW3HFRHA',
                        secretAccessKey: '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'
                    }
                };
            }

            return keys;
        }


    }]);



})();


