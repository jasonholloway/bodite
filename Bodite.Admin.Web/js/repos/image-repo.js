(function() {	
	var AWS = require('aws-sdk');
	
    var app = angular.module('BoditeAdmin');


    app.service('imageRepo', ['aws', function (aws) {
        var createKey = function () {
            return 'prodimg/' + Math.uuidFast();
        }

        return {
            getUrl: function (key) {
                return 'https://s3.eu-central-1.amazonaws.com/bodite/' + key;
            },

            save: function (blob) {
                return new Promise(function (success, failed) {
                    var key = createKey();

                    var bucket = new AWS.S3({ params: { Bucket: 'bodite' } });

                    var params = {
                        Key: key,
                        Body: blob,
                        ACL: 'public-read',
                        ContentType: blob.type,
                        //ContentMD5: ''
                    };

                    bucket.upload(params, function (err, data) {
                        if (err) failed(err);
                        else success(key);
                    });
                })
            }
        }
    }])


	
	
})();